function searchGoogle(keyWord) {
	var a = new Array();
	
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
	for (var img=0; img<64; img+=8){
		$.ajax({
		    url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + keyWord + "&rsz=8&start="+img,
		    dataType: "jsonp",
		    success: function(data) {
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
		    }
		});
	}
	
	//	Wait for the 8 queries to finish,
	//	then return a beautiful JSON :)
	$(document).ajaxStop(function () {
		return JSON.stringify(a);
	  });
}
