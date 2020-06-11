class menu_button extends HTMLElement {


	connectedCallback () {
		
		let control = $(this);
		
		this.menu_button = $("<button />").addClass ("menu-button").html (control.attr ("text")).css ("cursor", "pointer").appendTo (control);
		this.list = $("<fade-list />").attr ({
			speed: control.attr ("speed"),
			onclickescape: "this.fade_out ();"
		}).appendTo (control);
		
		this.list.css ({
			position: "absolute",
			top: this.menu_button.outerHeight (),
			left: 0
		});
		
		this.menu_button.dom_object.addEventListener ("click", function (event) {
			control.children ("fade-list").dom_object.run ();
			event.stopPropagation ();
		});
		
		control.css ({
			cursor: "pointer",
			position: "relative"
		});
		
	}// connectedCallback;
	
	
}// menu_button;


customElements.define ("menu-button", menu_button);


initialize ("menu-button > *", function () {
	
	let control = $(this);
	let list = $(control.parent ().dom_object.list);

	if (control.is ("title, fade-list, button.menu-button")) return;
	
	control.dom_object.addEventListener ("click", function () {
		list.dom_object.fade_out ();
	});
	
	list.append ($("<fade-item />").append (control));
	
});





