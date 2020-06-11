<?php

	require_once (common::root_path ("Library/Classes/form.php"));

	$prefix = isset ($id) ? "{$id}_" : null;
	$required_text = ((isset ($required)) && ($required === true)) ? "required='true'" : null;
	if (!isset ($contact)) $contact = null;


	function debug_value ($field_name) {
		
		if (debugging) {
			
			switch ($field_name) {
				case "first_name"			: $debug_value = "Larry"; break;
				case "last_name"			: $debug_value = "Laffer"; break;
				case "screen_name"			: $debug_value = "Leisure Suit Larry"; break;
				case "email_address"		: $debug_value = "larry@rexthestrange.com"; break;
				case "phone"				: $debug_value = "654 765 8787"; break;
				case "password"				: $debug_value = "laurence"; break;
				case "confirm_password"		: $debug_value = "laurence"; break;
			}/* switch */
			
			if (isset ($debug_value)) return "value='{$debug_value}'";
			
		}// if;
		
		return null;
		
	}// debug_value;
	
	
?>


<link rel="stylesheet" href="<?=common::root_url ("Styles/Local/logging.css")?>" />


<style>

	div.contact-form {
		display: grid;
		grid-template-columns: [image] max-content [form] 1fr;
	}/* div.contact-form */

</style>


<div class="contact-form image-form">

	<?=(new form ())->image_upload (array (
		"image" => "Images/user.silhouette.png",
		"name" => "avatar"
	)); ?>
	
	<div class="two-column-form">

		<label for="<?=$prefix?>first_name">First Name</label>				
		<input type="text" id="<?=$prefix?>first_name" name="<?=$prefix?>first_name" <?=debug_value ("first_name")?> required="true" maxlength="45" minlength="2" />
		
		<label for="<?=$prefix?>last_name">Last Name</label>				
		<input type="text" id="<?=$prefix?>last_name" name="<?=$prefix?>last_name" <?=debug_value ("last_name")?> required="true" maxlength="45" />
		
		<label for="<?=$prefix?>screen_name">Screen Name</label>				
		<input type="text" id="<?=$prefix?>screen_name" name="<?=$prefix?>screen_name" <?=debug_value ("screen_name")?> maxlength="45" />
		
		<label for="<?=$prefix?>primary_phone">Primary phone</label>
		<input type="text" id="<?=$prefix?>_primary_phone" name="<?=$prefix?>primary_phone" <?=$this->field_value ($contact, "primary_phone")?> <?=debug_value ("phone")?> />
		
		<label for="<?=$prefix?>secondary_phone">Second phone (optional)</label>
		<input type="text" id="<?=$prefix?>_secondary_phone" name="<?=$prefix?>secondary_phone" <?=$this->field_value ($contact, "secondary_phone")?> />

		<label for="<?=$prefix?>email_address">Email Address</label>
		<input type="email" id="<?=$prefix?>email_address" name="<?=$prefix?>email_address" class="full-column-span" <?=debug_value ("email_address")?> required="true" maxlength="255" />
		
		<label for="<?=$prefix?>password">Password</label>
		<div class="password-cell">
			<input type="password" id="<?=$prefix?>password" name="<?=$prefix?>password" onblur="return compare_passwords ($(this));" <?=debug_value ("password")?> required="true" maxlength="64" minlength="8" />
			<img src="Images/eyeball.off.svg" class="password-eyeball" onclick="toggle_password ($(this).parent ());">
		</div>
		
		<label for="confirm_password">Confirm Password</label>
		<div class="password-cell">
			<input type="password" id="confirm_password" onblur="return compare_passwords ($(this));" <?=debug_value ("confirm_password")?> required="true" maxlength="64" minlength="8" />
			<img src="Images/eyeball.off.svg" class="password-eyeball" onclick="toggle_password ($(this).parent ());">
		</div>

		<?php if ($this->user->admin): ?>
		
			<input type="checkbox" id="administrator" name="administrator" />
			<label for="administrator">Administrator</label>
			
		<?php endif ?>

	</div>
	
</div>

