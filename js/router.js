Imagical.Router.map(function() {
  this.resource('imagical', { path: '/' }, function(){
    this.resource('file', { path: ':file_id'}, function(){
        this.resource('term', { path: ':term_id'});
    });
  });
});

Imagical.TermRoute = Ember.Route.extend({
    setupController: function(controller, model){
        var that = this;
        console.log('Querying for "' + model.get('termText') + '"');
        if (!model.get('imageresults'))
            model.set('hasBeenQueried', false);
        if (!model.get('hasBeenQueried')){
            model.set('hasBeenQueried', true);
                searchWiki(model.get('termText'), false, "en").then(function(data) {
                    console.dir(data);
                    for (var i = 0; i < data.length; i++ ){
                        var imageResult = that.store.createRecord('imageresult', {
                            siteUrl: data[i].siteUrl,
                            title: data[i].title,
                            tnUrl: data[i].tnUrl,
                            url: data[i].url
                        });
                        imageResult.get('terms').pushObject(model);
                        imageResult.save();
                    }
                }).then(null, function(reason){
                    console.error(reason);
                });
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