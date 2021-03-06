(function($) {

	$.fn.tagit = function(options) {
		
		var originalInput = this;
		originalInput.hide()
		originalInput.after('<ul></ul>');
		var el = originalInput.next('ul');
		
		const BACKSPACE		= 8;
		const ENTER			= 13;
		const COMMA			= 44;

		// add the tagit CSS class.
		el.addClass("tagit");

		// create the input field.
		var html_input_field = "<li class=\"tagit-new\"><input class=\"tagit-input form-text\" type=\"text\" /></li>\n";
		el.html (html_input_field);

		tag_input = el.children(".tagit-new").children(".tagit-input");

		var existingValues = originalInput.val();
		if (existingValues) {
			$.each(existingValues.split(','), function (k,v) {
				create_choice(v);
			});
		}

		el.click(function(e){
			if (e.target.tagName == 'A') {
				// Removes a tag when the little 'x' is clicked.
				// Event is binded to the UL, otherwise a new tag (LI > A) wouldn't have this event attached to it.
				$(e.target).parent().remove();
				rebuild_originalInput ();
			}
			// Sets the focus() to the input field, if the user clicks anywhere inside the UL.
			// This is needed because the input field needs to be of a small size.
			tag_input.focus();
		});

		tag_input.keypress(function(event){
			if (event.which == BACKSPACE) {
				if (tag_input.val() == "") {
					// When backspace is pressed, the last tag is deleted.
					$(el).children(".tagit-choice:last").remove();
				}
			}
			// Comma or Enter are valid delimiters for new tags.
			else if (event.which == COMMA || event.which == ENTER) {
				event.preventDefault();

				var typed = tag_input.val();
				typed = typed.replace(/,+$/,"");
				typed = jQuery.trim(typed);

				if (typed != "") {
					if (is_new (typed)) {
						create_choice (typed);
					}
					// Cleaning the input.
					tag_input.val("");
					rebuild_originalInput ();
					tag_input.focus();
				}
			}
		});

//		tag_input.autocomplete({
//			source: options.availableTags, 
//			select: function(event,ui){
//				if (is_new (ui.item.value)) {
//					create_choice (ui.item.value);
//				}
//				// Cleaning the input.
//				tag_input.val("");
//
//				// Preventing the tag input to be update with the chosen value.
//				return false;
//			}
//		});

		function is_new (value){
			var is_new = true;
			this.tag_input.parents("ul").children(".tagit-choice").each(function(i){
				n = $(this).children("input").val();
				if (value == n) {
					is_new = false;
				}
			})
			return is_new;
		}
		function create_choice (value){
			var el = "";
			el  = "<li data-value=\""+value+"\" class=\"tagit-choice\">\n";
			el += value + "\n";
			el += "<a class=\"close\">x</a>\n";
			el += "<input type=\"hidden\" style=\"display:none;\" value=\""+value+"\" name=\"item[tags][]\">\n";
			el += "</li>\n";
			var li_search_tags = this.tag_input.parent();
			$(el).insertBefore (li_search_tags);
			this.tag_input.val("");
		}
		function rebuild_originalInput () {
			var inputData = '';
			el.find('.tagit-choice').each(function (i) {
				if (i === 0) {
					inputData = $(this).attr('data-value');
				} else {
					inputData = inputData +','+ $(this).attr('data-value');
				}
			});
			originalInput.val(inputData).trigger('change')
		}
	};

})(jQuery);