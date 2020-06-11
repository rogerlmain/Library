class content_cell extends HTMLElement {
	
	connectedCallback () {
		
		$(this).css ({
			opacity: 0,
			width: 0,
			height: 0
		});
		
	}// connectedCallback;
	
	
	load (contents) {

		$(this).html (contents);
		
	}// load;
	
}// content_cell;


customElements.define ("content-cell", content_cell);
