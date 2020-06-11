import "../Common/globals.mjs";


var is_empty = server.is_empty;


server.debug = function () {
	alert (Array.from (arguments).join ("\n"));
}// debug;


server.is_empty = function (value, allow_zero = false) {
	if (is_jquery (value)) return value.is_empty;
	return is_empty (value, allow_zero);
}// is_empty;
	
		
server.is_jquery = function (value) { return value instanceof jQuery; }
