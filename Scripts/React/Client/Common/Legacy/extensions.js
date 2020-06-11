const default_speed = 400;
const default_timeout = 100;


/**** jQuery Extension Methods ****/


jQuery.extend ({
	
	create: function (elements) {
		if (is_array (elements)) return elements.reduce (jQuery.merge);
	}// create;
	
});


jQuery.fn.extend ({
	
	
	ancestor: function (selector) {
		var next_item = this;
		
		while (next_item.is_not (selector)) {
			next_item = next_item.parent ();
			if (next_item.is_empty) return null;
		}// while;
		
		return next_item;
	}/* ancestor */,

		
	ancestors: function (selector) { return $(this).ancestor (selector); },
	
	
	appear: function (options) {
		
		var oncomplete = is_function (options) ? options : null;
		var self = $(this);
		
		if (is_empty (options) || is_function (options)) options = {}
		if (is_empty (options.speed)) options.speed = default_speed;
		if (isset (oncomplete)) options.oncomplete = oncomplete;

		if (!images_loaded ()) return setTimeout (function () {
			self.appear (options);
		}, default_timeout);

		if (self.css ("display").equals ("none")) self.css ("display", "inherit");
		
		self.css ({ 
			opacity: 0,
			visibility: "visible"
		});
		
		self.animate ({ 
			opacity: 1
		}, {
			duration: options.speed,
			complete: function () {
				if (is_function (options.oncomplete)) options.oncomplete (self);
			}/* complete */
		});
		
		return self;
		
	}/* appear */,
	
	
	coalesce: function () {
		var options = Array.from (arguments);
		if (this.exists) return this;
		for (var index in options) {
			var item = $(options [index]);
			if (!options.hasOwnProperty (index)) continue;
			if (item.exists) return item;
		}// for;
		return null;
	}/* coalesce */,
	
	
	crossfade: function (replacement, oncomplete) {

		let self = $(this);
		let container = self.parent ();
		
		if (is_null (container)) throw "Crossfade called on unattached object";

		replacement.css ({
			opacity: 0, 
			position: "absolute"
		});

		container.css ("position", "relative");
		container.append (replacement);

		self.disappear ();
		
		replacement.appear (is_function (oncomplete) ? oncomplete : null);
					
	}/* crossfade */,
	

	first_cousin: function (common_ancestor) {
		return $(this.cousins (common_ancestor).get (0));
	}/* first_cousin */,
	
	
	freeze: function () {
		this.css (this.outer_dimensions);
		return this; 	// for chaining
	}/* freeze */,

	
	thaw: function () {
		this.remove_style (["width", "height"]);
		return this; 	// for chaining
	}/* thaw */,
	
	
	last_cousin: function (common_ancestor) {
		let cousins = this.cousins (common_ancestor);
		return $(cousins.get (cousins.length - 1));
	}/* last_cousin */,
	
	
	next_cousin: function (common_ancestor) {
		
		let result = null;
		let cousins = this.cousins (common_ancestor);
		let control = this.dom_object;
		
		cousins.each (function (index, item) {
			if ((item === control) && (index < (cousins.length - 1))) {
				result = $(cousins.get (index + 1));
				return false;
			}// if;
		});
		
		return result;
		
	}/* next_cousin */,
	
	
	previous_cousin: function (common_ancestor) {
		
		let result = null;
		let cousins = this.cousins (common_ancestor);
		let control = this.dom_object;
		
		cousins.each (function (index, item) {
			if ((item === control) && (index > 1)) {
				result = $(cousins.get (index - 1));
				return false;
			}// if;
		});
		
		return result;
		
	}/* previous_cousin */,
	
	
	cousins: function (common_ancestor) {
		let classes = this.attr ("class");
		let selector = $(this).tagname + (isset (classes) ? "." + classes.split (space).join (".") : blank);
		return $(common_ancestor).descendants (selector);
	}/* cousin */,
	
	
	disappear: function (oncomplete) {
		
		let parameters = Array.from (arguments).slice (1);
		
		this.animate ({ opacity: 0 }, { complete: function () {
			if (is_function (oncomplete)) oncomplete.apply (this, parameters);
		}});
		
		return this;
		
	}/* disappear */,
	
	
	descendant: function (selector) { return $(this).find (selector); },
	
	descendants: function (selector, null_if_empty) {
//		try {
			let result = this.find (selector);
			return (result.is_empty && (null_if_empty === true)) ? null : result;
//		} catch (error) { return null; }
	}/* descendants */,
	
	
	fade_in: function (options) {
		
		var oncomplete = is_function (options) ? options : null;
		
		if (not_set (options) || is_function (options)) options = {};
		if (not_set (options.speed)) options.speed = default_speed;
		if (isset (oncomplete)) options.oncomplete = oncomplete;

		this.remove_style ("visibility").remove_style ("display", "none").css ("opacity", 0).animate ({ opacity: 1 }, { 
			duration: options.speed,
			complete: options.oncomplete
		});
		
	}/* fade_in */,
	
	
	fade_out: function (options) {

		let oncomplete = is_function (options) ? options : null;
		
		if (not_set (options) || is_function (options)) options = {};
		if (not_set (options.speed)) options.speed = default_speed;
		if (isset (oncomplete)) options.oncomplete = oncomplete;
		
		this.animate ({ opacity: 0 }, { duration: options.speed });
		this.promise ().done (options.oncomplete);

	}/* fade_out */,
	
	
	family: function (selector) {

		let result = this.descendants (selector, true);
		let self = (not_comment (this.dom_object) && this.is (selector)) ? this : null;

		if (is_null (result) && is_null (self)) return null;
		if (is_null (result)) return self;
		if (is_null (self)) return result;

		return result.add (self);

	}/* family */,
	
	
	get_dimensions: function (container, handler, scope) {
		
		let orphaned = (this.orphan || isset (container));
		
		let control = orphaned ? this.clone ().cloaked.appendTo (coalesce (container, $(body))) : this.clone ().css ({
			visibility: "hidden",
			position: "absolute"
		}).remove_style ("display", "none");
		
		if (control.css ("display").matches ("contents")) control.css ("display", "flex").addClass ("flex-row");
		
		try {
		
			return clone ((is_string (scope) && scope.matches ("inner")) ? control.inner_dimensions : control.outer_dimensions);
		
		} finally {
			
			if (orphaned) {
				control.remove ();
				this.remove ();
			}// if;
			
			if (is_function (handler)) handler (result);
		
		}// try;
		
	}/* get_inner_dimensions */,
	
	
	get_outer_dimensions: function (container, handler) { return this.get_dimensions (container, handler, "outer") },
	get_inner_dimensions: function (container, handler) { return this.get_dimensions (container, handler, "inner") },
		
	
	handler: function (action, method) {
		if (not_set (method)) return this.dom_object [action];
		this.dom_object [action] = method;
		this.attr (action, "this." + action + " (event);");
		return this; // for chaining;
	}/* handler */,
	
	
	hide_control: function () {
		this.css ("visibility", "hidden");
	}/* hide_control */,
	
	
	insert_item: function (parameters) {
		
		if (not_set (parameters)) parameters = {};
		if (is_jquery (parameters)) parameters = { item: parameters };
		
		let direction = isset (parameters.direction) ? parameters.direction : directions.vertical; 
		let dimension = direction.matches (directions.vertical) ? "height" : "width";
		let item = parameters.item.clone ().remove_style ("display", "none");
			
		let panel = $("<div />").css ({
			position: "absolute", 
			visibility: "hidden"
		}).addClass ("insert-panel").appendTo (this);
		
		if (not_set (parameters.dimensions)) parameters.dimensions = item.get_dimensions (this);
		
		panel.append (item).remove_style ({
			position: "absolute",
			display: "contents"
		}).css ({
			width: 0, 
			height: 0		
		}).animate (parameters.dimensions, () => {
			
			let contents = panel.children ();

			this.append (contents.css ("opacity", 0));
			panel.remove ();
			
			contents.fade_in (parameters.oncomplete);
			
		});
		
	}/* insert_item */,
	
	
	remove_item: function (options) {
		
		if (is_function (options)) options = { oncomplete: options }
		if (in_object (directions, options)) options = { direction: options }
		if (not_set (options)) options = {}
			
		let dimension = isset (options.direction) ? (options.direction.matches (directions.horizontal) ? "width" : "height") : "height"; 
		
		this.fade_out (() => {
			this.freeze ().html (blank);
			this.animate ({ [dimension]: 0 }, { complete: function () { 
				this.remove ();
				if (is_function (options.oncomplete)) options.oncomplete ();
			} });
		});
		
	}/* remove_item */,
	
	
	replace_item: function (new_item, parent_object, oncomplete) {
		
		let item_parent = this.parent ();
		
		if (not_set (parent_object)) parent_object = item_parent;
		
		this.children ().fade_out (() => {
			
			let item_dimensions = new_item.get_dimensions (item_parent);
			let current_dimensions = $(this).clone ().get_dimensions (item_parent);
			
			let width = max (parent_object.dimensions.width, parent_object.dimensions.width - max (parent_object.dimensions.width, current_dimensions.width) + item_dimensions.width);
			let height = max (parent_object.dimensions.height, parent_object.dimensions.height - max (parent_object.dimensions.height, current_dimensions.height) + item_dimensions.height);
			
			parent_object.animate ({width: width, height: height}, { complete: () => {
				new_item.insertBefore (this);
				this.remove ();
				parent_object.remove_style (["width", "height"]);
				new_item.fade_in (() => { if (is_function (oncomplete)) oncomplete (); });
			} });
		});
	}/* replace_item */,
	
	
	
	show_control: function () {
		this.css ("visibility", "visible");
	}/* show_control */,
	
	
	is_not: function (selector) {
		return !this.is (selector);
	}/* is_not */,
	
	
	item: function (index) {
		return $(this.get (index));
	}/* item */,
	
	
	jquery_attr: function (value) {
		var result = function (value) {
			return eval (value);
		}.call (this, this.attr (value));
		return result;
	}/* jquery_attr */,
	
	
	load: function () {
		this.descendants ("[onload]").each (function (index, item) {
	    	if (new Array ("body", "iframe", "iframe", "link", "style").contains ($(item).prop ("tagName"))) return; 
	        $(item).prop ("onload").call (item);
	    });
	}/* load */,
	
	
	load_image: function (file_object, onload) {
		
		if (this.is_not ("img")) return false;
		
		let self = this;
	    let file_reader = new FileReader ();
	    
	    file_reader.onload = function () {
	    	self.dom_object.src = file_reader.result;
	    	if (isset (onload)) onload ();
	    }// onload;
	    file_reader.readAsDataURL (file_object.files [0]);
	}/* load_image */,
	
	
	matches: function (selector) {
		if (selector.indexOf (":") > 0) {
			var item = selector.split (":");
			return this.css (item [0]).equals (item [1]);
		}// if;
		return this.is (selector);
	}/* matches */,
	
	
	offset_left: function (base_value) {
		var matrix = $(this).css ("transform").match (/matrix\((.+?)\)/);
		var values = isset (matrix) ? matrix [1].split (",") : null;
		var offset = isset (values) ? values [4] : 0;
		return (isset (base_value, true) ? base_value : this.offset ().left) + parseInt (offset);
	}/* offset_left */,
	
	
	offset_top: function (base_value) {
		var matrix = $(this).css ("transform").match (/matrix\((.+?)\)/);
		var values = isset (matrix) ? matrix [1].split (",") : null;
		var offset = isset (values) ? values [5] : 0;
		return (isset (base_value, true) ? base_value : this.offset ().top) + parseInt (offset);
	}/* offset_top */,
	
	
	prototype: function (new_prototype) {
		this.each (function (index, item) {
			item.prototype = new_prototype;
		});
	}/* prototype */,
	
	
	remove_listeners: function () {
		return this.parent ().append (this.clone ()).remove (this);
	}/* remove_listeners */,
	


	
	remove_style: function (offending_styles, conditional_value) {
		
		let result = null;
		let styles = this.attr ("style");
		
		if (not_set (styles)) return this;
		if (is_string (offending_styles)) offending_styles = { [offending_styles]: is_string (conditional_value) ? conditional_value : null };
		
		if (is_array (offending_styles)) {
			let style_list = offending_styles;
			offending_styles = {};
			for (let style of style_list) {
				offending_styles [style] = null;
			}// for;
		}// if;
		
		for (var style of styles.split (";")) {
			
			let item = style.split (":");
			let name = item [0].trim ().toLowerCase ();
			
			if (offending_styles.hasOwnProperty (name) && (is_null (offending_styles [name]) || offending_styles [name].matches (item [1]))) continue;
			if (is_null (result)) result = new Array ();
			
			result.push (item [0] + ": " + item [1]);
			
		}// for;
		
		this.attr ("style", is_array (result) ? result.join ("; ") : null);
		
		return this;
		
	}/* remove_style */,
	
	
	reset: function () {
		
		if ($(this).is ("form")) {
			for (var form in $(this)) {
				if (!(form instanceof HTMLFormElement)) continue;
				form.reset ();
			}// for;
			return;
		}// if;
		
		$(this).descendants (":input").value = null;
		
	}/* reset */,
	
	
	resize: function (dimensions, oncomplete) {
		this.animate (dimensions, { complete: oncomplete });
	}/* resize */,
	
	
	serialize_form: function () {
		let result = null;
		this.each (function (index, item) {

			let field = $(item);

			if (field.is ("input[type=file]")) return true;
			if (not_set (field.value)) return true;
			
			if (is_null (result)) result = new Array ();
			
			result.push ({
				name: field.attr ("name"),
				value: field.value
			});
			
		});
		return result;
	}/* serialize_form */,
	
	
	serialize_values: function () {
		
		
		let values = this.descendants (":input[name], [onserialize]").filter (function () { return is_null ($(this).ancestor ("[onserialize]")) || $(this).is ("[onserialize]"); });
		let files = this.descendants ("input[type=file]");
		
		
		function create_form_data (items) {
			
			let result = null;
			
			for (let item of items) {
				
				let control = is_tag (item) ? $(item) : item;
				let form_values = (is_null (result) ? (result = new FormData ()) : result).values;
				let current_values = (isset (form_values) && isset (form_values [control.name])) ? (is_json (form_values [control.name]) ? json_decode (form_values [control.name]) : new Array (form_values [control.name])) : null;
				
				if (is_jquery (control)) {
					
					if (control.is ("[onserialize]")) {
						if (not_set (control.name)) throw "onserialize defined with no name attribute set";
						result.append (control.name, new Function (control.attr ("onserialize")).call (control));
						continue;
					}// if;
				
					if (control.is ("input[type=checkbox]") && control.unchecked) continue;
							
				}// if;

				
				if (is_null (current_values)) {
					result.set (control.name, control.value);
					continue;
				}// if;
				
				switch (is_array (current_values)) {
					case true: current_values.push (numeric_string (control.value)); break;
					default: current_values = [current_values, numeric_string (control.value)]; break;
				}// switch;
			
				result.set (control.name, json_encode (current_values));
				
			}// for;
			
			files.each (function (index, item) {
				
				let filename = item.name;
				
				for (let file of item.files) {
					result.append (item.name + "[]", file, file.name);
				}// for;
				
			});
			
			return result;
			
		}// create_form_data;

		
		for (let argument of Array.from (arguments)) {
			for (let key in argument) {
				if (!argument.hasOwnProperty (key)) continue;
				if (is_null (values)) values = new Array ();
				values.push ({ name: key, value: argument [key] });
			}// for;
		}// for;
		
		return create_form_data (values);
		
	}/* serialize_values */,
	
	
	set_contents: function (contents) {
		if (is_jquery (contents)) return this.html (contents.outer_html);
		if (is_string (contents)) return this.html (contents);
		throw "Unrecognized content in set_contents";
	}/* set_contents */
	
});


