/*
* Params:
* keyWord:              String to query for.
* locale:               Which wiki to search. Can be any valid wikipedia location url prefix.
*                       For example: 'de', 'en', 'nl', ...
*/

Imagical.searchPlugins.push(SearchPlugin.create({
    isEnabled: true,
	pluginName: "Wikipedia",
	pluginFunction: function (keyWord){
                        return searchWiki(keyWord, false, "de", "Wikipedia");
                    }
}));