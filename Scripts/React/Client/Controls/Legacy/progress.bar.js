class progress_bar extends HTMLElement {
	
	
	constructor () {
		
		super ();
		
		
		this.setup_loops = function () {
			
			let loop_count = ((parse_integer (this.getAttribute ("length")) || 3) * 2) - 1;
			let loop_value = parse_integer (this.getAttribute ("value")) || 0;
			
			$(this).addClass ("loop-progress-bar").dom_object.add_style ({
				display: "flex",
				flexDirection: "row",
				alignItems: "center"
			});
			
			for (let index = 1; index <= loop_count; index++) {
				
				let next_item = $("<div />");
				let loop_index = parseInt (index / 2) + 1;
				
				if (index % 2 == 0) {
					$("<hr />").appendTo ($(this)); 
					continue;
				}// if;
					
				if (loop_index <= loop_value) next_item.addClass ("completed"); 

				next_item.addClass ("loop").appendTo ($(this));
				
			}// for;
			
		}// setup_loops;
		

		if (this.getAttribute ("type").matches ("loops")) this.setup_loops ();
		

	}// constructor;
	
	
	/********/
	
	
}// progress_bar;


customElements.define ("progress-bar", progress_bar);
