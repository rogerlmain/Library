class eyecandy_button extends HTMLButtonElement {

	show_eyecandy (options) {
		
		let self = $(this);
		let contents = self.children ("div.contents");
		
		
		function get_resize_dimensions (eyecandy) {
			
			let result = eyecandy.get_outer_dimensions (contents);
			
			if (not_set (options.static)) return null;
			
			if ((options.static == directions.vertical) || (options.static == directions.both)) delete result.height;
			if ((options.static == directions.horizontal) || (options.static == directions.both)) delete result.width;
			
			return result;
			
		}// get_resize_dimensions;

		
//		self.css ("pointer-events", "none");
		
		if (is_function (options)) options = { oncomplete: options }
		
		if (options.static === true) self.freeze ();
		
		if (contents.is_empty) self.html (contents = $("<div />").addClass ("contents").css ({
			margin: 0,
			border: 0,
			padding: 0
		}).html (self.html ()));

		if (not_set (this.contents)) this.contents = contents.clone ().css ("display", "none");
		
		contents.disappear (function () {
			
			let eyecandy = options.eyecandy || self.attr ("eyecandy") || $("<div />").html ("Processing...");
			
			if (is_string (eyecandy)) switch ($(eyecandy).length) {
				case 0: eyecandy = $("<div />").html (eyecandy); break;
				default: eyecandy = $(eyecandy).clone (); break;
			}// if;
			
			if (not_set (options.static)) {
				self.html (eyecandy.css ("opacity", 0).remove_style ("display").removeAttr ("id"));
				eyecandy.appear (oncomplete);
				return;
			}// if;

			contents.resize (get_resize_dimensions (eyecandy), function () {
				self.html (eyecandy.css ("opacity", 0).remove_style ("display").removeAttr ("id"));
				eyecandy.appear (options.oncomplete);
				return;
			});
		
		});
		
		return false;
		
	}// show_eyecandy;
	
	
	hide_eyecandy (oncomplete) {
		
		let self = $(this);
		
		self.children ().disappear (function () {
			let contents = self.dom_object.contents.clone ().css ("opacity", 0).remove_style ("display");
			self.html (contents);
			contents.appear (() => { self.remove_style ("pointer-events") });
		});
		
	}// hide_eyecandy;

	
}// eyecandy_button;


customElements.define ("eyecandy-button", eyecandy_button, {extends: "button"});