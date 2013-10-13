/*
* Params:
* keyWord:              String to query for.
* useWikiCommons:       boolean switch. If true, search WikiCommons, otherwise Wikipedia
* locale:               Which wiki to search. Can be any valid wikipedia location url prefix.
*                       For example: 'de', 'en', 'nl', ...
*/

function searchWiki (keyWord, useWikiCommons, locale, pluginName){
        /*
        * thumbWidth:   Width (px) of the thumbnail provided by the tnUrl.
        * imgLimit:     maximum of images to be returned from the imgQuery.
        *               note:   this is NOT the amount of images to be returned from the function,
        *                       but the amount of images returned from the first query. the result includes
        *                       irrelevant images such as the Wikilogo.
        *
        */
        var thumbWidth = 200;
        var imgLimit = 32;
        keyWord = keyWord.replace(' ', '%20');
        var promise = RSVP.Promise(function(resolve, reject){
                if( !(keyWord == "") && thumbWidth > 0 && imgLimit > 0 && imgLimit <= 500){

                        var resultArray = new Array();
                        var titleQueryURL = useWikiCommons?"http://commons.wikimedia.org":"http://" + locale + ".wikipedia.org";
                        titleQueryURL += "/w/api.php?action=query&format=json&callback=?&titles=" + keyWord + "&prop=images&imlimit=" + imgLimit + "&redirects";
                        //console.log('url: '+titleQueryURL);

                        //Query for a list of images
                        $.ajax({
                                url: titleQueryURL,
                                dataType: "jsonp"
                        }).then( function(data) {
                                //query success! lets get those imageTitles to continue searching for!
                                var titleArray = new Array();
                                for (var imageObject in data.query.pages){
                                    if (data.query.pages[imageObject].images){
                                        for( var i=0; i < data.query.pages[imageObject].images.length; i++){
                                                var imgTitle = data.query.pages[imageObject].images[i].title;
                                                var cleanImgTitle = imgTitle.substring(imgTitle.indexOf(':')+1, imgTitle.length);
                                                cleanImgTitle = cleanImgTitle.substring(0, cleanImgTitle.lastIndexOf('.'));
                                                cleanImgTitle = cleanImgTitle.toLowerCase();
                                                if (isRelevantImage(cleanImgTitle)){
                                                        titleArray.push(imgTitle);
                                                }
                                        }
                                    }
                                }
                                //titleArray is now filled with all relevant titles!

                                var promises = [];
                                /*
                                 *      Important URL parameters:
                                 *              iiprop=url calls for the urls to the image
                                 *              iiurlwidth=... calls for an url to a scaled thumbnail
                                 */
                                for( var i=0; i < titleArray.length; i++){
                                        var urlQueryURL = useWikiCommons?"http://commons.wikimedia.org":"http://" + locale + ".wikipedia.org";
                                        urlQueryURL += "/w/api.php?action=query&redirects&format=json&callback=?&titles=" + titleArray[i] + "&prop=imageinfo&iiprop=url&iiurlwidth=" + thumbWidth;
                                        promises.push(
                                        $.ajax({
                                        url: urlQueryURL,
                                        dataType: "jsonp"
                                        }));
                                }
                                RSVP.all(promises).then (function(imgDataArray) {
                                        for (var k=0; k< imgDataArray.length;k++){
						var imgData = imgDataArray[k];
                                                for( var page in imgData.query.pages){
                                                        try{
                                                                descrUrl = imgData.query.pages[page].imageinfo['0'].descriptionurl;
                                                                directUrl = imgData.query.pages[page].imageinfo['0'].url;
                                                                thumbUrl = imgData.query.pages[page].imageinfo['0'].thumburl;
                                                                imgName = imgData.query.pages[page].title;

                                                                //clean imagename
                                                                imgName = imgName.substring(imgName.indexOf(':')+1, imgName.length);

                                                                resultArray.push({
                                                                        //Anzeigename des Bilds
                                                                        title: imgName,
                                                                        //Thumbnail URL
                                                                        tnUrl: thumbUrl,
                                                                        //DirectLink
                                                                        url: directUrl,
                                                                        //URL mit der Seite des Bilds
                                                                        siteUrl: descrUrl,
                                                                        //Name dieses Plugins
                                                                        pluginName: pluginName
                                                                });
                                                        }
                                                        catch(err){
                                                                console.error(err);
                                                        }
                                                }
                                        }
                                        resolve(resultArray);
                                }).then(null, function(error){
                                        console.error(error);
                                });
                        });
                }
        });

        return promise;
}

/**
 * Function to filter out irrelevant images from the query results
 * such as logos from wikipedia.
 */
function isRelevantImage(imgName){
        switch(imgName){
		case "commons-logo":
			return false;
		case "disambig-dark":
			return false;
		case "qsicon ueberarbeiten":
			return false;
		case "wikiquote-logo":
			return false;
		case "wikisource-logo":
			return false;
		case "wiktfavicon en":
			return false;
		case "wikispecies-logo":
			return false;
		case "system-search":
			return false;
		case "cscr-featured":
			return false;
		case "karte gruenes deutschland":
			return false;
		case "qsicon Quelle":
			return false;
		case "wikiversity-logo":
			return false;
		default:
			return true;
        }
}
