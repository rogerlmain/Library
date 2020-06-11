<?php 


require_once ("base.php");


class page extends base {
	
	
	public function image_upload ($parameters) {
		return $this->load_control ("Library/Controls/image.upload.php", $parameters);
	}// image_upload;
	
	
	public function file_upload ($parameters) {
		return $this->load_control ("Library/Controls/file.upload.php", $parameters);
	}// file_upload;
	
	
	public function chatbox ($parameters) {
		return $this->load_control ("Library/Controls/chatbox.php", $parameters);
	}// chatbox;
	
	
}// page;	