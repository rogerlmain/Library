<?php


	require_once ("base.php");
	require_once (common::root_path ("Library/Third Party/PHPMailer/PHPMailer.php"));
	require_once (common::root_path ("Library/Third Party/PHPMailer/SMTP.php"));
	require_once (common::root_path ("Library/Third Party/PHPMailer/Exception.php"));
	
	
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;
	
	
	class email extends base {
		
		
		private const default_server = array (
			"host" => "mail.rexthestrange.com",
			"port" => 587,
			"username" => "mail@rexthestrange.com",
			"password" => "strange1",
			"sender_name" => "Rex's Mail System"
		)/* default_server */;
		
		
		private $host = null;
		private $template = null;
		private $username = null;
		private $password = null;
		private $sendername = null;
		
		
		private function load_template ($template_name, $template_data) {
			if (!file_exists (common::root_path ($template_name))) throw new Exception ("Email template file does not exist.");
			$template = $this->load_control ($template_name);
			if (is_object ($template_data)) foreach ($template_data as $name => $value) {
				$template = str_replace ("{{{$name}}}", $value, $template);
			}// foreach;
			return $template;
		}// load_template;
		
		
		private function send_mail ($recipients, $subject, $message) {
			$mail = new PHPMailer ();
			
			$mail->Host = $this->host;
			$mail->Port = $this->port;
			
			$mail->Username = $this->username;                
			$mail->Password = $this->password;
			
			$mail->From = $this->username;
			$mail->FromName = $this->sendername;
			
			foreach ($recipients as $name => $address) {
				$mail->AddAddress ($address, $name);
			}// foreach;
			
			$mail->IsHTML(true);                                  
			
			$mail->Subject = $subject;
			$mail->Body    = $message;

			$mail->IsSMTP ();
			$mail->SMTPAuth = true;
			$mail->SMTPSecure = "tls";
			
			$mail->SMTPDebug = false;			
			
			try {
				$mail->Send ();
			} catch (Exception $except) {
				record_error ($except);
				return false;
			}// try;
			
			return true;
			
		}// send_mail;
		
		
		/********/
		
		
		public function send ($options) {
			
			$recipients = isset ($options->recipients) ? $options->recipients : $option->recipient;
			
			$subject = isset ($options->subject) ? $options->subject : "Email from " . common::root_url (null);
			$message = isset ($options->template) ? $this->load_template ($options->template, $options->data) : null;

			if (is_null ($recipients)) throw new Exception ("Email sent with no recipients specified.");
			if (is_null ($message)) throw new Exception ("Email sent with no template specified.");
			
			if (is_string ($recipients)) $recipients = array ($recipients);
			
			$success = $this->send_mail ($recipients, $subject, $message);
			
			if (!$success) record_error (error_get_last () ["message"]);
			
		}// send;
		
		
		/**** Constructor ****/
		
		
		public function __construct ($connection_data = null) {
			$this->host = property_value ($connection_data, "host") ?? self::default_server ["host"];
			$this->port = property_value ($connection_data, "port") ?? self::default_server ["port"];
			$this->username = property_value ($connection_data, "username") ?? self::default_server ["username"];
			$this->password = property_value ($connection_data, "password") ?? self::default_server ["password"];
			$this->sender_name = property_value ($connection_data, "sender_name") ?? self::default_server ["sender_name"];
		}// constructor;
		
		
		/********/
		
		
	}// email;
	
	
