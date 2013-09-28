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

function searchGoogle(keyWord, stepSize, offset) {

    this.name = "Google";
    
    // google API doesnt automatically normalize searchterms    
    keyWord = keyWord.replace(' ', '%20');
    var promise = RSVP.Promise(function(resolve, reject){
        $.ajax({
            url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + keyWord + "&rsz=" + stepSize + "&start=" + offset,
            dataType: "jsonp"
        }).then(function(data) {
                if (typeof(keyWord)=="undefined" || !data.responseData){
                    reject("Google responded: '"+data.responseDetails+"'");
                } else {
                    var a = [];
                    for (var i = 0; i < data.responseData.results.length; i++) {
                        var currentImg = data.responseData.results[i];
                        a.push({
                            //Elemente des Suchergebnisses ins Array pushen

                            //Anzeigename des Bilds
                            title: currentImg.titleNoFormatting,
                            //Thumbnail URL
                            tnUrl: currentImg.tbUrl,
                            //DirectLink
                            url: currentImg.url,
                            //URL mit der Seite des Bilds
                            siteUrl: currentImg.originalContextUrl
                        });
                    }
                    resolve(a);
                }
            }, reject);
    });
    
    return promise;
}
