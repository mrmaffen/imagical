Imagical.Router.map(function() {
  this.resource('imagical', { path: '/' }, function(){
    this.resource('file', { path: ':file_id'}, function(){
        this.resource('term', { path: ':term_id'});
    });
  });
});

Imagical.ImagicalRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('file');
  }
});