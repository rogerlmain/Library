import "Scripts/Library/Common/globals.mjs";
import "Scripts/Library/Common/common.mjs";


export default class Base {


	constructor (parameters) {


		this.root_path = function (filename) {
			if (serverside) return (process.cwd () + "\\" + filename.trim ("/").trim ("\\")).replace (/\\/g, "/");
			return filename;
		}// root_path;


		this.write = function () {
			switch (serverside) {
				case true: this.response.write (Array.from (arguments).join (space)); break;
				default: alert (Array.from (arguments).join (space)); break;
			}// switch;
		}// write;


		// Parameters: [string] ... [n], [webpage output (boolean: optional - default true)]

		this.writeln = function () {

			let short_length = arguments.length - 1;
			let last_argument = arguments [short_length];
			let eol = (last_argument !== false) ? "<br />" : "\n";
			let output = is_boolean (last_argument) ? Array.from (arguments).slice (0, short_length).join (eol) : Array.from (arguments).join (eol);

			this.write (output + eol);

		}// writeln;


	}// constructor;


}// base;


