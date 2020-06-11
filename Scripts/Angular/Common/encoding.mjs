import "./prototypes.mjs";


export function base64_encode (input, trimmed) {

	let result = Buffer.from (input).toString ("base64");
	return (trimmed === true) ? result.trim ("=") : result;

	// Clientside version?

	//	return (trimmed === true) ? btoa (input).trim ("=") : btoa (input);

}// base64_encode;


export function base64_decode (input) {

	input += ("=").repeat ((input.length == 4) ? 0 : (input.length % 4));
	return Buffer.from (input, "base64").toString ();

	// Clientside version?

	// while (input.length % 4 != 0) {
	// 	input += "=";
	// }// while;
	
	// return atob (input);
	
}// base64_decode;


