<?php


define ("public_push_key", "BOszdRfcGxN92YoeyYT1U9_pOBvV4quYy7MliU9ruWWLsNbXnAqDH67rcAHWC4NLuL1q3NghepUdrxO5SZomK60");
define ("private_push_key", "d5qecTksRHbuvToRkacT2DwdtntpWEHyclzYNPqskR0");


define ("root_folder", $_SERVER ["DOCUMENT_ROOT"]);
define ("root_url", (empty ($_SERVER ["HTTPS"]) ? "http" : "https") . "://" . $_SERVER ["HTTP_HOST"]);

define ("server_name", $_SERVER ["SERVER_NAME"]);

define ("blank", "");
define ("comma", ",");
define ("space", " ");

define ("hyphen", "-");
define ("underscore", "_");

define ("null_url", "//:0");


define ("sql_date_format", "Y-m-d H:i:s");
define ("american_date_format", "m-d-Y H:i:s");
define ("european_date_format", "d-m-Y H:i:s");


class common {
	
	
	const blank = "";
	
	
	private static function url () {
		return (empty ($_SERVER ["HTTPS"]) ? "http" : "https") . "://" . $_SERVER ["HTTP_HOST"];
	}// url;
	
	
	/********/
	
	
	protected static function start_buffer () {
		ob_start ();
	}// start_buffer;
	
	
	protected static function end_buffer () {
		$result = ob_get_contents ();
		ob_end_clean ();
		return $result;
	}// end_buffer;
	
	
	/********/
	
	
	public function join ($glue, $pieces) {
		return implode ($glue, $pieces);
	}// join;
	
	
	public function split ($delimiter, $string) {
		return explode ($delimiter, $string);
	}// split;
	
	
	/********/
	
	
	// DEPRECATGED - USE BUILT-IN PHP ?? COALESCE OPERATOR INSTEAD
	
	public static function coalesce () {
		foreach (func_get_args () as $item) {
			if (self::not_null ($item)) return $item;
		}// foreach;
		return null;
	}// coalesce;
	
	
	public static function get_value ($object, $field) {
		if (is_array ($object)) return array_key_exists ($field, $object) ? $object [$field] : null;
		if (is_object ($object)) return property_exists ($object, $field) ? $object->$field : null;
		return null;
	}// get_value;
	
	
	public static function set_global ($name, $value) {
		if (isset ($GLOBALS [$name])) return;
		$GLOBALS [$name] = $value;
	}// set_global;
	
	public static function global ($variable) {
		return $GLOBALS [$variable];
	}// global;
	
	
	public static function load_styles ($stylesheet) {
		return "<link rel='stylesheet' href='{$stylesheet}' />";
	}// load_styles;
	
	
	public static function not_set ($value) {
		return !isset ($value);
	}// not_set;
	
	
	public static function root_path ($filename) {
		$result = $_SERVER ["DOCUMENT_ROOT"] . "/" . $filename;
		return $result;
	}// root_path;
	
	
	public static function root_url ($path) {
		$result = self::url () . "/" . $path;
		return $result;
	}// root_url;
	
	
	public static function tag_attribute ($name, $value) {
		return (is_empty ($value) or ($value === false)) ? null : "{$name}='{$value}'";
	}// attribute;
	
	
	/********/
	
	
	public function __call ($name, $parameters) {
		if (array_search ($name, get_defined_functions () ["user"]) !== false) return call_user_func_array ($name, $parameters); 
	}// magic function call
	

}// Common;



/**** Global Functions ****/


function boolean_value ($value) {
	if (is_null ($value)) return false;
	if (is_bool ($value)) return $value;
	if (is_string ($value) && is_numeric ($value)) return (intval ($value) != 0);
	if (is_string ($value)) return (in_array (trim (strtolower ($value)), array ("true", "on")));
	if (is_numeric ($value)) return ($value != 0);
	throw new Exception ("unrecognized value passed to boolean_value");
}// boolean_value;


function boolean_text ($boolean) {
	return $boolean ? "true" : "false";
}// boolean_text;


function hyphenated ($string) {
	return preg_replace ("/\s+/", hyphen, $string);
}// hyphenated;


function is_empty ($value) {
	if (is_null ($value)) return true;
	if (is_array ($value) && (count ($value) == 0)) return true;
	if (is_string ($value) && (trim ($value) == blank)) return true;
	return false;
}// is_empty;


function not_empty ($value) {
	return !is_empty ($value);
}// not_empty;


function not_null ($value) {
	return !is_null ($value);
}// not_null;


function not_set ($value) {
	return common::not_set ($value);
}// not_set;


function padded_integer ($integer, $length) {
	return str_pad (strval ($integer), $length, "0", STR_PAD_LEFT);
}// padded_integer;


function propercase ($string, $sentence = false) {
	return $sentence ? ucfirst (strtolower ($string)) : ucwords ($string);
}// propercase;


function property_value ($parameters, $property_name) {
	if (is_array ($parameters)) $parameters = (Object) $parameters;
	return (property_exists ($parameters, $property_name)) ? $parameters->$property_name : null;
}// property_value;


function quoted ($text, $double = true) {
	$character = $double ? '"' : "'";
	$text = str_replace ($character, "\\{$character}", $text);
	return "{$character}{$text}{$character}";
}// quoted;


function record_error ($error) {
	
	// CONSTRUCTION ZONE
	
	// Add methods to record the error passed in (probably in a database)
	
	writeln ("Recorded error: {$error}");
	
}// record_error;


function request ($field) {
	return array_key_exists ($field, $_REQUEST) ? $_REQUEST [$field] : null;
}// request;


function stripped_number ($string) {
	$result = preg_replace ("/[^0-9]/", blank, $string);
	return $result;
}// stripped_number;


function tag_attribute ($name, $value) {
	return common::tag_attribute ($name, $value);
}// tag_attribute;


function url_encoded_data ($object) {
	return trim (base64_encode (json_encode ($object)), "=");
}// url_encoded_data;


function url_decoded_data ($data) {
	
	while ((strlen ($data) % 4) != 0) {
		$data .= "=";
	}// while;
	
	return json_decode (base64_decode ($data));

}// url_decoded_data;


function write () {
	$parameters = func_get_args ();
	foreach ($parameters as $parameter) {
		echo $parameter;
	}// foreach;
}// write;


function writeln () {
	if (is_null ($parameters = func_get_args ())) return;
	$html = (end ($parameters) !== true);
	$delimiter = $html ? "<br />" : "\n";
	if (!$html) array_pop ($parameters);
	foreach ($parameters as $parameter) {
		echo $parameter . $delimiter;
	}// foreach;
}// writeln;



