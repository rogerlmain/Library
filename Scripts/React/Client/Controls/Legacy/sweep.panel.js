const default_direction = "right";


class sweep_panel extends HTMLElement {
	
	
	constructor () {
		
		super ();
		

		this.offset = function (direction, base_value) {
			var matrix = $(this).css ("transform").match (/matrix\((.+?)\)/);
			var values = isset (matrix) ? matrix [1].split (",") : null;
			return base_value - parseInt (isset (values) ? ((direction == "left") ? values [4] : values [5]) : 0);
		}/* this.offset */

		
		this.is_direction = function (value) {
			return is_string (value) && (new Array ("up", "down", "left", "right").contains (value));
		}// is_direction;
		
		
		this.get_direction = function (options) {
			
			let control = $(this);
			let direction = coalesce ((this.is_direction (options) ? options : ((is_object (options) || is_array (options)) ? options ["direction"] : null)), control.attr ("direction"), default_direction);
			let directions = direction.split (",");
			
			let result = {
				entry: (this.is_direction (directions [0]) ? directions [0] : default_direction),
				exit: (directions.length > 1) ? (this.is_direction (directions [1]) ? directions [1] : default_direction) : (this.is_direction (directions [0]) ? directions [0] : default_direction)
			};
			
			return result;
			
		}// get_direction;
		
		
		this.get_handler = function (options, handler) {
			
			let tag_handler = $(this).attr (handler);
			
			if (is_function (options)) return options;
			if ((is_object (options) || is_array (options)) && is_function (options [handler])) return options [handler];
			if (isset (tag_handler)) return new Function (tag_handler);
			
			return null;
			
		}// get_handler;
		
	}// constructor;
	
	
	/********/
	

	enter (options) {
		
		let control = $(this);
		let onenter = this.get_handler (options, "onenter");
		
		if (this.onscreen) return; 
		
		if (not_set (options)) options = {}
		if (is_empty (options.destination, true)) options.destination = "50%";
		if (is_empty (options.speed)) options.speed = coalesce (control.attr ("duration"), default_speed);

		options.direction = this.get_direction (options).entry;

		this.onscreen = true;

		switch (options.direction) {
			case "up": control.css ({ top: this.offset ("top", window.innerHeight) }); break;
			case "down": control.css ({ top: (0 - this.offset ("top", control.dimensions.height)) }); break;
			case "left": control.css ({ left: this.offset ("left", window.innerWidth) }); break;
			default: control.css ({ left: (0 - this.offset ("left", control.dimensions.width)) }); break;
		}// switch;

		control.show_control ();

		control.animate ({ [new Array ("up", "down").contains (options.direction) ? "top" : "left"]: options.destination }, {
			complete: function () {
				control.load ();				
				if (isset (onenter)) onenter.call (this);
			}/* complete */,
			duration: options.speed
		});
		
	}// enter;
	

	exit (options) {
		
		let control = $(this);
		let destination = null;
		let onexit = this.get_handler (options, "onexit");
				
		if (is_empty (options) || is_function (options) || (this.is_direction (options))) options = {}
		if (is_empty (options.speed)) options.speed = coalesce (control.attr ("duration"), default_speed);

		options.direction = this.get_direction (options).exit;
		
		switch (options.direction) {
			case "up": destination = (0 - this.offset ("top", control.dimensions.height)); break;
 			case "down": destination = this.offset ("top", window.innerHeight); break;
 			case "left": destination = (0 - this.offset ("left", control.dimensions.width)); break;
 			default: destination = this.offset ("left", window.innerWidth); break;
		}// switch;

		control.animate ({ [new Array ("up", "down").contains (options.direction) ? "top" : "left"]: destination }, {
			complete: function () {
				control.hide_control ();
				control.offscreen = true;
				if (onexit) onexit.call (this);
			}/* complete */,
			duration: options.speed
		});
		
	}// exit;
	
	
	/********/
	
	
	connectedCallback () {
		
		let control = $(this);

		$(this).css ("position", "absolute");

		if (this.onscreen) {
			if (isset (control.attr ("top"))) control.css ({ top: control.attr ("top") }); 
			if (isset (control.attr ("left"))) control.css ({ left: control.attr ("left") }); 
		} else {
			control.css ("visibility", "hidden");
		}// if;
		
	}// connectedCallback;
	
	
}// sweep_panel;


Object.defineProperties (sweep_panel.prototype, {
	
	offscreen: {
		get: function () { return !this.onscreen; },
		set: function (value) { this.onscreen = !value; }
	}/* offscreen */,
	
	onscreen: {
		get: function () { return $(this).attr ("visible") !== "false"; },
		set: function (value) { $(this).attr ("visible", (value === true ? "true" : "false")); }
	}/* onscreen */
	
});


Object.defineProperties (jQuery.fn, {
	
	onscreen: {
		get: function () {
			let result = false;
			this.each (function (index, item) {
				if (item.onscreen) {
					result = true;
					return false;
				}// if;
			});
			return result;
		}/* getter */,
		set: function (value) {
			this.each (function (index, item) {
				item.onscreen = value;
			});
		}/* setter */
	}/* onscreen */,
	
	offscreen: { 
		get: function () { return !this.onscreen; },
		set: function (value) { this.onscreen = !value; }
	}/* offscreen */
	
});


customElements.define ("sweep-panel", sweep_panel);


