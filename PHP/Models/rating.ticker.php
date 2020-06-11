<?php 


class rating_ticker extends page {
	
	
	private $attributes = null;
	

	public function attribute_list ($direction) {
		
		$result = array ();
		$styles = array ();
		
		$color_style = ($direction == "up") ? "border-bottom-color" : "border-top-color";
		
		if (not_set ($this->attributes)) return null;
		
		if (isset ($this->attributes->color)) array_push ($styles, "{$color_style}: {$this->attributes->color}");
		
		$mouseover_attribute = isset ($this->attributes->highlight) ? "$(this).css ({$this->quoted ($color_style)}, {$this->quoted ($this->attributes->highlight)});" : null;
		$mouseout_attribute = isset ($this->attributes->highlight) ? (isset ($this->attributes->color) ? "$(this).css ({$this->quoted ($color_style)}, {$this->quoted ($this->attributes->color)});" : "$(this).remove_style ({$this->quoted ($color_style)});") : null;
		$mouseclick_attribute = isset ($this->attributes->click) ? str_replace ("{{direction}}", $this->quoted ($direction, false), $this->attributes->click) : null;
		
		$mouseover = isset ($mouseover_attribute) ? "onmouseover='{$mouseover_attribute}'" : blank;
		$mouseout = isset ($mouseout_attribute) ? "onmouseout='{$mouseout_attribute}'" : blank;
		
		$style_list = "style='" . implode ("; ", $styles) . "'";
		$click = isset ($mouseclick_attribute) ? "onclick={$this->quoted ($mouseclick_attribute)}" : blank;
		
		return trim ("{$mouseover} {$mouseout} {$style_list} {$click}");
		
	}// attribute_list;
	
	
	/**** Constructor ****/
	
	
	public function __construct ($attributes) {
		$this->attributes = $attributes;
	}// constructor;
	
	
}// rating_ticker;


