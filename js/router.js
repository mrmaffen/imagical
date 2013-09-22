Imagical.Router.map(function() {
  this.resource('imagical', { path: '/' });
});

Imagical.ImagicalRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('imageresult');
  }
});