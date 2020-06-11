import "./globals.mjs";


server.sql_date_format = "Y-M-D H:mm:ss";
server.american_date_format = "M-D-Y H:mm:ss";
server.european_date_format = "D-M-Y H:mm:ss";


server.boolean_string = function (value) {
	return value ? "true" : "false";
}// boolean_string;


server.boolean_value = function (value) {
	if (is_boolean (value)) return value;
	if (is_string (value)) return value.matches ("true") || value.matches ("1");
	return false;
}// boolean_value;


server.class_value = function () {

	let args = Array.from (arguments);

	if (args.length < 2) return null;

	let object = args [0];

	if (!is_object (object)) return null;

	for (let param of args.slice (1)) {
		if (!object.hasOwnProperty (param) || (not_set (object [param]))) return null;
		object = object [param];
	}// for;

	return object;

}// class_value;


server.coalesce = function () {
	var values = Array.from (arguments);
	for (let value of values) {
		if (isset (value)) return value;
	}// for;
	return null;
}// coalesce;


server.debug = function () {
	if (serverside) return console.log (Array.from (arguments).join ("\n"));
	alert (Array.from (arguments).join ("\n"));
}// debug;


server.pause = function () {
	if (arguments.length > 0) return server.debug.apply (server, Array.from (arguments));
	alert ("paused");
}// pause;


server.is_array = function (value) {
	return value instanceof Array;
}// is_array;


server.is_blank = function (value) {
	return (value === blank);
}// is_blank;


server.is_boolean = function (value) {
	return (typeof value == "boolean");
}// is_boolean;


server.is_empty = function (value, allow_zero) {
	if (!isNaN (value) && (allow_zero == true)) return false;
	if (is_array (value) && (value.size > 0)) return false;
	return !isset (value);
}// is_empty;


server.is_function = function (value) {
	return (value instanceof Function);
}// is_function;


server.is_jquery = function (value) {
	return value instanceof jQuery;
}// is_jquery;


server.is_null = function (value) {
	return (value === null);
}// is_null;


server.is_numeric = function (value) {
	return !isNaN (parseFloat (value)) && isFinite (value);
}/* is_numeric */


server.is_object = function (value) {
	return ((value instanceof Object) && (!is_function (value)));
}// is_object;


server.is_regex = function (value) {
	return (value instanceof RegExp);
}// is_regex;


server.is_string = function (value) {
	return (typeof value == "string");
}// is_string;


server.isset = function (value, allow_numbers = false) {
	if ((allow_numbers === true) && (!isNaN (value))) return true;
	return not_null (null_if (value, new Array (undefined, blank)));
}// isset;


server.json_decode = function (json) {
	try {
		return not_set (json) ? null : JSON.parse (json);
	} catch (except) {
		console.log ("Invalid data passed to json_decode: " + json.toString ());
	}// try;
}// json_decode;


server.json_encode = function (value) {
	return null_if (JSON.stringify (value), "null");
}// json_encode;


server.merged = function () {

	let result = null;

	for (let item of arguments) {
		if (not_set (item)) continue;
		if (is_null (result)) result = {}
		Object.assign (result, item);
	}// for;

	return result;

}// merged;


server.not_empty	= function (value) { return !is_empty (value); }
server.not_null		= function (value) { return (value != null); }
server.not_object	= function (value) { return !is_object (value); }
server.not_set 		= function (value) { return !isset (value); }
server.not_string	= function (value) { return !is_string (value); }


server.now = function () { return new Date (); }


server.null_if = function (value, conditions) {
	if (!Array.isArray (conditions)) conditions = new Array (conditions);
	for (let condition of conditions) {
		if (value === condition) return null;
	}// for;
	return value;
}// null_if;


server.null_value = function (item) {
	return isset (item) ? item : null;
}// null_value;


server.property_value = function (parameters, property_name) {
	return (isset (parameters) && isset (parameters [property_name])) ? parameters [property_name] : null;
}// property_value;


server.quoted = function (text, single) {
	if (not_set (single)) single = false;
	var character = single ? "'" : "\"";
	return character + text + character;
}// quoted;


server.remove_keys = function () {

	let parameters = Array.from (arguments);
	let object = parameters [0];
	let keys = parameters.slice (1);

	for (let key of keys) {
		if (not_set (object [key])) continue;
		delete object [key];
	}// for;

	return object;

}// remove_keys;


server.report_error = function () {
	console.log (Array.from (arguments).join ("\n"));
}// report_error;


server.url_parameter_string = function (parameters) {

	let result = null;

	for (let index in parameters) {
		let value = parameters [index];
		if (!parameters.hasOwnProperty (index)) continue;
		if (is_null (result)) result = new Array ();
		result.push (`${index}=${value}`);
	}// if;

	return is_null (result) ? null : result.join ("&");

}// url_parameter_string;


server.ng_parameters = function (parameters) {

	let result = null;

	for (let index in parameters) {
		let value = parameters [index];
		if (!parameters.hasOwnProperty (index)) continue;
		if (is_null (result)) result = new Array ();
		result.push (`${index}='${value}'`);
	}// if;

	return is_null (result) ? null : result.join ("&");

}// ng_parameters;


/********/


server.blank = "";
server.space = " ";
server.comma = ",";

