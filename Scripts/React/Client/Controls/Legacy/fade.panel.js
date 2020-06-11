class fade_panel extends HTMLElement {
	
	
	fade_in () {
		$(this).fade_in ();
	}// fade_in;
	
	
	fade_out () {
		$(this).fade_out ();
	}// fade_out;
	
	
	connectedCallback () {
		$(this).css ("opacity", 0);
	}// connectedCallback;
	
}// fade_panel;


customElements.define ("fade-panel", fade_panel);

