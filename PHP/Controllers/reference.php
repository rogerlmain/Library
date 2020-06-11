<?php


	require_once (common::root_path ("Library/Classes/base.php"));
	require_once (common::root_path ("Library/Models/reference.php"));
	

	class reference_controller extends base {
		
		public function process () {
			$country_id = $this->request ("country_id");
			switch ($this->option) {
				case "states"	: write ($this->state_list (isset ($country_id) ? $country_id : base::default_country_id)); break;
				default: 		  write ("Awaiting your command, master."); break;
			}// switch;
		}// process;
		
	}// reference_controller;
	
	
	(new reference_controller ())->process ();