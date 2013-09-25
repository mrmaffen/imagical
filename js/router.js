Imagical.Router.map(function() {
  this.resource('imagical', { path: '/' }, function(){
    this.resource('file', { path: ':file_id'}, function(){
        this.resource('term', { path: ':term_id'});
    });
  });
});

Imagical.ImagicalRoute = Ember.Route.extend({
    actions: {
        toggleSelected: function(model){
            console.log('toggleSelected '+model.get('isSelected'));
            model.set('isSelected', !model.get('isSelected'));
            model.save();
        }
    }
});