<?php


require_once ("common.php");


class base extends common {
	
	
	const default_country_id = 1;	// Country code for USA
	const default_state_id = 6;		// State code for Colorado
	
	
	/********/
	
	
	protected function add_array_item (&$array, $field, $value) {
		if (not_set ($value)) return;
		if (not_set ($array)) $array = array ();
		$array [$field] = $value;
	}// add_array_item;
	
	
	protected function cookie_value ($name) {
		if (array_key_exists ($name, $_COOKIE)) return $_COOKIE [$name];
		return null;
	}// cookie_value;
	
	
	protected function month_name ($month) {
		return DateTime::createFromFormat ("!m", $month)->format ("F");
	}// month_name;
	
	
	protected function prefixed ($name, $prefix) {
		return trim ($prefix) . underscore . trim ($name, " \t\n\r\0\x0B_"); 
	}// prefixed;
	
	
	protected function request ($name) {
		return property_value ($_REQUEST, trim (trim ($name), underscore));
	}// request;
	
	
	protected function save_files ($prefix, $path, $processor = null) {
		
		foreach ($this->files as $key => $file) {
			
			$image_data = $this->files [$key];
			
			foreach ($image_data ["name"] as $index => $filename) {
				
				$extension = substr ($filename, strrpos ($filename, "."));
				$file_code = $prefix . $this->padded_integer ($index, 2) . "{$extension}";
				
				move_uploaded_file ($image_data ["tmp_name"][$index], trim ($path, "/") . "/{$file_code}");
				if (isset ($processor)) $processor ($file_code);
				
			}// foreach;
			
		}// foreach;
		
	}// save_files;
	
	
	protected function state_list ($country_id, $selected_state_id = null) {
		require_once (common::root_path ("Library/Models/reference.php"));
		$states = (new reference_data ())->select_states ($country_id);
		foreach ($states as $state) {
			$selected = ($state ["id"] == $selected_state_id) ? "selected='true'" : null;
			write ("<option value='{$state ["id"]}' {$selected}>{$state ["name"]}</option>");
		}// foreach;
	}// state_list;
	
	
	protected function variable_name ($text) {
		$result = strtolower (str_replace (space, underscore, $text));
		return $result;
	}// variable_name;
	

	/********/
	
	
	public function load_control ($control_name, $parameters = null) {
		
		self::start_buffer ();
		
		if (isset ($parameters)) {
			foreach ($parameters as $attribute_name => $attribute_value) {
				$$attribute_name = $attribute_value;
			}// foreach;
		}// foreach;
		
		include (self::root_path ($control_name));
		
		$result = self::end_buffer ();
		return $result;
		
	}// load_control;
	
	
	public function load_image ($image_name, $default_image) {
		$image_path = self::root_path ($image_name);
		$default_image = (isset ($default_image) && file_exists ($default_image)) ? $default_image: null;
		$output_image = (isset ($image_name) && is_file ($image_path)) ? self::root_url ($image_name) : $default_image;
		return $output_image;
	}// load_image;
	
	
	public function month_select_list () {
		$result = null;
		for ($month = 1; $month <= 12; $month++) {
			if (is_null ($result)) $result = array ();
			array_push ($result, "<option value='{$month}'>{$this->month_name ($month)}</option>");
		}// for;
		return implode ("\n", $result);
	}// month_select_list;
	
	
	public function __get ($name) {
		switch ($name) {
			case "files": return $_FILES;
			case "request": return $_REQUEST;
		}// switch;
	}// magic function get;
	
	
}// base;

