Imagical.Router.map(function() {
  this.resource('imagical', { path: '/' }, function(){
    this.resource('file', { path: ':file_id'}, function(){
        this.resource('term', { path: ':term_id', queryParams: ['show']});
    });
  });
});

Imagical.ImagicalRoute = Ember.Route.extend({
    model: function(){
        return Imagical.imagicalController.get('searchPlugins');
    }
});

Imagical.FileRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.find('file', params.file_id);
    }
});

Imagical.TermRoute = Ember.Route.extend({
    model: function(params) {
        return this.store.find('term', params.term_id);
    },
    setupController: function(controller, model, queryParams){
        var pluginsToShow = parseQueryString(queryParams.show);
        var searchPlugins = Imagical.imagicalController.get('searchPlugins');
        
        var that = this;
        for (var i=0;i<searchPlugins.length;i++){
            searchPlugins[i].set('isEnabled', false);
            for (var j=0;j<pluginsToShow.length;j++){
                if (searchPlugins[i].get('pluginName') == pluginsToShow[j]){
                    //console.log('enabled plugin: '+pluginsToShow[j]);
                    searchPlugins[i].set('isEnabled', true);
                }
            }
            if (searchPlugins[i].get('isEnabled')){
                var pluginFunction = searchPlugins[i].get('pluginFunction');
                console.log('Querying "'+searchPlugins[i].get('pluginName')+'" for "' + model.get('termText') + '"');
                pluginFunction(model.get('termText')).then(function(data) {
                    for (var j = 0; j < data.length; j++ ){
                        if (!model.get('imageresults').anyBy('url', data[j].url)){
                            var imageResult = that.store.createRecord('imageresult', {
                                siteUrl: data[j].siteUrl,
                                title: data[j].title,
                                tnUrl: data[j].tnUrl,
                                url: data[j].url,
                                loadedByPlugin: data[j].pluginName
                            });
                            imageResult.get('terms').pushObject(model);
                            imageResult.save();
                        }
                    }
                }).then(null, function(reason){
                    console.error(reason);
                });
            }
        }
        
        controller.set('model', model);
    },
    actions: {
        toggleSelected: function(imageresult){
            imageresult.set('isSelected', !imageresult.get('isSelected'));
            imageresult.save();
        }
    }
});