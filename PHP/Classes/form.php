<?php


require_once ("page.php"); 


class form extends page {
	
	
	private function selected ($value) {
		return $value ? "selected='true'" : blank;
	}// selected;
	
	
	private function year_list ($selected_value = null) {
		$this->start_buffer ();
		$current_year = intval (date ("Y"));
		for ($year = $current_year; $year >= ($current_year - 100); $year--) {
			$selected = (($year == $current_year) || (isset ($selected_value) && ($year == $selected_value)));
			writeln ("<option {$this->selected ($selected)}>{$year}</option>");
		}// for;
		return $this->end_buffer ();
	}// year_list;
	
	
	/********/
	
	
	public function __get ($name) {
		switch ($name) {
			case "year_list": return $this->year_list ();
		}// switch;
	}// magic function get;
	
	
}// form;
