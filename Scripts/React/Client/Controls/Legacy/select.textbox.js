class select_textbox extends HTMLSelectElement {
	
	
	connectedCallback () {

		let self = $(this);
		
		this.textbox = $("<input type='text' />").css ({
			position: "absolute",
			display: "none"
		}).appendTo (this.parentNode);
				
		this.textbox.dom_object.addEventListener ("blur", function (event) {
			self.dom_object.hide_textbox (true);
		});
		
		this.textbox.dom_object.addEventListener ("keydown", function (event) {
			event.stopPropagation ();
			if (new Array (9, 13).contains (event.which)) self.dom_object.hide_textbox (true);
			if (event.which == 27) self.dom_object.hide_textbox (false);
		});
		
		this.textbox.dom_object.addEventListener ("blur", function (event) {
			if (self.dom_object.textbox_showing) self.dom_object.hide_textbox (true);
		});
		
	}// connectedCallback;
	
	
	constructor () {
		
		super ();
		
		this.hide_textbox = function (save) {
			
			let self = $(this);
			
			if (save && (not_empty (this.textbox.value))) {
				let add_option = self.children ("option[value=add]");
				if (add_option.is_empty) add_option = $("<option />").val ("add").html (self.attr ("text") || "Add").appendTo (self);
				this.previous_index = $("<option />").html (this.textbox.value).attr ("selected", "true").insertBefore (add_option).dom_object.selectedIndex;
			} else {
				this.selectedIndex = 0;
			}// if;
			
			this.textbox.css ("display", "none");
			
		}// hide_textbox;

		
		this.show_textbox = function (event) {
			
			let self = $(this);
			
			this.textbox.remove_style ("display").focus ().css ({
				left: this.offsetLeft,
				top: this.offsetTop,
				width: self.dimensions.width,
				height: self.dimensions.height
			}).value = blank;
			
		}// show_textbox;
		

	}// constructor;
	
	
}// select_textbox;


Object.defineProperties (select_textbox, {
	textbox_hidden: { get: function () { return this.textbox.display.matches ("none"); } },
	textbox_showing: { get: function () { return !this.textbox_hidden; } }
});


initialize ("select[is=select-textbox]", function () {

	this.css ("min-width", "12em");
	
	this.dom_object.addEventListener ("change", function (event) {
		if (this.selected_value == "add") {
			let onadd = this.getAttribute ("onadd");
			if (isset (onadd) && !(new Function ("event", onadd).call (this, event))) {
				this.selectedIndex = 0;
				return;
			}// if;
			this.show_textbox ();
		}// if;
	});
	
	this.dom_object.addEventListener ("click", function () {
		if (this.length == 0) this.show_textbox ();
	});
	
});


initialize ("select[is=select-textbox] option", function () {

	let select = this.parent ();

	if (select.children ("option[value=add]").length > 0) return;
	select.append ($("<option />").val ("add").html ("add"));
	
});


customElements.define ("select-textbox", select_textbox, {extends: "select"});
