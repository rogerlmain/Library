// MutationObserver initializer 


function initialize (selector, handler) {


	function run_initializers (node) {

		if (node instanceof Text) return;

		for (let selector in document.initializers) {
			
			let nodes = null;
			let control = $(node);

			if (!document.initializers.hasOwnProperty (selector) || is_null (nodes = (is_function (control.family) ? control.family (selector) : null))) continue;

			nodes.each (function (index, item) {
				
				let next_node = $(item);
				
				if (isset (item.initialized) && (item.initialized.indexOf (selector) > -1)) return;
				
				if (is_function (document.initializers [selector])) {
					
					document.initializers [selector].call (next_node);
					
					if (not_set (item.initialized)) item.initialized = new Array ();
					item.initialized.push (selector);
					
				}// if;
							
			})/* each */;

		}// for;
		
	}// run_initilisers;
				

	function mutation_handler (mutations) {
		
		for (let mutation of mutations) {
			if (not_set (mutation.addedNodes)) continue;
			for (let node of mutation.addedNodes) {
				run_initializers (node);			
			}// for;
		}// for;

	}// mutation_handler;
			

	if (not_set (document.initializers)) document.initializers = {}
	
	if (not_set (document.initializer)) {
		document.initializer = new MutationObserver (mutation_handler);
		document.initializer.observe (document, {
			childList: true,
			subtree: true
		});
	}// if;
	 
	document.initializers [selector] = handler;

}// initialize;


/********/


document.addEventListener ("keydown", function (event) {
	
	let keycode = parseInt (event.keyCode || event.which);
	
	if (keycode == 27) $("[onescape], [onclickescape]").each (function (index, item) {
		run (item, "onescape");
		run (item, "onclickescape");
	});
	
})/* document.keydown */;


document.addEventListener ("click", function (event) {
	$("[onpageclick], [onclickescape]").each (function (index, item) {
		run (item, "onpageclick");
		run (item, "onclickescape");
	});
})/* document.click */;


/********/


window.addEventListener ("resize", function (event) {
	$("[onresize]").each (function (index, item) {
		let command = $(this).attr ("onresize");
		if (is_empty (command)) return;
		new Function  (command).call (this);
	});
})/* window.resize */;


window.addEventListener ("load", function (event) {
	window.dispatchEvent (new Event ("resize"));
})/* window.load */;


/********/


initialize ("[onload]", function () {
	
	let command = $(this).attr ("onload");
	
	if (new Array ("body", "iframe", "link", "style").contains ($(this).prop ("tagName"))) return;
	if (is_empty (command)) return;
	
	new Function  (command).call (this);
	
    return false;
    
});
    

initialize ("[onclick]", function () {
	this.dom_object.addEventListener ("click", function (event) {
		event.stopPropagation ();
	});
});


/********/


initialize ("input[type=numeric]", function () {
	this.dom_object.addEventListener ("keydown", function (event) {
	    if ((event.which < 32) || (event.which > 126)) return;
        if (!jQuery.isNumeric (String.fromCharCode (event.which))) event.preventDefault ();
	});
});


initialize ("form.ajax", function () {
	$(this).submit (function (event) { return false; });
	this.reset ();
});


