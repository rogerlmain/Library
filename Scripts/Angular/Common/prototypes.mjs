import "./common.mjs";


Array.prototype.contains = function (value) {
	return this.includes (value);
}// contains;


/********/


Date.prototype.add_days = function (days) { this.setDate (this.getDate () + days); return this; }
Date.prototype.add_weeks = function (weeks) { this.setDate (this.getDate () + (weeks * 7)); return this; }
Date.prototype.add_months = function (months) { this.setMonth (this.geMonth () + months); return this; }
Date.prototype.add_years = function (years) { this.setFullYear (this.getFullYear () + years); return this; }


/********/


String.prototype.matches = String.prototype.equals = function (text) {
	if (is_regex (text)) return isset (this.match (text));
	if (is_string (text)) return this.trim ().toLowerCase () == text.trim ().toLowerCase ();
	return false;
}// String.prototype.matches;


String.prototype.trim = function (character) {

	switch (isset (character)) {
		case true: if (character.match (/[\\\^\$\.\|\?\*\+\(\)\[\]\{\}]/g)) character = "\\" + character; break;
		default: character = "\\s"; break; 
	}// switch;
	
	let result = this.replace (new RegExp ("((^[" + character + "]+)|([" + character + "]+$))", "g"), blank);
	return result;
	
}// String.prototype.trim;
