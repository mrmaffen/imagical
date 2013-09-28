/**
 * Function to filter out irrelevant images from the query results
 * such as logos from wikipedia.
 */

function isRelevantImage(imgName){
	switch(imgName){
	case "Datei:Commons-logo.svg":
		return false;
	case "Datei:Disambig-dark.svg":
		return false;
	case "Datei:Qsicon Ueberarbeiten.svg":
		return false;
	case "Datei:Wikiquote-logo.svg":
		return false;
	case "Datei:Wikisource-logo.svg":
		return false;
	case "Datei:Wiktfavicon en.svg":
		return false;
	default:
		return true;
	}
}
