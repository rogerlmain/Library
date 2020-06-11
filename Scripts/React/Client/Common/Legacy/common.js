//	RMPC Common
//	(C) Copyright 2020 - Roger L. Main
//	All rights reserved


const body = "body";


const root_url = (isset (window) ? window.location.protocol + "//" + window.location.host : null);


const directions = {
	horizontal: "horizontal",
	vertical: "vertical",
	both: "both"
}// directions;


/********/


function boolean_value (value) {
	if (is_boolean (value)) return value;
	if (is_string (value)) return value.matches ("true") || value.matches ("1");
	return false;
}// boolean_value;


function check_required_fields (form, options) {
	
	let fields = required_fields (form);

	
	function field_list (list) {
		let result = blank;
		for (let item in list) {
			if (!list.hasOwnProperty (item)) continue;
			if (is_array (list [item])) {
				result += "<li>" + item + "<ul>" + field_list (list [item]) + "</ul></li>";
				continue;
			}// if;
			if (is_object (list [item])) {
				result += "<li>" + list [item].field_name + "</li>";
				continue;
			}// if;
		}// for;
		return result;
	}// field_list;
	
	
	function get_field_length (fields) {
		let result = 0;
		for (let index in fields) {
			
			let field = fields [index];
			
			if (!fields.hasOwnProperty (index)) continue;
			
			if (is_array (field)) {
				result += get_field_length (field);
				continue;
			}// if;
			
			result++;
			
		}// for;
		return result;
	}// get_field_length;
	
	
	if (not_empty (fields)) {
		
		let field_length = get_field_length (fields);
		
		let parameters = {
			contents: "<div class='required-fields'><label>The following field" + (field_length == 1 ? " is" : "s are") + " required:</label><ul>" + field_list (fields) + "</ul></div>",
			buttons: [dialog_buttons.close]
		}// parameters;
		
		if (isset (options) && (is_function (options.onfail))) parameters.onclose = function () { options.onfail.call (form, fields) };
	
		new dialog_window (parameters).show (new Event ("submit"));
		
		return false;
			
	}// if;
	
	if (isset (options) && (is_function (options.onsuccess))) options.onsuccess.call (form, fields);
	
	return true;
	
}// check_required_fields;


function clone (object) {
	return json_decode (json_encode (object));
}// clone;


function coalesce () {
	var values = Array.from (arguments);
	for (let value of values) {
		if (isset (value)) return value;
	}// for;
	return null;
}// coalesce;


function debug () {
	alert (Array.from (arguments).join ("\n"));
}// debug;


function extend () {
	var result = null;
	var values = Array.from (arguments);
	for (var value of values) {
		if (is_null (result)) {
			result = json_decode (json_encode (value));
			continue;
		}// if;
		if (isset) jQuery.extend (result, value);
	}// for;
	return result;
}// extend;


function hashed (value) {
	return (value.charAt (0) == "#") ? value : "#" + value; 
}// hashed;


function unhashed (value) {
	return (value.charAt (0) == "#") ? value.substring (1) : value;
}// unhashed;


function in_object (object, value) {
	for (let key in object) {
		if (!object.hasOwnProperty (key)) continue;
		if (object [key] == value) return true;
	}// for;
	return false;
}// in_object;


function is_boolean_value (value) {
	return (is_boolean (value) || value.matches (["yes", "no", "true", "false", "on", "off"]));
}// is_boolean_value;


function is_comment (value) {
	return value instanceof Comment;
}// is_comment;


function is_event (value) {
	return (value instanceof Event);
}// is_event;


function is_json (value) {
	try {
		JSON.parse (value);
	} catch (except) {
		return false;
	}// try;
	return true;
}// is_json;


function is_object (value) {
	return ((value instanceof Object) && (!is_function (value)));
}// is_object;


function is_regex (value) {
	return (value instanceof RegExp);
}// is_regex;


function is_tag (value) {
	return (value instanceof HTMLElement);
}// is_tag;


function images_loaded () {
	var result = true;
	$("img").each (function (index, item) {
		if (!item.complete) return result = false;
	});
	return result;
}// images_loaded;


function json_decode (json) {
	try {
		return not_set (json) ? null : JSON.parse (json);
	} catch (except) {
		console.log ("Invalid data passed to json_decode: " + json.toString ());
	}// try;
}// json_decode;


function json_encode (value) {
	return null_if (JSON.stringify (value), "null");
}// json_encode;


function load_page (parameters) {
	
	let link = $(this);
	let form = $("<form />").appendTo ($("body"));
	
	form.attr ("method", "post");
	
	if (isset (link.attr ("target"))) form.attr ("target", link.attr ("target"));

	for (let index in parameters) {
		if (!parameters.hasOwnProperty (index)) continue;
		form.append ($("<input />").attr ({
			type: "hidden",
			name: index,
			value: parameters [index]
		}));
	}// for;
	
	form.dom_object.submit ();
	form.remove ();
	
	return false;
	
}// load_page;


function max () {
	
	let result = 0;
	
	for (value of Array.from (arguments)) {
		if (value > result) result = value;
	}// for;
	
	return result;
	
}// max;


