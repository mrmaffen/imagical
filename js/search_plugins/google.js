//	The google-API allows a maximum of 64 images,
//	spread over 8 pages, to be returned.
//
//	URL-Parameters:
//	"&rsz=8"
//		8 images per page (maximum value)
//
//	"&start=img"
//		Each resultset can only contain the images
//		of one page. The start-Parameter is an offset to access
//		sites 2, 3 etc.

// Loop through the 8 pages
Imagical.searchPlugins.push(SearchPlugin.create({
    isEnabled: true,
	pluginName: "Google",
	pluginFunction: function (keyWord) {
                        var stepSize = 8;
                        // google API doesnt automatically normalize searchterms    
                        keyWord = keyWord.replace(' ', '%20');
                        var promise = RSVP.Promise(function(resolve, reject){
                            var promises = [];
                            for (var offset = 0;offset < 32;offset += stepSize){
                                promises.push($.ajax({
                                        url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + keyWord + "&rsz=" + stepSize + "&start=" + offset,
                                        dataType: "jsonp"
                                }));
                            }
                            RSVP.all(promises).then (function (imgDataArray) {
                                var resultArray = [];
                                for (var i=0; i<imgDataArray.length;i++){
                                    var imgData = imgDataArray[i];
                                    if (typeof(keyWord)=="undefined" || !imgData.responseData){
                                        reject("Google responded: '"+imgData.responseDetails+"'");
                                    } else {
                                        for (var j = 0; j < imgData.responseData.results.length; j++) {
                                            var currentImg = imgData.responseData.results[j];
                                            resultArray.push({
                                                //Anzeigename des Bilds
                                                title: currentImg.titleNoFormatting,
                                                //Thumbnail URL
                                                tnUrl: currentImg.tbUrl,
                                                //DirectLink
                                                url: currentImg.url,
                                                //URL mit der Seite des Bilds
                                                siteUrl: currentImg.originalContextUrl,
                                                //Name dieses Plugins
                                                pluginName: "Google"
                                            });
                                        }
                                    }
                                }
                                resolve(resultArray);
                            }).then(null, function(error){
                                console.error(error);
                            });
                        });
                        return promise;
                    }
}));
