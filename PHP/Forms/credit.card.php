<?php $prefix = isset ($id) ? "{$id}_" : null ?>


<script>

	initialize ("div.image-textfield", function () {
		this.children ("input").dom_object.addEventListener ("keyup", function (event) {
			let issuer = new credit_card ($(this).value).issuer;
			$("div.image-textfield img").each (function (index, item) {
				let control = $(item);
				if (control.name == issuer) {
					control.remove_style ("display", "none");
					return true;
				}// if;
				control.css ("display", "none");
			});
		});
	});

</script>


<style>

	div.image-textfield {
		display: grid;
		grid-template-columns: [textfield] 1fr [imagecell] min-content;
	}/* div.image-textfield */

	div.image-textfield img {
		margin: 0 0 0 0.2em;
		height: 2.4em;
		width: auto;
	}/* div.image-textfield img */
	
	div.credit-card-form {
		display: grid;
		grid-template-columns: [label] min-content [field] min-content;
		align-items: center;
	}/* div.credit-card-form */


	div.credit-card-form {
		display: grid;
		grid-template-columns: [label] min-content [field] min-content;
		align-items: center;
	}/* div.credit-card-form */


	div.credit-card-form div.date-subform {
		display: grid;
		grid-template-columns: repeat(3, [label] min-content [field] min-content);
		align-items: center;
	}/* div.credit-card-form div.date-subform */


	div.credit-card-form div.date-subform label:not(:first-child) {
		margin-left: 0.5em;
	}/* div.credit-card-form div.date-subform label:not(:first-child) */


	div.credit-card-form div.date-subform label.sublabel {
		font-size: 10pt;
		font-style: italic;
	}/* div.credit-card-form div.date-subform */


	div.credit-card-form div.date-subform input[type=numeric] {
		width: 4em;
	}/* div.credit-card-form div.date-subform input[type=numeric] */

</style>


<div <?=$this->tag_attribute ("id", $id)?> class="one-column-form credit-card-form" name="credit_card" onserialize="return $(this).mash_encoded;">

	<label for="<?=$prefix?>card_number">Card number</label>
	<div class="image-textfield">
		<input type="text" id="<?=$prefix?>card_number" name="card_number" maxlength="20" />
		<img src="<?=common::root_url ("Images/Library/Credit Cards/visa.png")?>" name="visa" class="credit-card-image" style="display: none" />
		<img src="<?=common::root_url ("Images/Library/Credit Cards/mastercard.png")?>" name="mastercard" class="credit-card-image" style="display: none" />
		<img src="<?=common::root_url ("Images/Library/Credit Cards/amex.png")?>" name="amex" class="credit-card-image" style="display: none" />
		<img src="<?=common::root_url ("Images/Library/Credit Cards/discover.png")?>" name="discover" class="credit-card-image" style="display: none" />	
	</div>
	
	<label>Expiration date</label>
	<div class="date-subform">
		<label for="<?=$prefix?>exp_month" class="sublabel">month</label>
		<select id="<?=$prefix?>exp_month" name="exp_month"><?=$this->month_select_list ()?></select>
		<label for="<?=$prefix?>exp_year" class="sublabel">year</label>
		<input type="numeric" id="<?=$prefix?>exp_year" name="exp_year" maxlength="4" VALUE="2021" />
		<label for="<?=$prefix?>cvv">CVV</label>
		<input type="numeric" id="<?=$prefix?>cvv" name="cvv" maxlength="4" VALUE="321" />
	</div>
	
</div>

