<style>

	div.image-upload {
		display: inline-flex;
		position: relative;	
	}/* div.image-upload */
	

	div.image-upload input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
	}/* div.image-upload input */
	
	
	div.image-upload * {
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}/* div.image-upload input */

</style>


<div class="image-upload">
	<img <?=tag_attribute ("src", $image)?> class="upload-image <?=isset ($class) ? $class : null?>" />
	<input type="file" onchange="preview_image (this, $(this).siblings ('img'));"
		<?=isset ($name) ? "name='{$name}'" : null?> 
		<?=(isset ($multiple) and ($multiple === true)) ? "multiple" : null?> 
	/>
</div>
