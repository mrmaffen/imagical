Imagical.searchPlugins.push(SearchPlugin.create({
    isEnabled: true,
	pluginName: "Google",
	pluginFunction: function (keyWord) {
                        var stepSize = 8; //maximum step-size
                        keyWord = keyWord.replace(' ', '%20');// google API doesnt automatically normalize searchterms    
                        var promise = RSVP.Promise(function(resolve, reject){
                            var promises = [];
                            for (var offset = 0;offset < 32;offset += stepSize){
                                //	The google-API allows a maximum of 64 images,
                                //	spread over 8 pages, to be returned.
                                //
                                //	URL-Parameters:
                                //	"&rsz=stepSize"
                                //		stepSize images per page (maximum value)
                                //
                                //	"&start=offset"
                                //		Each resultset can only contain the images
                                //		of one page. The start-Parameter is an offset to access
                                //		sites 2, 3 etc.
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
                                                //Title of the image
                                                title: currentImg.titleNoFormatting,
                                                //Thumbnail URL
                                                tnUrl: currentImg.tbUrl,
                                                //DirectLink to the image
                                                url: currentImg.url,
                                                //URL of the corresponding website
                                                siteUrl: currentImg.originalContextUrl,
                                                //Name of this plugin
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
