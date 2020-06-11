const server_key = "BLNjHzcv5-IvNm3XobMKscOSpEaUo3BE2hZqx0RcIax44GbV3ccE4uV7In-5XnVZuXdWt8DtpZ4XnqKOvpDv5tg";
	

const firebaseConfig = {
	apiKey: "AIzaSyDagrF-R213t6TuDFCu2mKsb1cBxRKCxAY",
	authDomain: "rexs-chatroom.firebaseapp.com",
	databaseURL: "https://rexs-chatroom.firebaseio.com",
	projectId: "rexs-chatroom",
	storageBucket: "rexs-chatroom.appspot.com",
	messagingSenderId: "415730163769",
	appId: "1:415730163769:web:39f2ceb67c468e09"
};


export default class PushNotifier { 


 	constructor (service_file = "/service.js") {

		
// 		let service_worker = null;
// 		let permission = null;


		this.decoded_token = (base64String) => {
			const padding = '='.repeat ((4 - base64String.length % 4) % 4);
			const base64 = (base64String + padding).replace (/\-/g, '+').replace (/_/g, '/');
			const raw_data = window.atob (base64);
			const output = new Uint8Array (raw_data.length);
			for (let i = 0; i < raw_data.length; ++i) {
				output [i] = raw_data.charCodeAt (i);
			}// for;
			return output;
		}// decoded_token;

	
		this.get_token = (command) => {

			this.process_token (function (subscription) {

alert (subscription);

				if (is_function (command)) command (json_encode (subscription));
			});

		}// get_token;


		this.process_token = async (command) => {

			return navigator.serviceWorker.ready.then ((registration) => {

alert ("service worker ready: " + registration);				

				registration.pushManager.subscribe ({ 
					userVisibleOnly: true, 
					applicationServerKey: this.decoded_token (server_key)
				}).then (function (subscription) {

alert ("subscription complete")

					command (subscription);
				});
				
			});

		}// process_token;


		this.register_service_worker = async () => {
			let registration = await navigator.serviceWorker.register (service_file);
			return registration;
		}// register_service_worker;
	
			
		this.request_permission = async () => {
			let permission = await window.Notification.requestPermission ();
			if (permission !== "granted") throw new Error ("Permission not granted for Notification");
		}// request_permission;


	}// constructor;



// 	/********/
	
	
// 	this.register_notification = function (service_script) {
		
// 		window.Notification.requestPermission (async function (permission) {
			
// 			if (permission.equals ("granted")) service_worker = await navigator.serviceWorker.register (service_script).then (function (service_worker) {
				
// 				service_worker.pushManager.getSubscription ().then (function (subscription) {
					
// 					if (is_null (subscription)) service_worker.pushManager.subscribe ({
// 						userVisibleOnly: true,
// 						applicationServerKey: decoded_token (server_key)
// 					});
						
// 				});
				
// 			});
			
// 		});
		
// 	}// register_notification;
	
	
// 	this.save_subscription = function () {
		
// 		process_token (function (subscription) {
			
// 			jQuery.ajax ({
						
// 				data: { 
// 					action: "push",
// 					option: "save",
// 					value: json_encode (subscription)
// 				}/* data */,
				
// 				success: function (response) {
// 					alert (response.trim ());
// 				}/* success */
				
// 			});
		
// 		});
		
// 	}// save_subscription;
	
	
	broadcast = async (message) => {
		
		this.process_token ((subscription) => {


alert ("token processed");


			fetch (blank, {

				method: "post",

				data: {
					action: "push",
					option: "broadcast",
					message: message,
					token: json_encode (subscription)
				}/* data */,

			}).then (response => {

				alert (response);
				
			});
			
		});

	}// broadcast;
	
	
	register = async (onregister) => {

		if (!this.available) throw "Chatroom service not available";

		await this.register_service_worker ();
		await this.request_permission ();

alert ("paused");		

		this.get_token (function (token) {

alert (token);

			if (is_function (onregister)) onregister (token);
		});

	}// register;


}// PushNotifier;


Object.defineProperties (PushNotifier.prototype, {

	available: { get: function () { return (("serviceWorker" in navigator) && ("PushManager" in window)); } }

});

