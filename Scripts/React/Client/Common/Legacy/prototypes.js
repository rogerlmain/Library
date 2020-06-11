/******** Properties ********/


Object.defineProperties (Array.prototype, {
	
	empty		: { get: function () { return (this.length == 0); } },
	last_item	: { get: function () { return (this.empty ? null : this [this.length - 1]); } },
	
	size: { get: function () {
		
		let counter = 0;
		
		for (let item in this) {
			if (this.hasOwnProperty (item)) counter++;
		}// for;
		
		return counter;
		
	} }/* size */

});


Object.defineProperties (FormData.prototype, {
	values: {
		get: function () {
			let result = null;
			for (const [key, value]  of this.entries ()) {
				if (is_null (result)) result = {};
			    result [key] = value;
			}// for;
			return result;
		}/* getter */
	}/* values */
});


Object.defineProperties (HTMLElement.prototype, {
	
	full_signature: {
		get: function () {
			
			let result = null;
			let node = this;
			
			while (isset (node)) {
				if (is_null (result)) result = new Array ();
				result.push (node.signature);
				node = node.parentNode;
			}// while;
			
			return (is_null (result) ? result : result.reverse ().join (space));
		}/* getter */
	}/* full_signature */,

	
	signature: { 
		get: function () {
			return (this.tagName + (isset (this.id) ? "#" + this.id : blank) + ((isset (this.classList) && (this.classList.length > 0)) ? "." + Array.from (this.classList).join (".") : blank)).trim ().toLowerCase ();
		}/* getter */
	}/* signature */,
	
	
	is_unique_signature: {
		get: function () {
			return ($(this.signature).length == 1);
		}/* getter */
	}/* is_unique_signature */
		
});


Object.defineProperties (HTMLSelectElement.prototype, {
	selected_value: {
		get: function () { return $(this.options [this.selectedIndex]).value; }
	}
});


Object.defineProperties (String.prototype, {
	
	blank: {
		get: function () { return (this.matches (blank)); }
	}/* empty */

});


/******** Methods ********/


Array.prototype.cleaned = function (empty_as_null) {
	let result = new Array ();
	for (item of this) {
		if (item.blank) continue;
		result.push (item);
	}// for;
	return ((empty_as_null === true) && (result.empty)) ? null : result;
}// cleaned;


Array.prototype.contains = function (needle) {
	for (item of this) {
		if (is_string (item) && is_string (needle) && item.matches (needle)) return true;
		if (item == needle) return true;
	}// for;
	return false;
}// contains;


/********/


HTMLElement.prototype.add_style = function () {
	
	let parameters = Array.from (arguments);
	let styles = is_object (parameters [0]) ? parameters [0] : (is_string (parameters [0]) && (parameters.length >= 2) ? { [parameters [0]]: parameters [1] } : null);
	
	for (let name in styles) {
		let value = styles [name];
		if (!styles.hasOwnProperty (name)) continue;
		if (not_set (this.style [name], false)) this.style [name] = value;
	}// for;
	
}// add_style;


/********/


String.prototype.presplit = String.prototype.split;


String.prototype.contains = function (value) {
	return this.indexOf (value) > -1;
}// String.prototype.contains; 


String.prototype.matches = String.prototype.equals = function (text) {
	if (is_regex (text)) return isset (this.match (text));
	if (is_string (text)) return this.trim ().toLowerCase () == text.trim ().toLowerCase ();
	return false;
}// String.prototype.equals;


String.prototype.split = function (delimiter, empty_as_null, include_blanks) {
	let result = (include_blanks === true) ? this.presplit (delimiter) : this.presplit (delimiter).cleaned (empty_as_null);
	return result; //(is_empty (result) && (empty_as_null !== false)) ? null : result;
}// String.prototype.doit;


String.prototype.trim = function (character) {

	switch (isset (character)) {
		case true: if (character.match (/[\\\^\$\.\|\?\*\+\(\)\[\{]/g)) character = "\\" + character; break;
		default: character = "\\s"; break; 
	}// switch;
	
	let result = this.replace (new RegExp ("^[" + character + "]+|[" + character + "]+$", "g"), blank);
	return result;
	
}// String.prototype.trim;


String.prototype.base64_encoded = function (trimmed) {
	 return base64_encode (this, trimmed);
}// String.prototype.base64_encoded;






