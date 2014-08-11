/*
TODO 

	1. pre int not working with \b 

	*/

//SETTINGS

/*Match Settings*/
var skipcurlybraces = false;
var casesensitive = false;

/*Popover Settings*/
/*if popover set to true, bootstrap css and js is required */
var enablepopover = true;
var popover_trigger = 'hover';
var popover_placement = 'right';
var popover_allow_html = true;
/*if allow_images is true allow_html also must be true*/
var popover_allow_images = true;
/*title mutation values capitaliseFirstLetter, capitaliseAll, none*/
var title_mutation_settings = 'capitaliseFirstLetter';

// END SETTINGS

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
		}
	];

var donotsearchintags = "(?![^<]*>)";
skipcurlybraces?donotsearchintags += "(?![^{]*})":"";
/*var precharacters = "(?<![a-z])"; lookbehind not supported by javascript*/
var postcharacters = "(?![a-zA-Z])";
var precharacters = "\\b";

var elements = document.getElementsByClassName('keywordlinking');

for(var i = 0; i < elements.length; i++){

	keyword = crosskeywords[i].crosslink_key;
    crosskeywords.forEach(function(keyword, x) {
		text = elements[i].innerHTML;

		popover_allow_images?image="<img src="+keyword.image+"><br>":image="";
		enablepopover?popover="data-toggle='popover' title='"+titleMutation(keyword.crosslink_key)+"' data-content='"+image+keyword.desc+"'":popover="";
		casesensitive?regexpmod="g":regexpmod="gi";
		var regexp = new RegExp(donotsearchintags+precharacters+keyword.crosslink_key+postcharacters,regexpmod);
		textnew = text.replace(regexp,function(match){return "<a href='"+keyword.url+"' "+popover+">"+match+"</a>"});
		elements[i].innerHTML = textnew;
	});
}

function titleMutation(string)
{
	if(title_mutation_settings == 'capitaliseFirstLetter'){
    	return string.charAt(0).toUpperCase() + string.slice(1);
    } else if (title_mutation_settings == 'capitaliseAll'){
    	return string.toUpperCase();
    } else {
    	return string;
    }
}

if (enablepopover){
	$('[data-toggle="popover"]').popover({
    	trigger: popover_trigger,
    	html: popover_allow_html,
    	placement: popover_placement
	});
}
