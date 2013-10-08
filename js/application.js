Ember.FEATURES["query-params"] = true;

window.Imagical = Ember.Application.create({
  // Basic logging, e.g. "Transitioned into 'post'"
  
  // LOG_TRANSITIONS: true, 

  // Extremely detailed logging, highlighting every internal
  // step made while transitioning into a route, including
  // `beforeModel`, `model`, and `afterModel` hooks, and
  // information about redirects and aborted transitions
  
  // LOG_TRANSITIONS_INTERNAL: true
});

Imagical.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'imagical-emberjs'
});

ImagicalFileDialog = Ember.View.extend({
    tagName: 'input',
    attributeBindings: ['type'],
    type: 'file',
    change: function(e){
        this.get('controller').send('readInputFile', e);
    }
});

SearchPlugin = Ember.Object.extend({
    isEnabled: true,
    pluginName: null,
    pluginFunction : null
});