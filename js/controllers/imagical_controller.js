Imagical.ImagicalController = Ember.ArrayController.extend({
    needs: ['term', 'file'],
    searchPlugins: Imagical.searchPlugins,
    pluginsToShow: function(){
        var plugins = this.get('searchPlugins');
        return plugins.filterBy('isEnabled', true);
    }.property('@each.isEnabled'),
    checkboxChanged: function(){
        Ember.run.next(this, function() {
            this.transitionToRoute({queryParams: {show: createQueryString(this.get('pluginsToShow'))}});
        });
    }.observes('@each.isEnabled'),
    actions: {
        readInputFile: function(e){
            console.log("readInputFile");
            var reader = new FileReader();
            var file = e.target.files[0];
            var that = this;
            
            reader.onload = function(e) {
                // Print the contents of the file
                var text = e.target.result;
                var lines = text.split(/[\r\n]+/g); // tolerate both Windows and Unix linebreaks
                
                var fileRecord = that.store.createRecord('file', {
                    fileName: file.name
                });
                fileRecord.save();
                that.transitionToRoute('file', fileRecord);
            
                for (var i = 0; i < lines.length; i++){
                    if (lines[i].length < 100 && lines[i].length > 0 && i < 1000){
                        var termRecord = that.store.createRecord('term', {
                            termText: lines[i]
                        });
                        termRecord.get('files').pushObject(fileRecord);
                        if (i===0){
                            that.transitionToRoute('term', termRecord, {queryParams: {show: createQueryString(that.get('pluginsToShow'))}});
                        }
                        termRecord.save();
                    } else{
                        console.log('Error while reading file: Line too long or empty or over 1000 lines');
                    }
                }
            };

            reader.readAsText(file, "UTF-8");
        }
    },
    saveButton: function(){
        var that = this;
        var indexFileString = "Index-file\n----------\n\n";
        var promises = [];
        var promiseInfos = [];
        var terms = this.get('controllers.file').get('terms');
        for (var i = 0; terms && i < terms.content.length; i++){
            var imageResults = terms.content[i].get('imageresults');
            if (imageResults){
                var selectedImageResults = imageResults.filterBy('isSelected');
                for (var j = 0; selectedImageResults && j < selectedImageResults.length; j++){
                    promiseInfos.push({
                        termText: terms.content[i].get('termText'),
                        selectedImageResult: selectedImageResults[j]
                    });
                }
            }
        }
        if (!isPromiseInfosEqual(this.get('lastRequestBatch'), promiseInfos)){
            this.set('lastRequestBatch', promiseInfos);
            for (var i = 0; i < promiseInfos.length; i++){
                var url = promiseInfos[i].selectedImageResult.get('url');
                promises.push(promisingXHR(url));
                this.set('isGeneratingZip', true);
            }
        }
        if (promises.length > 0){
            RSVP.all(promises).then (function (imgDataArray) {
                var zip = new JSZip();
                var lastTermText;
                var termTextCounter = 0;
                for (var i = 0; i < imgDataArray.length; i++){
                    if (imgDataArray[i]){
                        var promiseInfo = promiseInfos[i];
                        var url = promiseInfo.selectedImageResult.get('url');
                        var termText = promiseInfo.termText;
                        if (termText != lastTermText){
                            termTextCounter = 0;
                        } else {
                            termTextCounter++;
                        }
                        lastTermText = termText;
                        var fileType = url.substring(url.lastIndexOf('.'), url.length);
                        var fileName = termText.replace(/ /g, '_') + prependZeros(termTextCounter) + fileType;
                        indexFileString += fileName + "\n";
                        indexFileString += promiseInfo.selectedImageResult.get('siteUrl') + "\n";
                        indexFileString += url + "\n\n";
                        zip.file(fileName, imgDataArray[i], {binary: true});
                    }
                }
                console.log(indexFileString);
                zip.file("index-file.txt", indexFileString);
                that.set('isGeneratingZip', false);
                that.set('saveButtonHref', window.URL.createObjectURL(zip.generate({type:"blob"})));
            });
        }
    }.observes('controllers.term.imageresults.@each.isSelected'),
    lastRequestBatch: null,
    saveButtonHref: "#",
    isGeneratingZip: false
});

Imagical.FileController = Ember.ObjectController.extend({
    needs: ['term', 'file'],
    actions: {
        nextTerm: function() {
            var currentTerm = this.get('controllers.term').get('model');
            var terms = this.get('controllers.file').get('terms');
            var nextTermIndex = terms.indexOf(currentTerm)+1;     
            if (nextTermIndex < terms.content.length){
                this.transitionToRoute('term', terms.objectAt(nextTermIndex));
            }
        }
    }
});

Imagical.TermController = Ember.ObjectController.extend({
    needs: 'imagical',
    filteredImageresults: function(){
        var results;
        var pluginsToShow = this.get('controllers.imagical').get('pluginsToShow');
        for (var i=0;i<pluginsToShow.length;i++){
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
    isSearching: function(){
        if (this.get('waitingForResultCount') > 0)
            return true;
        else
            return false;
    }.property('waitingForResultCount')
});

function createQueryString(pluginsToShow){
    var result="";
    for (var i=0;i<pluginsToShow.length;i++){
        result+=pluginsToShow[i].get('pluginName');
        if (i<pluginsToShow.length-1)
            result+=",";
    }
    return result;
}

function parseQueryString(queryString){
    return queryString.split(",");
}

function prependZeros(numberString){
    numberString = String(numberString);
    while (numberString.length < 5){
        numberString = "0" + numberString;
    }
    return numberString;
}

function promisingXHR(url) {
  var promise = new RSVP.Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.overrideMimeType('text/plain; charset=x-user-defined');
    client.onreadystatechange = handler;
    client.send();

    function handler() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) { resolve(this.response); }
        else { reject(null); }
      }
    };
  });

  return promise;
}

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