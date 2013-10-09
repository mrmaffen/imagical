Imagical.ImagicalController = Ember.ArrayController.extend({
    searchPlugins: [
    ],
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
                    if (lines[i].length < 100 && i < 1000){
                        var termRecord = that.store.createRecord('term', {
                            termText: lines[i]
                        });
                        termRecord.get('files').pushObject(fileRecord);
                        if (i===0){
                            that.transitionToRoute('term', termRecord, {queryParams: {show: createQueryString(that.get('pluginsToShow'))}});
                        }
                        termRecord.save();
                    } else{
                        console.log('Error while reading file: Line too long or too many lines');
                    }
                }
            };

            reader.readAsText(file, "UTF-8");
        },
        updateRouteQueryParams: function(){
            console.log("updateRouteQueryParams");
        },
        saveOutputFile: function(){
            
        }
    }
});

Imagical.imagicalController = Imagical.ImagicalController.create();

Imagical.FileController = Ember.ObjectController.extend({
    needs: 'term',
    actions: {
        nextTerm: function() {
            var currentTerm = this.get('controllers.term').get('model');
            var terms = this.store.all('term');
            var nextTermIndex = terms.indexOf(currentTerm)+1;  
            console.dir(terms);
            console.log(nextTermIndex);
            console.log(terms.content.length);            
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