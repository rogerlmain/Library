class fade_list extends HTMLElement {
	
	fade_out (oncomplete) {
		$(this).descendants ("fade-item").fade_out (oncomplete);
	}// fade_out;
	
	run (oncomplete) {
		$(this).descendants ("fade-item").dom_object.fade_in (oncomplete);
	}// run;
	
}// fade_list;


class fade_item extends HTMLElement {
	
	
	fade_in (oncomplete) {
		$(this).fade_in ({ 
			speed: parseInt (this.speed),
			oncomplete: function () {
				var sibling = $(this).next_cousin ("fade-list");
				if (isset (sibling)) sibling.dom_object.fade_in ();
				if (is_function (oncomplete)) oncomplete.call ($(this).dom_object);
			}/* oncomplete */
		});
	}// fade_in;
	
	
	fade_out (oncomplete) {
		$(this).fade_out ({ 
			speed: this.speed,
			oncomplete: function () {
				if (is_function (oncomplete)) oncomplete.call ($(this).dom_object);
			}/* oncomplete */
		});
	}// fade_out;
	
	
	connectedCallback () {
		
		var control = $(this);
		
		control.css ({
			display: "block",
			opacity: 0
		});
		
	}// connectedCallback;
	
}// fade_item;


Object.defineProperties (fade_item.prototype, {
	
	speed: {
		get: function () { return ($(this).ancestor ("fade-list").attr ("speed") || default_speed); },
		set: function (value) { $(this).ancestor ("fade-list").attr ("speed", value); }
	}/* speed */
	
});


customElements.define ("fade-list", fade_list);
customElements.define ("fade-item", fade_item);

