/*	

	Parameters (lowercase items implemented):
	
		name: [optional] for multiple dialog windows
		
		contents: jquery object or text [optional with eyecandy]
		eyecandy: jquery object or text [optional with contents]
		
		position: (top or bottom, left or right) [default: bottom / right]
		
		action / option / data: ajax parameters
		blackscreen: boolean (show blackscreen): default true
		
		escape: boolean (allow "escape" key to close the window): default true
		
		onclose: if button_type.close used, activated on window close
		
		BUTTONS: JQUERY OBJECT (?)

	HOVER: BOOLEAN (POSITION WHERE CLICKED): DEFAULT FALSE
		CURSOR: BOOLEAN (MOVES WITH CURSOR): DEFAULT FALSE

		
	Classes:
	
		div.blackscreen
		div.dialog-frame
		div.dialog-window

*/


const dialog_buttons = { close: "Close" }


function dialog_window (parameters) {
	
	
	const buffer = 5; 
	
	let self = this;
	

	/********/

	
	Object.defineProperties (this, {
		
		hovering: {
			get: function () {
				return self.options.hover === true;
			}/* getter */
		}/* hovering */,
	
		cursor_location: {
			get: function () {
				return self.options.cursor == true;
			}/* getter */
		}/* cursor_location */
		
	});
	
	
	/********/
	
	
	function add_buttons (panel) {
		
		let buttons = self.options.buttons;
		let button_bar = panel.descendants ("div.button-bar");
		
		if (not_empty (buttons)) {
			
			if (button_bar.is_empty) button_bar = $("<div />").addClass ("right-button-bar").appendTo (panel);
			
			for (let button of buttons) {
				
				let button_object = $("<button />").appendTo (button_bar);
				
				if (button == dialog_buttons.close) {
					button_object.html ("Close").attr ("onclick", "return new dialog_window ().hide ();");
					if (isset (self.options.onclose)) button_object.dom_object.addEventListener ("click", self.options.onclose);
				}// if;
				
			}// for;
			
		}// if;
		
		return panel;
		
	}// add_buttons;


	function dialog_position (direction) {
		if (isset (self.options)) {
			if (isset (self.options [direction])) return self.options [direction];
			if (isset (self.options.position) && isset (self.options.position [direction])) return self.options.position [direction];
		}// if;
		return null;
	}// dialog_position;		
			
			
	function get_dialog () {
		
		let dialog = $("[name=" + self.dialog_name + "]");
		
		let top = dialog_position ("top");
		let left = dialog_position ("left");
		
		let new_dialog = is_empty (dialog);
		
		if (new_dialog) dialog = $("<div />").addClass ("dialog").attr ("name", self.dialog_name).appendTo ($("body"));
		
		dialog.blackscreen = dialog.children ("div.blackscreen");
		dialog.window = dialog.children ("div.dialog-window");
		dialog.frame = dialog.window.children ("div.dialog-frame");
		
		if (!new_dialog) return dialog;
		
		if (dialog.blackscreen.is_empty) dialog.blackscreen = $("<div />").css ({
			backgroundColor: "black", 
			position: "absolute",
			left: 0,
			top: 0,
			width: "100%",
			height: "100%",
			opacity: 0,
			zIndex: -1
		}).addClass ("blackscreen").appendTo (dialog);

		if (dialog.window.is_empty) dialog.window = $("<div />").css ({
			position: "absolute",
			opacity: 0,
			zIndex: -1
		}).addClass ("dialog-window").appendTo (dialog);

		if (dialog.frame.is_empty) dialog.frame = $("<div />").css ({
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		}).addClass ("dialog-frame").appendTo (dialog.window);
		
		dialog.window.css ({
			top: top || "50%",
			left: left || "50%"
		});
		
		if (is_null (left) || is_null (top)) {
			let transformation = new Array ();
			if (is_null (top)) transformation.push ("translateY(-50%)"); 
			if (is_null (left)) transformation.push ("translateX(-50%)");
			if (transformation.length > 0) dialog.window.css ("transform", transformation.join (blank));
		}// if;
		
		if (not_set (self.options) || (self.options.escape !== false)) dialog.window.attr ("onescape", "new dialog_window ({ name: " + quoted (self.dialog_name) + " }).hide ();");
			
		return dialog;
		
	}// get_dialog;

	
	function parse_parameters () {
		self.options = parameters || {};
		self.dialog_name = self.options.name || "default_dialog_window";
		self.dialog = get_dialog ();
	}// parse_parameters;
	
	
	function resize_dialog (contents, oncomplete) {
		if (contents.length > 1) contents = $("<div />").html (contents);
		self.dialog.frame.animate (contents.get_outer_dimensions (self.dialog.frame), {
			complete: oncomplete
		});
	}// resize_dialog;

	
	function reposition_window (event) {
		
		if (not_set (self.position.horizontal)) self.position.horizontal = "left";  
		if (not_set (self.position.vertical)) self.position.vertical = "bottom";  
		
		if (not_event (event)) return;
		
		self.dialog.window.css ({
			left: self.position.horizontal.matches ("left") ? (event.clientX + buffer) : (event.clientX - (self.dialog.window.complete_width + buffer)),
			top: self.position.vertical.matches ("top") ? (event.clientY + buffer) : (event.clientY - (self.dialog.window.complete_height + buffer))
		});
		
	}// reposition_window;
	
	
	/********/
	
	
	this.hide = function (dialog_name) {
		
		self.dialog.window.disappear (function () {
			self.dialog.blackscreen.disappear (function () {
				self.dialog.blackscreen.css ("z-index", -1);
				self.dialog.window.css ({ zIndex: -1 });
				self.dialog.frame.remove_style ("width").remove_style ("height");
				self.contents = null;
				if (isset (self.options.onclose)) {
					if (is_string (self.options.onclose)) return new Function (self.options.onclose).call (this);
					if (is_function (self.options.onclose)) return self.options.onclose ();
				}// if;
			});
		});
		
		return false;
		
	}// hide_dialog;
	
	
	this.show = function (event) {
		
		
		function load_ajax () {
			
			let ajax_object = null;
			
			if (not_set (self.options.action) || not_set (self.options.option)) return;
			
			ajax_object = { 
				data: extend ({
					action: self.options.action,
					option: self.options.option,
				}, self.options.data),
				success: function (response) {

					if (self.options.show_response === false) {
						if (is_function (self.options.oncomplete)) self.options.oncomplete (response);
						return;
					}// if;
					
					let response_panel = $("<div />").html (response).css ("display", "none").appendTo ($("body"));
					wait_for_images (function () {
						show_window (response_panel, self.options.oncomplete);
					});
					
				}/* success */
			}// ajax_object;
			
			if (isset (self.options.url)) ajax_object.url = self.options.url;
			
			jQuery.ajax (ajax_object);
			
		}// load_ajax;
		
		
		function load_contents (contents, oncomplete) {

			self.dialog.frame.html (contents.remove_style (["position", "visibility", "display"]));
			
			switch (self.dialog.window.showing) {
				case true: self.dialog.frame.appear (oncomplete); break;
				default: self.dialog.window.appear (oncomplete); break;
			}// switch;
			
		}// load_contents;
	
		
		function show_contents (contents, oncomplete) {
			
			add_buttons (contents);
			
			if (self.dialog.window.showing) return resize_dialog (contents, function () { load_contents (contents, oncomplete); }); 
			load_contents (contents, oncomplete);
		
		}// show_contents;
		
		
		function show_window (contents, oncomplete) {
			
			if (is_string (contents)) contents = $("<div />").html (contents);
			if (self.dialog.window.showing) return self.dialog.frame.disappear (() => { show_contents (contents, oncomplete); });
			
			self.dialog.window.css ("z-index", 15);

			if (self.options.blackscreen !== false) return self.dialog.blackscreen.css ({
				zIndex: 10,
				visibility: "visible"
			}).animate ({ opacity: 0.5 }, { complete: function () { load_contents (contents, oncomplete); } });
					
			load_contents (contents, oncomplete);

		}// show_window;

		
		if (isset (self.options.contents)) {
			let contents = $("<div />").html (self.options.contents);
			return show_window (add_buttons (contents), self.options.oncomplete);
		}// if;
		
		if (isset (self.options.eyecandy)) {
			show_window (self.options.eyecandy, this.show);
			return delete self.options.eyecandy;
		}// if;

		if (isset (self.options.action) && isset (self.options.option)) load_ajax ();
		
	}// show;
	
	
	this.open = this.show;
	this.close = this.hide;
	
	
	/********/
	
	
	parse_parameters ();
	return self;

	
}// dialog_window;
