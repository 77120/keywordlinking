/*
TODO 

1. pre int not working with \b 
2. allow html is not working yet
3. load external json file

*/

(function() {
		/*Match Settings*/


	var skipcurlybraces = true,
		skipsquarebraces = false,
		casesensitive = false,
		
		/*Popover Settings*/
		/*if popover set to true, bootstrap css and js is required */
		enablepopover = true,
		popover_trigger = 'hover',
		popover_placement = 'right',
		popover_allow_html = true,// must be on
		/*if allow_images is true allow_html also must be true*/
		popover_allow_images = true,
		/*title mutation values capitaliseFirstLetter, capitaliseAll, none*/
		title_mutation_settings = 'capitaliseFirstLetter';
	
	// END SETTINGS
	
	// load a json file
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
				"desc":"text <p>with html</p>",
				"image":"",
				"url":"http://en.wikipedia.org/wiki/Span_and_div"
			}
		];
	
	var donotsearchintags = "(?![^<]*>)";
	skipcurlybraces?donotsearchintags += "(?![^{]*})":"";
	skipsquarebraces?donotsearchintags += "(?![^\[]*\])":"";
	/*var precharacters = "(?<![a-z])"; lookbehind not supported by javascript*/
	var postcharacters = "(?![a-zA-Z])";
	var precharacters = "\\b";
	
	var elements = document.getElementsByClassName('keywordlinking');

	var keywords = "";
	crosskeywords.forEach(function(keyword, i) {
	var alternative = i==0?"":"|";
		keywords += alternative+keyword.crosslink_key;
	});

	casesensitive?regexpmod="g":regexpmod="gi";
	var regexp = new RegExp(donotsearchintags+precharacters+keywords+postcharacters,regexpmod);


	for(var i = 0; i < elements.length; i++){
		text = elements[i].innerHTML;

		textnew = text.replace(regexp,function(match){
			matched = getCrosslink(match)[0];
			
			enablepopover?popover="data-toggle='popover_crosslink' imgurl='"+matched.image+"' desc='"+matched.desc+"' title='"+titleMutation(match)+"'":popover="";
			return "<a href='"+matched.url+"' "+popover+">"+match+"</a>";
		});
		elements[i].innerHTML = textnew;
	}


	function getCrosslink(match) {
		match = match.toLowerCase();
	  	return crosskeywords.filter(
	     	function(crosskeywords){
	     		return crosskeywords.crosslink_key == match
	     	}
	  	);
	}


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
		$('[data-toggle="popover_crosslink"]').popover({
	    	trigger: popover_trigger,
	    	html: popover_allow_html,
	    	placement: popover_placement,
	    	content: function () {
    			return (popover_allow_images?'<img src="'+$(this).attr('imgurl') + '">':'')+$(this).attr('desc');
  			}
		});
	}
}).call(this);
