/*

	dynamic_list - usage:
	
		<dynamic-list [button-text]>		-> Optional - button text
			<dynamic-list-form>				-> Optional - root elements will be added to a list-form if it does not exist
				[...html elements...]		-> HTML code for the form
			</dynamic-list-form>
			<dynamic-list-model>
				[...html elements {field=[dynamic-list-form element.name]}...]		-> HTML code for each line item - "field" attribute correlates to 
																					-> dynamic-list-form input element (name || id)
			</dynamic-list-model>
		</dynamic-list>
		
	Creates:
	
		<dynamic-list-rows>
			<dynamic-list-row>
				[...dynamic-list-model(s)...]
				<hidden name="[ID]_values" value="base64_encode (json_encode ([FORM_VALUES]), true)" />	-> Hidden field for each line item with trimmed, base64, json_encoded FormData object
			</dynamic-list-row>
		</dynamic-list-rows>


*/


class dynamic_list extends HTMLElement {
	
	
	add_controls () {
		this.button = $("<button />").html ($(this).attr ("button-text") || "New").appendTo (this).dom_object.addEventListener ("click", this.add_row);
	}//  add_controls;/

	
	connectedCallback () {
		
		let control = $(this);
		
		this.model = null;
		this.button = null;
		this.list = null;
		
	}// connectedCallback;
	
	
	constructor () {
		
		super ();
		
		
		this.unique = (field) => {
			let result = true;
			if (not_set (this.list) || not_set (field.attr ("unique"))) return true;
			$(this).descendants ("hidden").each ((index, item) => {
				let values = json_decode (base64_decode ($(item).attr ("value")));
				if (values [field.name].matches (field.value)) return result = false;
			});
			return result;
		}// this.unique;
		
		
		this.add_row = () => {
			
			let row = recast (this.model, "dynamic-list-row").css ("display", "contents");
			let valid_row = true;
			
			let row_values = this.form.serialize_values ().values;

			row.append ($("<input />").attr ({
				type: "hidden",
				name: ($(this).id || $(this).name || this.signature.replace (/[^a-zA-Z]/g, underscore).toLowerCase ()) + "_values",
				value: base64_encode (json_encode (row_values), true)
			}).css ("display", "none"));
			
			for (let field_name in row_values) {
				
				if (!row_values.hasOwnProperty (field_name)) continue;
				
				let value = row_values [field_name];
				let input = this.form.descendants ("[name=" + field_name + "]");
				
				if (this.unique (input)) {
					row.descendants ("[field=" + field_name + "]").html (value);
					continue;
				}// if;
				
				valid_row = false;
				
			}// for;
			
			
			if (row.is ("[oncopy]")) new Function ("values", row.attr ("oncopy")).call (row, row_values);
				
			
			if (valid_row) {
				
				let dimensions = null;
				
				if (is_null (this.list)) this.list = $("<dynamic-list-rows />").appendTo (this);
				
				this.list.css ("overflow", "hidden").freeze ().append (row.css ("visibility", "hidden"));
				
				dimensions = { 
					width: this.list.dom_object.scrollWidth - this.list.dom_object.offsetWidth,
					height: this.list.dom_object.scrollHeight - this.list.dom_object.offsetHeight 
				}// dimensions;
				
				row.remove_style ("visibility").remove ();
				
				this.list.thaw ().insert_item ({
					item: row, 
					dimensions: dimensions
				});

			}// if;
			
			return false;
				
		}// this.add_row;
		
	}// constructor;
	
	
}// dynamic_list;


/********/


class dynamic_list_model extends HTMLElement {
	
	connectedCallback () {
		$(this).css ("display", "none");
	}// connectedCallback;
	
}// dynamic_list_model;


class dynamic_list_row extends HTMLElement {
	
	remove () {
		
		let control = $(this);
		
		control.children ().fade_out (() => {
			control.addClass ("flex-row").remove_style ("display", "contents").freeze ().animate ({ height: 0 }, { complete: () => {
				control.remove ();
			} });
		});
		
	}// remove;
	
}// dynamic_list_row;


/********/


initialize ("dynamic-list > *", function () {
	
	let control = this.parent ().dom_object;
	
	if (this.is ("div.insert-panel")) return;
	if (this.is ("dynamic-list-model")) return control.model = this;
	
	for (let property in control) {
		if (!control.hasOwnProperty (property)) continue;
		if (!is_jquery (control [property])) continue;
		if (control [property].dom_object === this.dom_object) return;
	}// for;
	
	if (this.is ("dynamic-list-form")) {
		control.add_controls ();
		if (isset (control.form)) {
			control.form.append (this.children ());
			return this.remove ();
		}// if;
		control.form = this;
		return;
	}// if;
		
	if (is_null (control.form)) {
		control.form = $("<dynamic-list-form />").appendTo (control);
		control.add_controls ();
	}// if;

 	control.form.append (this);
 	
});


initialize ("dynamic-list-form *:input", function () { if (not_set (this.name)) this.name = this.name || this.id; });


customElements.define ("dynamic-list", dynamic_list);
customElements.define ("dynamic-list-row", dynamic_list_row);

customElements.define ("dynamic-list-form", class dynamic_list_form extends HTMLElement {});
customElements.define ("dynamic-list-rows", class dynamic_list_rows extends HTMLElement {});

customElements.define ("dynamic-list-model", dynamic_list_model);




