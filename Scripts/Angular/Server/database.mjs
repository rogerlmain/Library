import base from "../Common/base.mjs";
import moment from "moment";

import mysql from "mysql";


const credentials = {
	host: "localhost",
	user: "root",
	password: "stranger",
	database: "chatroom"
}// credentials;


export default class database extends base {


	constructor () {

		super ();

		this.connection = mysql.createConnection (credentials);
		this.connection.connect ();


		this.run_query = async (query) => {

			return new Promise ((resolve, reject) => {

				this.connection.query (query, (error, records) => {
					if (error) return reject (error);
					if (isset (records.insertId)) return resolve (records.insertId);
					resolve ((records [0].length > 0) ? records [0] : null);
				});

			});

		}// run_query;


		this.get_rows = function (procedure_name, parameters) {

			let parameter_list = new Array ();

			for (let parameter of Object.values (parameters)) {
				if (is_string (parameter))	{ parameter_list.push (quoted (parameter)); continue; }
				if (is_boolean (parameter))	{ parameter_list.push (boolean_string (parameter)); }
				parameter_list.push (parameter);
			}// foreach;

			return this.run_query (`call ${procedure_name} (${parameter_list.join (comma + space)});`);

		}// get_rows;


		this.get_row = function (procedure_name) {
			return this.get_rows.apply (this, Array.from (arguments)).then ((rows) => {
				return (isset (rows) && (rows.length > 0)) ? rows [0] : null;
			});
		}// get_row;


		this.normalized = function (value, type) {
			if (is_numeric (value)) return parseFloat (value);
			if (is_boolean (value)) return boolean_string (value);
			return value;
		}// normalized;


		this.table_columns = async function (tablename, parameters) {

			let result = null;

			return this.get_rows ("select_columns", {table: tablename}).then ((column_names) => {

				let result = null;

				for (let item of column_names) {

					let column_name = item.COLUMN_NAME;
					let column_type = item.DATA_TYPE;
					let column_value = this.normalized (property_value (parameters, column_name));

					if (is_null (column_value)) continue;
					if (!["bit", "int", "tinyint"].contains (column_type)) column_value = quoted (column_value.replace (/'/g, "''"));

				 	if (is_null (result)) result = {};
				 	if (column_name == "password") column_value = `md5 (${column_value})`;

					result [column_name] = column_value;

				}// foreach;

				return result;

			});

		}// table_columns;


		this.update_parameters = function (parameters) {
			let result = null;
			for (let name in parameters) {
				if (!parameters.hasOwnProperty (name)) continue;
				if (is_null (result)) result = new Array ();
				result.push (`${name} = ${parameters [name]}`);
			}// foreach;
			return result.join (comma);
		}// update_parameters;


		this.insert = async function (tablename, parameters) {

			return this.table_columns (tablename, parameters).then (async (columns) => {

				columns ["date_created"] = quoted (moment ().format (sql_date_format));

				let fields = Object.keys (columns).join (comma);
				let values = Object.values (columns).join (comma);

				return this.run_query (`insert into ${tablename} (${fields}) values (${values});`).then (record_id => {
					remove_keys (parameters, "action", "option", "password");
					return merged (parameters, {user_id: record_id});
				});

			});

		}// insert;


		this.update = async function (tablename, parameters, id) {
			if (is_null (id = is_numeric (id) ? parseInt (id) : null)) throw "Invalid id field";
			return this.table_columns (tablename, parameters).then (async (columns) => {

				columns ["last_updated"] = quoted (moment ().format (sql_date_format));

				return (this.run_query (`update ${tablename} set ${this.update_parameters (columns)} where id = ${id};`).then (record_id => {
					remove_keys (parameters, "action", "option");
					return isset (record_id) ? merged (parameters, { handle: parameters.handle }) : null;
				}));

			});
		}// update;



	}// constructor;


	/**** Pseudo-public Section  ****/


	save (tablename, parameters, id = null) {
		if (is_null (id)) return this.insert (tablename, parameters);
		return this.update (tablename, parameters, id);
	}// save;


	select_row (procedure_name, parameters) { return this.get_row.call (this, procedure_name, parameters); }
	select_rows (procedure_name, parameters) { return this.get_rows.call (this, procedure_name, parameters); }


}// database;

