<?php


	require_once (common::root_path ("Library/Classes/database.php"));
	
	
	class reference_data extends database {
		
	
		public function select_countries () {
			$result = $this->select_rows ("select * from countries");
			return $result;
		}// select_countries;
		
		
		public function select_states ($country_id) {
			$result = $this->select_rows ("select * from states where country_id = {$country_id};");
			return $result;
		}// select_states;
		
		
	/**** Constructor ****/
		
		
		public function __construct () {
			parent::__construct (reference_database);
		}// constructor;
		
		
	}// reference_data;