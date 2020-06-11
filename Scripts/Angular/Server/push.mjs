import mysql from "mysql";
//import webpush from "web-push/src/index.mjs"
import webpush from "web-push"


const user_handle = "chat_handle";


// TO DO: MAKE ROOM DYNAMIC - SET ROOM POPULATION LIMIT


export function push_broadcast (data, cookies, response) {


	const vapid_keys = {
		public_key: "BLNjHzcv5-IvNm3XobMKscOSpEaUo3BE2hZqx0RcIax44GbV3ccE4uV7In-5XnVZuXdWt8DtpZ4XnqKOvpDv5tg",
		private_key: "_pe8UpaKr5KdA2FurJOqUylL3uWYycpKGuRmadZrAUQ"
	}// vapid_keys;


	let output = null;


	function send_message (subscription, message) {
		let payload = {
			title: "Rex's Chatroom",
			body: message
		}// payload;

		webpush.setVapidDetails ("mailto:roger.main@rexthestrange.com", vapid_keys.public_key, vapid_keys.private_key);

		let push_promise = webpush.sendNotification (JSON.parse (subscription), Buffer.from (JSON.stringify (payload), "utf8")).catch ((except) => {
			console.log (except);
		});
	}// send_message;


	function broadcast_message (subscription, message) {

		let conn = mysql.createConnection ({
			host: "localhost",
			user: "root",
			password: "stranger",
			database: "chatroom"
		});

		conn.connect (function (error) {
			if (error) throw (error);
			conn.query (`
				select
					id as population_id,
					handle,
					subscription
				from 
					populations 
				where
					room = 'chatbox';
			`, (error, records) => {
				if (error) throw (error);
				for (let subscriber of records) {
					send_message (subscriber.subscription, "[" + cookies [user_handle] + "] " + message);
				}// for;
			});
		});

	}// broadcast_message;


	switch (data.option) {
		case "broadcast": broadcast_message (data.subscription, data.message); break;
	}// switch;


	response.end ();


}// push_broadcast;
