// To be deprecated - change to microhelp.panel.js to avoid confusion with popup.panel.js (popup-panel) - use slide.panel.js template


initialize ("[popup]", function () {
	
	const cursor_margin = 0;
	
	
	let control = $(this);

	
	function position_popup (event, popup_window) {
		
		var relative_parent = popup_window.ancestor ("position: relative");

		var cursor = {
			x: event.pageX - relative_parent.offset ().left,
			y: event.pageY - relative_parent.offset ().top
		}// cursor;
		
		popup_window.css ({
			top: (cursor.y - popup_window.outerHeight ()) + cursor_margin,
			left: cursor.x + cursor_margin
		});
		
	}// position_popup;
	
	
	function mouseenter_handler (event) {
		var popup_window = $(this).jquery_attr ("popup");
		position_popup (event, popup_window);
		popup_window.css ({ zIndex: 20 }).appear ();
	}// mouseenter_handler;
	
	
	function mousemove_handler (event) {
		var popup_window = $(this).jquery_attr ("popup");
		position_popup (event, popup_window);
	}// mousemove_handler;
	
	
	function mouseout_handler (event) {
		var popup_window = $(this).jquery_attr ("popup");
		popup_window.disappear (function () {
			popup_window.css ({ zIndex: -1 });
		});
	}// mouseout_handler;
	
	
	control.mouseenter (mouseenter_handler);
	control.mousemove (mousemove_handler);
	control.mouseout (mouseout_handler);
		
});