function min () {
	
	let result = null;
	
	for (value of Array.from (arguments)) {
		result = ((is_null (result) || (value < result)) ? value : result);
	}// for;
	
	return result;
	
}// min;


function merge () {
	
	var result = null;
	var arrays = Array.from (arguments);
	
	if (arrays.length == 1) return arrays [0];
	
	for (var index in arrays) {
		var next_array = arrays [index]; 
		if (!array.hasOwnProperty (index)) continue;
		if (is_null (result)) {
			result = next_array;
			continue;
		}// if;
		result = result.concat (next_array);
	}// for;
		
	return result;
	
}// merge;


function modelled (object) {
	return $("<div />").html (object);
}// modelled;


function not_comment (value)	{ return !is_comment (value); }
function not_empty (value)		{ return !is_empty (value); }
function not_event (value)		{ return (!is_event (value)); }
function not_jquery (value)		{ return !is_jquery (value); }
function not_object (value)		{ return (!is_object (value)); }


function null_if (value, conditions) {
	if (!Array.isArray (conditions)) conditions = new Array (conditions);
	for (let condition of conditions) {
		if (value === condition) return null;
	}// for;
	return value;
}// null_if;


function null_value (item) {
	return isset (item) ? item : null;
}// null_value;


function null_string (item) {
	return isset (item) ? item : blank;
}// null_string;


function numeric_string (value) {
	return is_numeric (value) ? parseInt (value) : value;
}// numeric_string;


function parse_integer (value) {
	let integer = parseInt (value);
	return isNaN (integer) ? null : integer;
}// parse_integer;


function pause () {
	alert ((arguments.length > 0) ? Array.from (arguments).join ("\n") : "Paused...");
}// pause;


function preview_image (file_object, image) {
	
	function image_handler () {
		image.load_image (file_object, function () {
			image.appear ();
		});
	}// image_handler;
	
	switch (image.visible) {
		case true: image.disappear (image_handler); break;
		default: image_handler (); break;
	}// switch;
	
}// preview_image;


function recast (model, type) {
	return $(model.outer_html.replace (new RegExp ("\<" + model.tagname, "g"), "<" + type).replace (new RegExp ("\<\/" + model.tagname, "g"), "</" + type));
}// recast;


function required_fields (form) {
	
	let field_list = null;
	let result = null;
	
	$(form).descendants ("[required]").each (function (index, item) {
		
		let control = $(item);
		
		if (isset (control.value)) return true;
		if (is_null (field_list)) field_list = new Array ();
		
		if (!control.is (":input")) {
			field_list [control.id] = null;
			return true;
		}// if;
		
		let required_panel = control.ancestor ("[required]:not(:input)");
		let required_text = control.dom_object.getAttribute ("required"); // jQuery attr overrides "required" with "required". Use native function instead. 
		let text = coalesce (control.label.html (), (is_boolean_value (required_text) ? control.signature : required_text));
		
		let control_object = {
			field_name: text,
			field_control: control
		}// control_object;
				
		if (is_null (required_panel)) {
			field_list.push (control_object);
			return;
		}// if;
		
		if (is_null (field_list [required_panel.id])) field_list [required_panel.id] = new Array ();
		field_list [required_panel.id].push (control_object);
		
	});
	
	for (let item in field_list) {
		let value = field_list [item];
		if (!field_list.hasOwnProperty (item)) continue;
		if (is_null (value)) continue;
		if (is_null (result)) result = new Array ();
		result [item] = field_list [item];
	}// for;
	
	return result;
	
}// required_fields;


function root_path (file_path) {
	if (file_path.charAt (0) != "/") file_path = "/" + file_path;
	return root_url + file_path;
}// root_path;


function run (tag, attribute) {
	var control = $(tag);
	var command = control.attr (attribute);
	if (isset (command)) new Function (command).call (control.dom_object, new Event (attribute)); 
}// run;


function stripped_number (string) {
	let result = string.replace (/[^0-9]/g, blank);
	return result;
}// stripped_number;


function lowercase (string) { return string.toLowerCase (); }
function uppercase (string) { return string.toUpperCase (); }


function title_case (string, american) {
	american = (american === true);
	string = string.replace (underscore, space);
	if (american) return string.replace (/\w\S*/g, function (word) {return word.charAt (0).toUpperCase () + word.substr (1).toLowerCase (); });
	return uppercase (string.substring (0, 1)) + lowercase (string.substring (1)); 
}// title_case;


function propercase (string, american) { return title_case (string, american); }


function wait_for_images (oncomplete) {
	if (images_loaded () && is_function (oncomplete)) return oncomplete ();
	setTimeout (function () { wait_for_images (oncomplete); });
}// wait_for_images;


function write () {
	alert (Array.from (arguments).join (space));
}// write;


function writeln () {
	var eol = "\n";
	var short_length = arguments.length - 1;
	var last_argument = arguments [short_length];
	if (last_argument === true) {
		eol = "<br />";
		return is_boolean (last_argument) ? Array.from (arguments).slice (0, short_length).join (eol) : Array.from (arguments).join (eol);
	}// if;
	alert (is_boolean (last_argument) ? Array.from (arguments).slice (0, short_length).join (eol) : Array.from (arguments).join (eol));	
}// writeln;


