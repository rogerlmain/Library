class slide_panel extends HTMLElement {
	
	
	hide (oncomplete) {
		
		
		function run () {
			this.tag.animate ({ "height": 0 }, function () {
				if (is_function (oncomplete)) oncomplete.call (this); 
			}); 
		}// run;
		
		
		if (this.open) {
			this.slide_in (run);
			return;
		}// if;
		
		run ();
		
	}// hide;
	
	
	show (oncomplete) {
		if ((this.open) || (tag.css ("height") == 0)) return;
		this.tag.animate ({ "height": $(this.tag.outer_html).dimensions.height }, function () {
			if (is_function (oncomplete)) oncomplete.call (this);
		}); 
	}// show;
	
	
	slide_in (oncomplete) {
		
		let control = $(this);
		
		if (control.is_not ("slide-panel")) throw "slide_in called on object that is not a slide panel";
		control.dom_object.contents.animate ({ height: 0 }, { 
			complete: function () {
				let tag = control.siblings ("tag");
				if (isset (tag.attr ("closed_click"))) tag.attr ("onclick", tag.attr ("closed_click"));
				if (is_function (oncomplete)) oncomplete.call (control.parent ()); 
			}/* complete */
		});

	}// slide_in;
	
	
	slide_out (oncomplete) {
		
		let control = $(this);
		
		if (control.is_not ("slide-panel")) throw "slide_in called on object that is not a slide panel";
		control.dom_object.contents.animate ({ height: $(this.contents.inner_html).dimensions.height }, { 
			complete: function () {
				let tag = control.siblings ("tag");
				if (isset (tag.attr ("open_click"))) tag.attr ("onclick", tag.attr ("open_click"));
				if (is_function (oncomplete)) oncomplete.call (control.parent ()); 
			}/* complete */
		});
		
	}// slide_out;

	
	initialize_contents () {
		$(this).css ({
			height: 0,
			overflow: "hidden",
			display: "flex",
			alignItems: "flex-end"
		}).handler ("onclickescape", (event) => {
			event.stopPropagation ();
			$(this).parent ().slide_in ();
		});
	}// initialize_contents;
	
	
	initialize_tag () {
		$(this).attr ("onclick", $(this).attr ("closed_click"));
		if (isset ($(this).parent ().attr ("closed"))) $(this).css ({
			height: 0,
			overflow: "hidden"
		});
	}// initialize_tag;
	
	
	load_contents (contents, oncomplete) {
		
		let self = $(this).dom_object;
		
		if (this.contents.is_empty) {
			$(this).append ($("<contents />"));
			$(this).initialize_contents.call (this.contents);
		}// if;
		
		this.contents.html (contents);
		if (is_function (oncomplete)) oncomplete.call (self);
		
	}// load_contents;
	
	
	connectedCallback () {
		jQuery.fn.extend ({
			load_contents: this.load_contents,
			initialize_contents: this.initialize_contents,
			initialize_tag: this.initialize_tag,
			slide_in: this.slide_in,
			slide_out: this.slide_out
		});
	}// connectedCallback;
	
	
}// slide_panel;


Object.defineProperties (slide_panel.prototype, {
	
	open: {
		get: function () { 
			let contents = $(this).descendants ("contents");
			return (contents.is_empty ? false : contents.height () > 0);
		}/* getter */
	}/* open */,

	contents:	{ get: function () { return $(this).descendants ("contents"); } },
	tag:		{ get: function () { return $(this).descendants ("tag"); } }

});


customElements.define ("slide-panel", slide_panel);


initialize ("slide-panel contents", function () { $(this).parent ().initialize_contents.call (this); });
initialize ("slide-panel tag", function () { $(this).parent ().initialize_tag.call (this); });

