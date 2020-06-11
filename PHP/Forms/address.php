<?php

	require_once (common::root_path ("Classes/site.php"));
	
	if (!isset ($address)) $address = new stdClass ();
	if (!isset ($country_id)) $country_id = site::default_country_id;
	if (!isset ($state_id)) $state_id = site::default_state_id;
	if (!isset ($eyecandy)) $eyecandy = "(loading...)";

	$id = isset ($id) ? $id . underscore : null;
	$eyecandy = "<div class='eyecandy'>{$eyecandy}</div>"
	
?>


<style>

	div.address-form {
		display: contents;
	}/* div.address-form */
	
	
	div.address-form div.eyecandy {
		display: none;
	}/* div.address-form div.eyecandy */
	
	
	div.address-form div.state-list {
		display: flex;
		align-self: center;
	}/* div.address-form div.state-list */ 


	div.address-form div.country-list {
		display: flex;
	}/* div.address-form div.country-list */ 


	div.address-form div.country-list select {
		flex: auto;
	}/* div.address-form div.country-list select */
	
</style>


<script type="text/javascript">


	jQuery.fn.extend ({

		replace_control: function () {

			let parameters = Array.from (arguments);
			let oncomplete = (is_function (parameters.last_item) ? parameters.pop () : null);
			let source = (parameters.length == 2) ? parameters [0] : this;
			let destination = (parameters == 2) ? parameters [1] : parameters [0];
			let container = source.parent ().freeze ();
						
			source.disappear (() => {
				container.resize (destination.dimensions, function () {
					source.parent ().html (destination);
					destination.appear (oncomplete);
				});
			});

		}/* replace_control */

	});

			


	function change_country (state_cell) {

		let self = this;
		let form = $(this).ancestor ("div.address-form");
		let eyecandy = form.descendants ("div.eyecandy").clone ();
		let state_field = state_cell.children ("select");

 		state_field.replace_control (eyecandy, function () {

 			jQuery.ajax ({
 	 			data: { 
	 	 			action: "reference",
	 	 			option: "states",
	 	 			country_id: self.options [self.selectedIndex].value
 				}/* data */, 
 	 			success: function (response) {
 	 				state_field.html (response);
					eyecandy.replace_control (state_field);
 	 			}/* success */
 	 		});

 		});

	}// change_country;

</script>


<div id="<?=$id?>address_form" class="address-form">

	<?=$eyecandy?>
	
	<label for="street">Street Address</label>
	<input type="text" id="street" name="street" <?=$this->field_value ($address, "street")?> required="true" />
	
	<label for="additional"></label>
	<input type="text" id="additional" name="additional" <?=$this->field_value ($address, "additional")?> />
	
	<label for="city">City</label>
	
	<div class="row-table">
		<input type="text" id="city" name="city" <?=$this->field_value ($address, "city")?> required="true" />
		
		<label for="state">State</label>
		<div class="state-list">
			<select id="state" name="state_id" required="true">
				<?=$this->state_list ($country_id, $state_id)?>
			</select>
		</div>
		
		<label for="zip">Zip / Postal Code</label>
		<input type="text" id="zip" name="zip" <?=$this->field_value ($address, "zip")?>" required="true" />
	</div>
	
	<label for="country">Country</label>
	<div class="country-list">
		<select id="country" name="country_id" onchange="change_country.call (this, $(this).ancestor ('div.address-form').descendant ('div.state-list'));" required="true">
			<?=$this->country_list ($country_id)?>
		</select>
	</div>
	
</div>


