<?php


require_once ("base.php");


// DEPRECATED - USE set_cookie AND get_cookie INSTEAD

class cookie extends base {
	
	
	public function __get ($name) {
		return get_cookie ($name);
	}// magic function get;
	
	
	public function __set ($name, $value) {
		set_cookie ($name, $value);
	}// magic function set;
	
	
}// cookie;


function get_cookie ($name) {
	return array_key_exists ($name, $_COOKIE) ? $_COOKIE [$name] : null;
	return (new cookie ())->$name;
}// get_cookie;


function set_cookie ($name, $value) {
	setcookie ($name, $_COOKIE [$name] = (is_string ($value) ? $value : json_encode ($value)));
}// set_cookie;