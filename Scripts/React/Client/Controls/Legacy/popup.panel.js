// Parameters:
//
//		easing: default = swing
//		delay:	default = 0 (do not close)
//				time delay before the box closes again (0 means stay open)
//				in seconds - fractions allowed (e.g: 1.2 = 1200ms)


class popup_panel extends HTMLElement {
	
	
	show (oncomplete) {
		
		let popup_panel = $(this).dom_object;
		let contents = $(this).descendants ("contents");
		
		let delay = parseFloat ($(this).attr ("delay")) || 0;
		let options = { easing: easing () }
		
		
		function easing () {
			switch ($(popup_panel).attr ("easing")) {
				case "bounce": return "easeOutBounce";
				default: return "swing";
			}// switch;
		}// easing;
		
		
		function close () {
			if (delay == 0) return;
			setTimeout (function () {
				popup_panel.hide ();
			}, delay * 1000);
		}// close;
		
		
		/********/
		

		$(this).animate (extend (popup_panel.dimensions, popup_panel.open_location), {
			easing: easing (),
			complete: function () {
				contents.fade_in (close);
				if (is_function (oncomplete)) oncomplete ();
			}/* complete */
		});
		
	}// show;
	
	
	hide (oncomplete) {
		
		let popup_panel = $(this).dom_object;
		let contents = $(this).descendants ("contents");
		

		function easing () {
			switch ($(popup_panel).attr ("easing")) {
				case "bounce": return "easeInBounce";
				default: return "swing";
			}// switch;
		}// easing;
		
		
		contents.fade_out (function () {
			$(popup_panel).animate (extend ({
				width: 0,
				height: 0
			}, popup_panel.closed_location), {
				easing: easing (),
				complete: function () {
					if (is_function (oncomplete)) oncomplete.call ($(this).dom_object);
					if (isset ($(this).attr ("onclose"))) new Function ($(this).attr ("onclose")).call ($(this).dom_object);
				}// complete;
			});
		});
			
	}// hide;
	
	
	connectedCallback () {
		jQuery.fn.extend ({
			show: this.show
		});
	}// connectedCallback;
	
	
}// popup_panel;


Object.defineProperties (popup_panel.prototype, {
	
	open: {
		get: () => { return $(this).descendants ("contents").height > 0; }
	}/* open */
	
});


initialize ("popup-panel contents", function () {
	
	let popup_panel = $(this).ancestor ("popup-panel").dom_object;
	
	popup_panel.dimensions = $(popup_panel).dimensions;
	popup_panel.open_location = $(popup_panel).location;
	
	popup_panel.closed_location = {
		top: popup_panel.open_location.top + Math.round (popup_panel.dimensions.height / 2),
		left: popup_panel.open_location.left + Math.round (popup_panel.dimensions.width / 2)
	}// closed_location;
	
	$(popup_panel).css (extend ({
		width: 0,
		height: 0
	}, popup_panel.closed_location));
	
	$(this).css ({ opacity: 0 });
	
});


customElements.define ("popup-panel", popup_panel);


