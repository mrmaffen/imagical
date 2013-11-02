Imagical.ImagicalController = Ember.ArrayController.extend({
    needs: ['term', 'file'], // declare needs array because we need to access these controller later on
    searchPlugins: Imagical.searchPlugins, // get searchPlugins from our populated array
    pluginsToShow: function(){ // Whenever isEnabled changes on one of the searchPlugins, update "pluginsToShow" accordingly
        //console.log("pluginstoshow");
        var plugins = this.get('searchPlugins');
        return plugins.filterBy('isEnabled', true);
    }.property('@each.isEnabled'),
    checkboxChanged: function(){ // Whenever isEnable changes on one of the searchPlugins, update queryParams accordingly
        //console.log("checkboxchanged");
        Ember.run.next(this, function() {
            this.transitionToRoute({queryParams: {show: createQueryString(this.get('pluginsToShow'))}});
        });
    }.observes('@each.isEnabled'),
    actions: {
        readInputFile: function(e){
            this.set('isReadingInputFile', true);
            var that = this;
            async.parallel([
                function(maincallback){
                    console.log("readInputFile");
                    var reader = new FileReader();
                    var file = e.target.files[0]; // file object
                    
                    reader.onload = function(e) {
                        var text = e.target.result; // get text from file object
                        var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
                        var error = false;
                        
                        var fileRecord = that.store.createRecord('file', { // createRecord with filename
                            fileName: file.name
                        });
                        fileRecord.save();
                        that.transitionToRoute('file', fileRecord); // transition to the newly created filerecord
                    
                        for (var i = 0; i < lines.length; i++){ // go through the complete text
                            if (lines[i].length < 100 && lines[i].length > 0 && i < 1000){ //limit length of file/line to avoid extreme loading times
                                var termRecord = that.store.createRecord('term', { // create new term for every line of text
                                    termText: lines[i]
                                });
                                termRecord.get('files').pushObject(fileRecord); // add relationship between each term and the corresponding file
                                termRecord.save();
                                if (i===0){
                                    // transition to the first term
                                    that.transitionToRoute('term', termRecord, {queryParams: {show: createQueryString(that.get('pluginsToShow'))}});
                                }
                            } else{
                                error = true;
                            }
                        }
                        if (error)
                            maincallback('Error while reading file: Line too long or empty or over 1000 lines');
                    };

                    reader.readAsText(file, "UTF-8");
                }
            ],
            function(err, results){
                this.set('isReadingInputFile', false);
            });
        },
        generateZipButton: function(){ // Whenever user selects or deselects an imageresult, download images and generate and serve new zip file   
            var that = this;
            async.parallel([
                function(maincallback){
                    var indexFileString = "Index-file\n----------\n\n"; // add header-string to index-file string
                    var promises = []; // used to store all promises
                    var promiseInfos = []; // used to connect promises with their corresponding info later on
                    var terms = that.get('controllers.file').get('terms'); // get all terms from current file model
                    for (var i = 0; terms && i < terms.content.length; i++){ // go through every term
                        var imageResults = terms.content[i].get('imageresults'); // get corresponding imageresult array
                        if (imageResults){
                            var selectedImageResults = imageResults.filterBy('isSelected'); // get all selected imageresults
                            for (var j = 0; selectedImageResults && j < selectedImageResults.length; j++){ // for every selected imageresult
                                promiseInfos.push({ // push its info in the promiseInfos array, so that we can associate it later on in the .then callback
                                    termText: terms.content[i].get('termText'),
                                    selectedImageResult: selectedImageResults[j]
                                });
                            }
                        }
                    }
                    that.set('lastRequestBatch', promiseInfos);
                    if (promiseInfos.length > 0) {
                        that.set('waitingForResultCount', that.get('waitingForResultCount') + 1); //increment waitingForResultCount
                        async.map(promiseInfos, 
                            function (item, callback){
                                $.ajax({
                                    url: item.selectedImageResult.get('url'),
                                    mimeType: 'text/plain; charset=x-user-defined',
                                    timeout: 10000
                                }).then( function(data){
                                    callback(null, data);
                                }, function(data){
                                    callback(null, null);
                                });
                            }, 
                            function (err, results){ //if all promises were resolved
                                var zip = new JSZip();
                                var lastTermText;
                                var termTextCounter = 0; //used for number counter in filename
                                for (var i = 0; i < results.length; i++){
                                    var promiseInfo = promiseInfos[i]; //get the previously stored promise's info
                                    if (results[i]){
                                        var url = promiseInfo.selectedImageResult.get('url'); //retrieve the corresponding url
                                        var termText = promiseInfo.termText; //retrieve the corresponding term's text
                                        if (termText != lastTermText){
                                            termTextCounter = 0;
                                        } else {
                                            termTextCounter++;
                                        }
                                        lastTermText = termText;
                                        var fileType = url.substring(url.lastIndexOf('.'), url.length); //extract fileType ending from url
                                        var fileName = termText.replace(/ /g, '_') + prependZeros(termTextCounter) + fileType; //construct filename
                                        indexFileString += fileName + "\n"; //add filename to index-file string
                                        indexFileString += promiseInfo.selectedImageResult.get('siteUrl') + "\n"; //add siteUrl to index-file string
                                        indexFileString += url + "\n\n"; //add url to index-file string
                                        zip.file(fileName, results[i], {binary: true}); //finally, add our image-file to the zip-archive
                                    } else {
                                        promiseInfo.selectedImageResult.set('isError', true);
                                    }
                                }
                                //console.log(indexFileString);
                                zip.file("index-file.txt", indexFileString); //add index-file to zip-archive
                                maincallback(null, window.URL.createObjectURL(zip.generate({type:"blob"})));
                                that.set('waitingForResultCount', that.get('waitingForResultCount') - 1); //decrement waitingForResultCount
                                that.set('isZipGenerated', true);
                            }
                        );
                    }
                }
            ],
            function(err, results){
                that.set('saveButtonHref', results[0]); //now add the blob-url to the saveButton <a>
            });
        }
    },    
    lastRequestBatch: null,
    saveButtonHref: "#", //savebutton's href attribute value
    waitingForResultCount: 0,
    isGeneratingZip: function(){ //set isGeneratingZip to true, if currently waiting for results, else set it to false
        if (this.get('waitingForResultCount') > 0)
            return true;
        else
            return false;
    }.property('waitingForResultCount'),
    isZipGenerated: false,
    makeZipInvalid: function(){
        this.set('isZipGenerated', false);
    }.observes('controllers.term.imageresults.@each.isSelected'),
    isReadingInputFile: false
});

