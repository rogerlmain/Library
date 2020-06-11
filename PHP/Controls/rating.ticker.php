<?php

	require_once (common::root_path ("Library/Classes/page.php"));
	require_once (common::root_path ("Library/Controls/Models/rating.ticker.php"));
	
	
	$ticker = new rating_ticker ((Object) array (
		"color" => isset ($color) ? $color : null,
		"highlight" => isset ($highlight) ? $highlight : null,
		"click" => isset ($click) ? $click : null
	));

?>


<style>

	div[class$=pointer] { 
		border: solid 0.25em transparent; 
		width: 0;
		height: 0;
	}/* div[class$=pointer] */ 
	
	div.up-pointer {
		border-width: 0 0.25em 0.5em 0.25em;
		border-bottom-color: black;
	}/* div.up-pointer */ 

	div.down-pointer {
		border-width: 0.5em 0.25em 0 0.25em;
		border-top-color: black;
	}/* div.down-pointer */
	
	div.ticker > div {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}/* div.ticker > div */
	
</style>


<div class="ticker">
	<div><div class="up-pointer" <?=$ticker->attribute_list ("up")?>></div></div>
	<div class="number-cell"><?=$rating?></div>
	<div><div class="down-pointer" <?=$ticker->attribute_list ("down")?>></div></div>
</div>