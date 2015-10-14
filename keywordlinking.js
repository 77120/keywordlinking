(function() {
	//Match Settings

	var skipcurlybraces = true,
		skipsquarebraces = true,
		casesensitive = false,
		
		/*Popover Settings*/
		/*if popover set to true, bootstrap css and js is required */
		enablepopover = true,
		popover_trigger = 'hover',
		popover_placement = 'right',
		popover_allow_html = true, // must be true if popover_allow_images is true
		popover_allow_images = true, // cant be true if popover_allow_html is false
		/*title mutation values capitaliseFirstLetter, capitaliseAll, none*/
		title_mutation_settings = 'capitaliseFirstLetter';
	
	// END SETTINGS
	
	// load a json file (this part could be generated from a database)
	var crosskeywords = 
		[
			{
				"crosslink_key":"example",
				"desc":"text or link",
				"image":"",
				"url":"#"
			},
			{
				"crosslink_key":"keywords",
				"desc":"description text",
				"image":"http://www.centos.org/images/logo_small.png",
				"url":"#"
			},
			{
				"crosslink_key":"link",
				"desc":"text popup",
				"image":"",
				"url":"#"
			},
			{
				"crosslink_key":"div",
				"desc":"is a block element",
				"image":"",
				"url":"http://en.wikipedia.org/wiki/Span_and_div"
			},
			{
				"crosslink_key":"span",
				"desc":"is inline",
				"image":"",
				"url":"http://en.wikipedia.org/wiki/Span_and_div"
			},
			{
				"crosslink_key":"html",
				"desc":"text <p>with html</p><img src='http://www.centos.org/images/logo_small.png'>",
				"image":"",
				"url":"http://en.wikipedia.org/wiki/Span_and_div"
			}
		];
	
	// Create Regex 
	var donotsearchintags = '(?![^<]*>)'; // do not look in html tags < ... >
	skipcurlybraces?donotsearchintags += '(?![^{]*})':'';  // do not look in curlybraces { ... } 
	skipsquarebraces?donotsearchintags += '(?![^\[]*\])':'';  // do not look in squarebraces [ ... ]
	/*var precharacters = '(?<![a-z])'; lookbehind not supported by javascript*/
	var precharacters = '(\\b|[^a-zA-Z])'; // instead of lookbehind (\b is needed if match is not preceded by anything aka: first word in div)
	var postcharacters = '(?![a-zA-Z])'; // the match canot be followed by any letter, but can by anything else (even - _) 
	
	// creates a group for all the crosslink_keys
	var keywords = '(';
	crosskeywords.forEach(function(keyword, i) {
	var alternative = i==0?'':'|';
		keywords += alternative+keyword.crosslink_key;
	});
	keywords += ')';
	
	casesensitive?regexpmod='g':regexpmod='gi';

	var regexp = new RegExp(precharacters+donotsearchintags+keywords+postcharacters,regexpmod);
	// END Create Regex

	// get the elements where to perform.
	var elements = document.getElementsByClassName('keywordlinking');

	// loop over the elements
	for(var i = 0; i < elements.length; i++){
		text = elements[i].innerHTML;
		textnew = text.replace(regexp,function(allMatch, match1, match2){ // the replace function will loop over every match
			matched = getCrosslink(match2)[0];
			enablepopover?popover='data-toggle="popover_crosslink" imgurl="'+matched.image+'" desc="'+matched.desc+'" title="'+titleMutation(match2)+'"':popover='';
			return match1+'<a href="'+matched.url+'" '+popover+'>'+match2+'</a>';
		});
		elements[i].innerHTML = textnew; // write the new text just once for each element
	}

	// when match get the other info from the json
	function getCrosslink(match) {
		match = match.toLowerCase();
	  	return crosskeywords.filter(
	     	function(crosskeywords){
	     		return crosskeywords.crosslink_key == match
	     	}
	  	);
	}

	// the title on hover or for the popover
	function titleMutation(string)
	{
		switch(title_mutation_settings) {
   		 	case 'capitaliseFirstLetter':
        		return string.charAt(0).toUpperCase() + string.slice(1);
        	break;
		    case 'capitaliseAll':
		        return string.toUpperCase();
		    break;
		    default:
		       	return string;
		}
	}
	
	if (enablepopover){
		// i use jquery here because its needed anyway for the bootstrap js
		$('[data-toggle="popover_crosslink"]').popover({
	    	trigger: popover_trigger,
	    	html: popover_allow_html,
	    	placement: popover_placement,
	    	content: function () {
    			return (popover_allow_images?'<img src="'+$(this).attr('imgurl') + '">':'')+$(this).attr('desc');
  			}
		});
	}
})();