Imagical.FileController = Ember.ObjectController.extend({
    needs: ['term', 'file'],
    actions: {
        nextTerm: function() { //when called, change to the next term in the array
            //console.log("nextterm");
            var currentTerm = this.get('controllers.term').get('model');
            var terms = this.get('controllers.file').get('terms');
            var nextTermIndex = terms.indexOf(currentTerm)+1;
            if (nextTermIndex < terms.content.length){
                this.transitionToRoute('term', terms.objectAt(nextTermIndex)); //transition to the next term
            }
        }
    }
});

Imagical.TermController = Ember.ObjectController.extend({
    needs: 'imagical',
    filteredImageresults: function(){ //Whenever the imageresults array changes, update the filtered array
        //console.log("filteredimageresults");
        var results;
        var pluginsToShow = this.get('controllers.imagical').get('pluginsToShow'); //get all enabled plugins
        for (var i=0;i<pluginsToShow.length;i++){
            //only show image, if corresponding search-plugin is enabled
            var filteredImages = this.get('model').get('imageresults').filterBy('loadedByPlugin', pluginsToShow[i].get('pluginName'));
            if (filteredImages.length > 0){
                if (!results)
                    results = filteredImages;
                else
                    results.addObjects(filteredImages);
            }
        }
        console.log('filteredImages');
        console.dir(results);
        return results;
    }.property('model.imageresults.@each', 'controllers.imagical.pluginsToShow'),
    waitingForResultCount: 0,
    isSearching: function(){ //set isSearching to true, if currently waiting for results, else set it to false
        if (this.get('waitingForResultCount') > 0)
            return true;
        else
            return false;
    }.property('waitingForResultCount')
});

//Concatenate all given plugin's names, seperated by a ","
function createQueryString(pluginsToShow){
    var result="";
    for (var i=0;i<pluginsToShow.length;i++){
        result+=pluginsToShow[i].get('pluginName');
        if (i<pluginsToShow.length-1)
            result+=",";
    }
    return result;
}

//Reverse of createQueryString(pluginsToShow) function.
function parseQueryString(queryString){
    return queryString.split(",");
}

//Prepend the given string with zeros, so that it always has >=5 characters
function prependZeros(numberString){
    numberString = String(numberString);
    while (numberString.length < 5){
        numberString = "0" + numberString;
    }
    return numberString;
}

//Compare two promiseInfos, whether or not they're equal
function isPromiseInfosEqual(first, second){
    if (first == null || second == null || first.length != second.length){
        return false;
    }
    for (var i = 0; i < first.length; i++){
        if (first[i].selectedImageResult.get('url') != second[i].selectedImageResult.get('url')){
            return false;
        }
    }
    return true;
}
