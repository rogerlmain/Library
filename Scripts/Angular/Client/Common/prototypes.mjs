import "/Scripts/Library/Angular/Common/common.mjs";
import "/Scripts/Library/Angular/Common/prototypes.mjs";


FormData.prototype.add = function (object) {
	if (not_object (object)) throw "Invalid value passed to FormData add (object required)";
	for (let key in object) {
		if (!object.hasOwnProperty (key)) continue;
		this.append (key, object [key]);
	}// for;
	return this; // for chaining or embedding
}// add;


HTMLElement.prototype.freeze = function () {
	this.style.width = `${this.canvas_width}px`;
	this.style.height = `${this.canvas_height}px`;
}// freeze;


HTMLElement.prototype.thaw = function () {
	this.style.width = null;
	this.style.height = null;
}// thaw;


HTMLElement.prototype.get_style = HTMLElement.prototype.computed_style = function (style_name) { // computed_style syntax preferred - get_style to be deprecated
	return window.getComputedStyle (this, null).getPropertyValue (style_name);
}// computed_style;


HTMLElement.prototype.serialize_values = function (additional_fields) {

	let form_data = null;
	let fields = this.querySelectorAll ("input, select, textarea");


	function append_files (form_data, file_field) {
		for (let file of file_field.files) {
			form_data.append (file_field.name + "[]", file, file.name);
		}// for;
	}// append_files;


	for (let field of fields) {
		if (is_null (form_data)) form_data = new FormData ();
		switch (field.type) {
			case "file": append_files (form_data, field); break;
			case "radio": case"checkbox": if (field.checked) form_data.append (field.name, field.value); break;
			default: form_data.append (field.name, field.value); break;
		}// switch;
	}// for;


	if (is_object (additional_fields)) for (let index in additional_fields) {
		if (!additional_fields.hasOwnProperty (index)) continue;
		form_data.append (index, additional_fields [index]);
	}// if;

	return form_data;

}/* serialize_values */,


Object.defineProperties (HTMLElement.prototype, {

	canvas_width: {
		get: function () {
			let border_box = window.getComputedStyle (this, null).getPropertyValue ('box-sizing').matches ("border-box");
			return border_box ? this.offsetWidth : (this.clientWidth  - (parseInt (this.style.paddingLeft) + parseInt (this.style.paddingRight)));
		}/* getter */
	}/* canvas_width */,

	canvas_height: {
		get: function () {
			let border_box = window.getComputedStyle (this, null).getPropertyValue ('box-sizing').matches ("border-box");
			return border_box ? this.offsetHeight : (this.clientHeight - (parseInt (this.style.paddingTop) + parseInt (this.style.paddingBottom)));
		}/* getter */
	}/* canvas_height */,

	start_tag: {
		get: function () {
			if (this.childNodes.length == 0) {
				let parts = this.outerHTML.split ("><");
				return (parts.length > 1) ? parts [0] + ">" : parts [0];
			}// if;
			return this.outerHTML.split (this.innerHTML) [0];
		}/* getter */
	}/* start_tag */

});