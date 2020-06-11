<style>

	div.button-control {
		display: inline-flex;
		position: relative;	
	}/* div.button-control */
	

	div.button-control input {
		position: absolute;
	}/* div.button-control input */
	
	
	div.button-control * {
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}/* div.button-control input */

</style>


<div class="button-control">
	<button>Upload Image</button>
	<input type="file" 
		<?=isset ($name) ? $name : null?> 
		<?=isset ($multiple) ? $multiple : null?> 
		<?=isset ($onselect) ? $onselect : null?> 
	/>
</div>
