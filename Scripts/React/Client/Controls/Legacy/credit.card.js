const issuer_ids = {
	"visa": 		[4],
	"mastercard":	[[2221, 2720], [51, 55]],
	"amex" :		[34, 37],
	"discover" :	[64, 65, 6011, 
						[622126, 622925], 
						[624000, 626999], 
						[628200, 628899]
					]
}/* issuer_ids */;


class credit_card {


	get issuer () { return this.get_issuer (); }
	
	
	/**** Constructor ****/
	
	
	constructor (card_number) {
		
		this.card_number = card_number;


		this.card_prefixed = function (number, values) {
			for (let value of values) {
				switch (is_array (value)) {
					case true: if (this.in_range (number, value)) return true; break;
					default: if (this.prefixed (number, value)) return true; break;
				}// switch;
			}// foreach;
			return false;
		}// card_prefixed;

		
		this.get_issuer = function () {
			let number = stripped_number (this.card_number);
			for (let id in issuer_ids) {
				if (!issuer_ids.hasOwnProperty (id)) continue;
				if (this.card_prefixed (number, issuer_ids [id])) return id;
			}// foreach;
			return "unknown";
		}// issuer;
		
		
		this.prefixed = function (number, value) {
			let result = (number.toString ().indexOf (value.toString ()) == 0);
			return result;
		}// prefixed;
		
		
		this.in_range = function (number, range) {
			for (let index = range [0]; index <= range [1]; index++) {
				if (this.prefixed (number, index)) return true;
			}// foreach;
			return false;
		}// in_range;
		
		
	}// constructor;
	
	
	/********/
	
}// credit_card;
	
