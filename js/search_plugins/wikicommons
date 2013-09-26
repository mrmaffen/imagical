/*
 * Params:	keyWord:	String to query for.
 * 			thumbWidth:	Width (px) of the thumbnail provided by the tnUrl.
 * 			imgLimit: 	maximum of images to be returned from the imgQuery.
 * 						note: 	this is NOT the amount of images to be returned from the function,
 * 								but the amount of images returned from the first query. the result includes
 * 								irrelevant images such as the Wikilogo.
 */

function searchWikiCommons (keyWord, thumbWidth, imgLimit){

	if( !(keyWord == "") && thumbWidth > 0 && imgLimit > 0 && imgLimit <= 500){
		var resultArray = new Array();

		var titleQueryURL = "http://commons.wikimedia.org/w/api.php?action=query&format=json&callback=?&titles=" + keyWord + "&prop=images&imlimit=" + imgLimit + "&redirects";
		$.ajax({
			url: titleQueryURL,
			dataType: "jsonp",
			success: function(data) {

				//query success! lets get those imageTitles to continue searching for!
				var titleArray = new Array();
				for (var imageObject in data.query.pages){
					for( var i=0; i < data.query.pages[imageObject].images.length; i++){
						var imgTitle = JSON.stringify(data.query.pages[imageObject].images[i].title);
						imgTitle = imgTitle.replace(/(['"])/g, "");
						if (isRelevantImage(imgTitle)){
							titleArray.push(imgTitle);
						}
					}
				}
				//titleArray is now filled with all relevant titles!

				/*
				 * 	Important URL parameters:
				 *		iiprop=url calls for the urls to the image
				 *		iiurlwidth=... calls for an url to a scaled thumbnail 
				 */
				for( var i=0; i < titleArray.length; i++){
					var urlQueryURL = "http://commons.wikimedia.org/w/api.php?action=query&redirects&format=json&callback=?&titles=" + titleArray[i] + "&prop=imageinfo&iiprop=url&iiurlwidth=" + thumbWidth;
					$.ajax({
						url: urlQueryURL,
						dataType: "jsonp",
						success: function(imgData) {
							for( var page in imgData.query.pages){
								try{
									var descrUrl = JSON.stringify(imgData.query.pages[page].imageinfo['0'].descriptionurl);
									var directUrl = JSON.stringify(imgData.query.pages[page].imageinfo['0'].url);
									var thumbUrl = JSON.stringify(imgData.query.pages[page].imageinfo['0'].thumburl);
									var imgName = JSON.stringify(imgData.query.pages[page].title);

									//remove json-typical double-quotes
									descrUrl = descrUrl.substring(1, descrUrl.length-1);
									directUrl = directUrl.substring(1, directUrl.length-1);
									thumbUrl = thumbUrl.substring(1, thumbUrl.length-1);
									imgName = imgName.substring(1, imgName.length-1);

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
										siteUrl: descrUrl
									});
								}
								catch(err){
									//for some reason some few pictures dont have an imageinfo returned
								}
							}
						}});
				}
			}});

		//	Wait for every query to finish,
		//	then return a beautiful JSON :)
		$(document).ajaxStop(function () {
			console.log("commons:");
			console.dir(resultArray);
			return JSON.stringify(resultArray);
		});
	}
}
