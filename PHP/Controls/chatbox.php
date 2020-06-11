<?php

	$load_handler = blank;
	
//	$signin_handler = "return new chatbox_control ('{$id}').register_handle ($(this).siblings ('input').value);";
$signin_handler = "alert ('yay'); return false;";
	
	
	if (!isset ($signin_button)) $signin_button = true;
	if (!isset ($signin_button_text)) $signin_button_text = "Enter";
	
	if (is_string ($signin_button)) $load_handler = "onload=" . common::quoted ("$('{$signin_button}').click (() => { {$signin_handler} });");
		
	if (($signin_button === false) or (is_string ($signin_button))) $signin_button = blank;
	if ($signin_button === true) $signin_button = "<button onclick=" . common::quoted ($signin_handler) . ">{$signin_button_text}</button>";
	
?>



<script type="text/javascript">


	function chatbox_control (id) {


		function register_worker () {
	 		navigator.serviceWorker.addEventListener ("message", (event) => {
				$("#" + id + " textarea").value += (new_line + event.data.message);
			});
		}// register_worker;


		/********/
			

		this.control = $("#" + id);
		this.chatbox = this.control.children ("div.chatbox");
		this.signup = this.control.children ("div.signup");
	
		this.register_handle = (handle) => {
	
			new push_notification ().register_notification ('service.js', handle, (subscription) => {
				
				jQuery.ajax ({
					data: {
						action: 'push',
						option: 'register',
						data: { 
							room: id,
							handle: handle,
							subscription: subscription 
						}/* data */,
						success: (response) => {
							this.register_worker ();
							this.show_chatbox ();
						}/* success */
					}/* data */
				});
			}); 
	
			return false;
			
		}// register_handle;


		this.show_chatbox = () => {
			this.chatbox.remove_style ("display");
			this.signup.css ("display", "none");
		}// show_chatbox;
		

		this.show_signup = () => {
			this.signup.remove_style ("display");
			this.chatbox.css ("display", "none");
		}// show_signup;


	}// chatbox_control;


	$(document).ready (() => {
		let chatbox = new chatbox_control ("<?=$id?>");
		new push_notification ().registered ? chatbox.show_chatbox () : chatbox.show_signup (); 
	});


	window.onunload = function (event) {
		alert ("bye bye");
	}// onbeforeunload;

	
</script>


<style>


	div.chatbox {
		display: inline-flex;
		flex-direction: column;
		border: solid 1px blue;
	}/* div.chatbox */


	div.chatbox textarea {
		width: 250px;
		height: 150px;		
	}/* div.chatbox textarea */


	div.chatbox input[type=text] {
		width: 100%;
	}/* div.chatbox input[type=text] */


	div.chatbox div.messagebox {
		display: flex;
	}/* div.chatbox div.messagebox */


</style>


<input type="hidden" name="room_number" value="resume_chat" />


<chatbox class="chatbox_control" id="<?=$id?>" <?=$load_handler?>>


	<div class="signup" <?php /*style="display: none"*/ ?>>
		<text><?=isset ($signin_text) ? $signin_text : "Name"?></text>
		<input type="text" value="Rex" />
		<?=$signin_button?>
	</div>
		
	<div class="chatbox" style="display: none">
	
		<textarea></textarea>
		
		<div class="messagebox">
			<input type="text" value="this is the input text" />
			<button onclick="new push_notification ().node_broadcast ($(this).siblings ('input[type=text]').value); return false;">Enter</button>
		</div> 
		
	</div>

</chatbox>

