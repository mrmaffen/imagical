Imagical.Router.map(function() {
  this.resource('imagical', { path: '/' }, function(){
    this.resource('term', { path: ':term_id'});
  });
});

Imagical.ImagicalRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('terms');
  }
});

Imagical.TermRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('imageresult', term_id);
  }
});