/**** jQuery Extension Properties ****/


Object.defineProperties (jQuery.fn, {
	
	
	checkable: { get: function () { return this.is ("input[type=checkbox], input[type=radio]"); } },


	checked: {
		set: function (value) {
			if (this.is_not ("input[type=checkbox]") && this.is_not ("input[type=radio]")) return false;
			this.dom_object.checked = value;
		}/* setter */,
		get: function () {
			if (this.is_not ("input[type=checkbox]") && this.is_not ("input[type=radio]")) return false;
			return this.dom_object.checked;
		}/* getter */
	}/* checked */,
	
	
	cloaked: {
		get: function () {
			
			let control = (this.length == 1) ? this.clone () : $("<div />").html (this.clone ());
			
			control.css ({
				visibility: "hidden",
				position: "absolute"
			}).remove_style ("display", "none").remove_style (["width", "height"]);
			
			return control;
			
		}/* getter */
	}/* cloaked */,
	
	
	complete_height: {
		get: function () {
			return parseInt (this.outerHeight () + parseFloat (this.css ("marginTop"))  + parseFloat (this.css ("marginBottom")));
		}/* getter */
	}/* complete_height */,
	
	
	complete_width: {
		get: function () {
			return parseInt (this.outerWidth () + parseFloat (this.css ("marginLeft"))  + parseFloat (this.css ("marginRight")));
		}/* getter */
	}/* complete_width */,
	
	
	coordinates: {
		get: function () {
			if (this.orphan) return null;
			return this.offset ();
		}/* getter */
	}/* coordinates */,
	
	
	disabled: {
		get: function () { return this.hasClass ("disabled"); },
		set: function (value) {
			if (value) {
				this.family (":input").attr ("disabled", "true");
				this.addClass ("disabled");
				return;
			}// if;
			this.family (":input").removeAttr ("disabled");
			this.removeClass ("disabled");
		}/* setter */
	}/* disabled */,
	
	
	outer_dimensions: {
		get: function () {
			if (this.orphan) return this.get_outer_dimensions ($("body"), true);
			return {
				width: this.dom_object.offsetWidth,
				height: this.dom_object.offsetHeight
			};
		}/* getter */
	}/* outer_dimensions */,
	
	
	inner_dimensions: {
		get: function () {
			if (this.orphan) return this.get_inner_dimensions ($("body"), true);
			return {
				width: this.dom_object.clientWidth,
				height: this.dom_object.clientHeight
			};
		}/* getter */
	}/* inner_dimensions */,
	
	
	dimensions: { get: function () { return this.outer_dimensions; } },
	
	
	dom_object: {
		get: function () {
			return this.get (0);
		}/* getter */
	}/* dom_object */,
	
	
	exists: {
		get: function () {
			return this.length > 0;
		}// get;
	}/* exists */,
	
	
	has_children: { get: function () { 
		return this.children ().length > 0; 
	} },
	
	hidden: { get: function () { return ((this.css ("opacity") == 0) || (this.css ("visibility") == "hidden") || (this.css ("display") == "none")); }/* getter */ },
	
	
	id: {
		get: function ()	{ return $(this).attr ("id"); },
		set: function (id)	{ $(this).attr ("id", id); }
	}/* id */,
	
	
	in_dom:		{ get: function () { return jQuery.contains (document, this.dom_object); } },
	inner_html:	{ get: function () { return $(this).dom_object.innerHTML; } },
	is_empty:	{ get: function () { return this.length == 0; } },
	
	
	label: {
		get: function () {
			if (this.is ("label")) return this;
			return $("[for=" + this.id + "]");
		}/* getter */
	}/* label */,
	
	
	location: {
		get: function () {
			if (this.orphan) return null;
			return {
				top: this.dom_object.offsetTop,
				left: this.dom_object.offsetLeft
			};
		}/* getter */
	}/* location */,
	
	
	mash_encoded: { 
		get: function () {
		
			let result = null;
			
			$(this).descendants (":input").each (function (index, item) {
				
				let control = $(item);
				let value = control.value;
	
				if (not_set (value)) return;
				if (is_null (result)) result = new Array ();
				
				result.push (base64_encode (base64_encode (control.attr ("name"), true) + ":" + base64_encode (value, true)));
	
			});

			return base64_encode (result.join (":"), true);
				
		}/* getter */ 
	}/* mash_encoded */,
	
	
	name: { 
		get: function () { return this.attr ("name"); },
		set: function (value) { this.attr ("name", value); }
	}/* name */,
	
	
	not_empty:		{ get: function () { return !this.is_empty; } },
	
	
	outer_html: {
		get: function () {
			var result = blank;
			if (this.length == 0) return result;
			this.each (function (index, item) {
				if (isset (result)) result += line_break + line_break;
				result += item.outerHTML;
			});
			return result;
		}/* getter */
	}/* outer_html */,
	
	
	outer_width: 	{ get: function () { return this.outerWidth (); } },
	orphan: 		{ get: function () { return !(this.parent ().exists); } },
	showing: 		{ get: function () { return !this.hidden; } },

	
	signature: {
		get: function () {
			
			let result = null;
			
			switch (this.length) {
				case 0: return result;
				case 1: return this.dom_object.signature;
			}// switch;
			
			this.each (function (index, item) {
				if (is_null (result)) result = new Array ();
				result.push (item.signature);
			});

			return result;
			 
		}/* getter */
	}/* signature */,
	
	
	start_tag: {
		get: function () {
			if (this.is (":empty")) {
				let parts = this.outer_html.split ("><");
				return (parts.length > 1) ? parts [0] + ">" : parts [0];
			}// if;
			return this.outer_html.split (this.html ()) [0];
		}/* getter */
	}/* start_tag */,
	
	
	tagname: 		{ get: function () { return $(this).dom_object.tagName.toLowerCase (); } },
	unchecked:		{ get: function () { return !$(this).checked; } },
	
	
	value: { 
		get: function () { return (this.checkable && not_set (this.attr ("value"))) ? this.checked : this.val (); },
		set: function (value) { this.val (value); }
	}/* value */,
	
	
	visible: {
		get: function () {
			return !this.hidden;
		}/* get */
	}/* visible */

	
});



/**** jQuery Extension Overrides ****/


jQuery.fn.original_click = jQuery.fn.click;


jQuery.fn.click = function (method) {
	this.each (function (index, item) {
		item.onclick = method;
	});
}/* jQuery.fn.click */


	