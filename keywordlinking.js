
/*
TODO 

	1. pre int not working with \b 
	2. case insensitive but replaces the match with the keyword! may set to case sensiitive*/

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

var crosskeyword = 
	[
		{
			"crosslink_key":"crossie",
			"desc":"text of link",
			"image":"",
			"url":"1"
		},
		{
			"crosslink_key":"list",
			"desc":"text of plaatje",
			"image":"http://www.centos.org/images/logo_small.png",
			"url":"2"
		},
		{
			"crosslink_key":"weer wel",
			"desc":"text popup",
			"image":"",
			"url":"3"
		}
	];

var donotsearchintags = "(?![^<]*>)";
skipcurlybraces?donotsearchintags += "(?![^{]*})":"";
/*var precharacters = "(?<![a-z])"; lookbehind not supported by javascript*/
var postcharacters = "(?![a-zA-Z])";
var precharacters = "\\b";

var elements = document.getElementsByClassName('keywordlinking');

for(var i = 0; i < elements.length; i++){

	keyword = crosskeyword[i].crosslink_key;
    crosskeyword.forEach(function(keyword, x) {
		text = elements[i].innerHTML;

		popover_allow_images?image="<img src="+keyword.image+"><br>":image="";
		enablepopover?popover="data-toggle='popover' title='"+titleMutation(keyword.crosslink_key)+"' data-content='"+image+keyword.desc+"'":popover="";
		casesensitive?regexpmod="g":regexpmod="gi";
		var regexp = new RegExp(donotsearchintags+precharacters+keyword.crosslink_key+postcharacters,regexpmod);
		textnew = text.replace(regexp,function(match){return "<a href='#"+keyword.url+"' "+popover+">"+match+"</a>"});
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
