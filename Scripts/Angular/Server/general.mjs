import files from "fs";
import Base from "Scripts/Library/Angular/Common/base.mjs";

// import "querystring";

import multipart from "multiparty";


export default class General extends Base {


	constructor (request, response) {

		super ();


		this.parameter = (name) => {
			if (not_set (this.request_parameters)) return null;
			return get_value (this.request_parameters, "fields", name);
		}// parameter;


		this.parse_cookies = () => {

			let list = {};
			let cookie_string = request.headers.cookie;

			if (not_string (cookie_string)) return;

			cookie_string.split (";").forEach (function (cookie) {
				var parts = cookie.split ("=");
				list [parts.shift ().trim ()] = decodeURI (parts.join ("="));
			});

			return list;

		}// parse_cookies;


		this.load_control = (pagename, parameters) => {

			let contents = files.readFileSync (this.root_path (pagename), "utf8");

			for (let name in parameters) {
				if (!parameters.hasOwnProperty (name)) continue;
				contents = contents.replace (new RegExp (`{{${name}}}`, "gi"), parameters [name]);
			}// for;

			return contents;

		}// load_control;


		this.show_control = (pagename, parameters) => {

			this.write (this.load_control (pagename, parameters));

		}// show_control;


		this.gotten_data = () => {

			if (not_set (this.request)) return null;

			let uri = class_value (this.request, "url").split ("?");
			let parameters = (uri.length > 1) ? uri [uri.length - 1] : null;

			return not_null (parameters) ? querystring.parse (parameters) : null;

		}// gotten_data;


		this.posted_data = async () => {

			return new Promise (async (resolve, reject) => {

				let form = new multipart.Form ();

				if (not_set (this.request)) return resolve (null);

				form.parse (this.request, (error, fields, files) => {

					let result = null;


					function extract_data (collection) {

						let result = null;

						for (let key of Object.keys (collection)) {
							let value = collection [key][0];
							if (not_set (value)) continue;
							if (is_null (result)) result = {}
							result [key] = value;
						}// for;

						return null_value (result);

					}// extract_data;


					function add_data (fieldname, collection) {
						if (not_set (collection)) return;
						if (not_set (result)) result = {}
						result [fieldname] = collection;
					}// add_data;


					if (error) return reject (error);

					resolve ({
						fields: extract_data (fields),
						files: extract_data (files)
					});

				});

			}).catch ((reason) => {
				report_error (reason);
			});

		}// posted_data;


		this.parse_parameters = async () => {

			return new Promise ((resolve, reject) => {

				if (not_set (this.request)) return null;
				if (!this.request.method.matches ("post")) return resolve ({ fields: this.gotten_data () });

				this.posted_data ().then ((parameters) => {
					parameters.fields = merged (parameters.fields, this.gotten_data ());
					resolve (parameters);
				});

			});

		}// parse_parameters;


		/********/


		return new Promise ((resolve, reject) => {

			server.cookie_parent = response;

			this.request = request;
			this.response = response;

			this.cookies = this.parse_cookies ();

			this.parse_parameters ().then (parameters => {
				this.parameters = parameters.fields;
				this.files = null_value (parameters.files);
				resolve (this);
			});

		});

	}// constructor;


}// General;


