Imagical.searchPlugins.push(SearchPlugin.create({
    isEnabled: true,
	pluginName: "WikiCommons",
	pluginFunction: function (keyWord){
                        return searchWiki(keyWord, true, "", "WikiCommons");
                    }
}));