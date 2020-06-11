export default class Cookie {


	constructor () {

		this.get_cookies = function () {

			let result = null;

			if (not_set (this.request_cookie.cookie)) return result;

			for (let cookie of this.request_cookie.cookie.split (";")) {
				let parts = cookie.trim ().split ("=");
				if (parts.length < 2) continue;
				if (is_null (result)) result = {}
				result [parts [0]] = json_decode (parts [1]);
			}// for;

			return result;

		}// get_cookies;

		this.request_cookie = (serverside ? server.request.headers : document);
		this.response_cookie = (serverside ? server.response : document);

 		this.cookie_data = this.get_cookies ();

	}// constructor;


	get_cookie (name) { 
		return isset (this.cookie_data) ? this.cookie_data [name] : null;
	}// get_cookie;


	set_cookie (name, value, duration = null) {

		let expiry_date = (isset (duration) ? `expires=${new Date ().add_days (duration).toUTCString ()}` : blank);
		let cookie_value = `${name}=${value}; path="/"; ${expiry_date}`;

		if (is_null (this.response_cookie)) throw "No value passed to cookie_object in cookie.mjs";

		switch (serverside) {
			case true: this.response_cookie.setHeader ("set-cookie", cookie_value); break;
			default: this.response_cookie.cookie = cookie_value; break;
		}// switch;

		if (not_set (this.cookie_data)) this.cookie_data = {};
		this.cookie_data [name] = value;

	}// set_cookie;


	get_value (cookie_name, field_name) { 
		let cookie = this.get_cookie (cookie_name); 
		return class_value (cookie, field_name);
	}// get_cookie;


	set_value () { 
		return this.set_cookie.apply (this, Array.from (arguments)); 
	}// set_value;


}// Cookie;


