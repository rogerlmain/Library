Object.defineProperties (HTMLInputElement.prototype, {
	
	image_list: {
		
		get: function () {
			
			var result = null;
			var control = $(this);
			
			if (!control.is ("input[type=file]")) return null;
			
			for (var index in this.files) {
				
				var file = this.files [index];
				var reader = new FileReader ();
				
				if (!(file instanceof File)) continue;
				if (is_null (result)) result = new Array ();
				
				reader.image_control = $("<img />");
				result.push (reader.image_control);
				
				reader.onload = function (events) {
					this.image_control.attr ("src", events.target.result);
				}// add_image;
				
				reader.readAsDataURL (file);
				
			}// for;
			
			return result;
			
		}/* get */
		
	}/* image_list */
	
});


HTMLInputElement.prototype.load = function (target) {
	if (!$(this).is ("input[type=file]")) return;
	for (var index in this.image_list) {
		var image = this.image_list [index];
		if (!this.image_list.hasOwnProperty (index)) continue;
		target.append (image);
	}// for;
}// load;
