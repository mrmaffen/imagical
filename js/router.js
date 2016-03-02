Imagical.Router.map(function() {
  this.resource('imagical', { path: '/' }, function(){
    this.resource('file', { path: '/file/:file_id'}, function(){
        this.resource('term', { path: '/term/:term_id', queryParams: ['show']});
    });
  });
});

Imagical.ImagicalRoute = Ember.Route.extend({
    // return the array of SearchPlugins for the model
    model: function(){
        //console.log("imagicalmodel:");
        //console.dir(this.controllerFor('imagical').get('searchPlugins'));
        return this.controllerFor('imagical').get('searchPlugins');
    }
});

Imagical.FileRoute = Ember.Route.extend({
    // return the file model with the given id
    model: function(params) {
        //console.log("filemodel:");
        //console.dir(this.store.find('file', params.file_id));
        return this.store.find('file', params.file_id);
    }
});

Imagical.TermRoute = Ember.Route.extend({
    // return the term model with the given id
    model: function(params) {
        //console.log("termmodel:");
        //console.dir(this.store.find('term', params.term_id));
        return this.store.find('term', params.term_id);
    },
    setupController: function(controller, model, queryParams){
        //console.log("setupcontroller");
        
        var that = this; //store this for async .then function
        async.parallel([
            function(maincallback){
                var searchPlugins = that.controllerFor('imagical').get('searchPlugins'); // get array of searchPlugins
                var termController = that.controllerFor('term');
                // go through all searchPlugins
                for (var i=0;i<searchPlugins.length;i++){
                    if (searchPlugins[i].get('isEnabled')){
                        var pluginFunction = searchPlugins[i].get('pluginFunction'); // get corresponding pluginFunction
                        console.log('Querying "'+searchPlugins[i].get('pluginName')+'" for "' + model.get('termText') + '"');
                        termController.set('waitingForResultCount', termController.get('waitingForResultCount') + 1); // increment waitingForResultCount
                        pluginFunction(model.get('termText')).then(function(data) { // execute pluginFunction and declare .then function
                            termController.set('waitingForResultCount', termController.get('waitingForResultCount') - 1); // decrement waitinForResultCount
                            for (var j = 0; j < data.length; j++ ){ // for every imageresult being returned
                                if (!model.get('imageresults').anyBy('url', data[j].url)){ // if imageresult isn't stored already
                                    var imageResult = that.store.createRecord('imageresult', { // store imageresult as new record
                                        urlToShow: data[j].tnUrl,
                                        siteUrl: data[j].siteUrl,
                                        title: data[j].title,
                                        tnUrl: data[j].tnUrl,
                                        url: data[j].url,
                                        loadedByPlugin: data[j].pluginName
                                    });
                                    imageResult.get('terms').pushObject(model); // store relationship between imageresult and term
                                    imageResult.save();
                                }
                            }
                        }).then(null, function(reason){ // if something goes wrong
                            termController.set('waitingForResultCount', termController.get('waitingForResultCount') - 1);// decrement waitinForResultCount
                            console.error(reason);
                        });
                    }
                }
            }
        ],
        function(err, results){
        });
        
        controller.set('model', model); // finally attach the model to the given controller
    },
    actions: {
        // whenever the user clicks an imageresult, change isSelected boolean in model
        toggleSelected: function(imageresult){
            imageresult.set('isSelected', !imageresult.get('isSelected'));
            imageresult.set('urlToShow', imageresult.get('url'));
            imageresult.save();
        }
    }
});