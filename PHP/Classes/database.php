<?php


require_once ("base.php");


class database extends base {
		
	
	private $schema = null;
	/* private */ protected $connection = null;
	
	
	private const credentials = array (
		"server" 	=> "localhost",
		"username" 	=> "root",
		"password"	=> "stranger"
	)/* credentials */;
	
	
	private function parameterize ($query, $parameters) {
		foreach ($parameters as $key => $parameter) {
			$query = preg_replace ("/\{\{{$key}\}\}/", $parameter, $query);
		}// foreach;
		return $query;
	}// parameterize;
	
	
	private function run_query ($query) {
		$result = $this->connection->query ($query);
 		if ($this->connection->more_results ()) $this->connection->next_result ();
		return $result;
	}// run_query;
	
	
	private function update_parameters ($parameters) {
		$result = null;
		foreach ($parameters as $name => $value) {
			if (is_null ($result)) $result = array ();
			array_push ($result, "{$name} = {$value}");
		}// foreach;
		return implode (comma, $result);
	}// update_parameters;
	
	
	private function normalized ($value, $data_type) {
		if (is_numeric ($value)) return intval ($value);
		if (is_bool ($value)) return boolean_text ($value);
		return $value;
	}// normalized;
	
	
	private function table_columns ($tablename, $parameters) {
		$result = null;
		$columns = $this->get_rows ("select_columns", $tablename);
		
		if (is_array ($parameters)) $parameters = (Object) $parameters;
		
		foreach ($columns as $column) {

			$column_name = $column->COLUMN_NAME;
			$column_type = $column->DATA_TYPE;
			$column_value = $this->normalized (property_value ($parameters, $column_name), $column_type);
			
			if (common::is_empty ($column_value)) continue;
			if (!in_array ($column_type, array ("bit", "int", "tinyint"))) $column_value = "'" . str_replace ("'", "''", $column_value) . "'";

			if (is_null ($result)) $result = array ();
			
			if ($column_value === "on") $column_value = "true";
			if ($column_name == "password") $column_value = "md5({$column_value})";
			
			$result [$column_name] = $column_value;
			
		}// foreach;
		return $result;
	}// table_columns;
	
	
	private function insert ($tablename, $parameters) {
		$columns = $this->table_columns ($tablename, $parameters); 
		$fields = implode (comma, array_keys ($columns));
		$values = implode (comma, array_values ($columns));
		$query = "insert into `{$tablename}` ({$fields}) values ({$values});";
		$result = ($this->query ($query, true));
		return $result;
	}// insert;"
	
	
	private function update ($tablename, $parameters, $id) {
		if (is_null ($id = is_numeric ($id) ? intval ($id) : null)) throw new Exception ("Invalid id field");
		$columns = $this->table_columns ($tablename, $parameters);
		$columns ["last_updated"] = quoted (date (sql_date_format));
		$query = "update {$tablename} set {$this->update_parameters ($columns)} where id = {$id};";
		return ($this->query ($query) === true) ? $id : null;
	}// update;
	
	
	// DEPRECATED IN FAVOR OF STORED PROCEDURES TO PREVENT SQL INJECTION
	
	private function select ($table_name, $query_name, $parameters) {
		$xml = simplexml_load_string (file_get_contents (self::root_path ("Data/{$table_name}.xml")));
		return $this->query ($this->parameterize ((string) $xml->$query_name [0], $parameters));
	}// select;
	
	
	/********/
	
	
	protected function get_rows ($procedure_name) {
		
		$result = null;
		$parameters = array_slice (func_get_args (), 1);
		
		foreach ($parameters as &$parameter) {
			if (is_string ($parameter)) $parameter = common::quoted ($parameter);
			if (is_bool ($parameter)) $parameter = $parameter ? "true" : "false";
		}// foreach;
		
		$parameters = implode (comma . space, $parameters);
		
		$query = "call {$procedure_name} ({$parameters});";
		
		if ($data = $this->run_query ($query)) while ($row = $data->fetch_assoc ()) {
			if (is_null ($result)) $result = array ();
			array_push ($result, (Object) $row);
		}// while;
		
		return $result;
		
	}// get_rows;
	
	
	protected function get_row ($procedure_name) {
		$rows = call_user_func_array (array ($this, "get_rows"), func_get_args ());		
		return (isset ($rows) ? (Object) $rows [0] : null);
	}// execute;
	
	
	// DEPRECATED IN FAVOR OF STORED PROCEDURES TO PREVENT SQL INJECTION
	
	// Base to all select functions - can take:
	//		$query - an actual query or a query name if tablename is set
	//		$tablename - the name of the Data/[table].xml file to read
	//		$parameters - optional parameters to pass to 
	
	
	protected function select_rows ($query, $tablename = null, $parameters = null) {
		if (isset ($parameters) && $this->not_set ($tablename)) throw new Exception ("select_rows called with parameters but no table");
		switch (isset ($tablename)) {
			case true: $result = $this->select ($tablename, $query, $parameters); break;
			default: $result = $this->query ($query); break;
		}// switch;
		if ($result->num_rows == 0) return null;
		return $result->fetch_all (MYSQLI_ASSOC);
	}// select_rows;
	
	
	protected function select_row ($query, $tablename = null, $parameters = null) {
		$result = $this->select_rows ($query, $tablename, $parameters);
		return (isset ($result) && (count ($result) > 0)) ? $result [0] : null;
	}// select_row;
	
	
	protected function query ($query, $save = false) {
		$result = $this->run_query ($query);
		if (not_empty ($this->connection->error)) common::record_error ($this->connection->error);
		return ($save) ? $this->connection->insert_id : $result;
	}// query;
	
	
	/**** Public Section ****/
		
		
	public function record_exists ($table, $conditions) {
		$conditional = null;
		if (is_array ($conditions)) {
			foreach ($conditions as $name => $value) {
				if (is_null ($conditional)) $conditional = Array ();
				array_push ($conditional, "({$name} = {$value})");
			}// foreach;
			$conditions = implode (" and ", $conditional);
		}// if;				
		
		$result = $this->select_row ("select (count(*) > 0) as `exists` from {$table} where {$conditions}");
		return is_null ($result) ? false : $this->boolean_value ($result ["exists"]);
	}// record_exists;
		
		
	public function save ($tablename, $parameters, $id = null) {
		if (is_null ($id)) return $this->insert ($tablename, $parameters);
		return $this->update ($tablename, $parameters, $id);
	}// save;
	
	
	/**** Constructor ****/
	
	
	public function __construct ($schema) {
		
		$credentials = defined ("database_credentials") ? database_credentials : self::credentials;
		
		$this->connection = new mysqli ($credentials ["server"], $credentials ["username"], $credentials ["password"]);
		$this->connection->select_db ($schema);
		$this->schema = $schema;
		
	}// constructor;
	
	
	public function __destruct () {
		if (isset ($this->connection)) $this->connection->close ();
	}// destructor;
	

}// database;
	
