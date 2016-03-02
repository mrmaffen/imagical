Imagical.searchPlugins.push(SearchPlugin.create({
    isEnabled: true,
	pluginName: "Wikipedia",
	pluginFunction: function (keyWord){
                        return searchWiki(keyWord, false, "de", "Wikipedia");
                    }
}));