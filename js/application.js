// Enable canary-build query-params feature
Ember.FEATURES["query-params"] = true;

// Basic Ember.Application object
window.Imagical = Ember.Application.create({
  // Basic logging, e.g. "Transitioned into 'post'"
  
  LOG_TRANSITIONS: true, 

  // Extremely detailed logging, highlighting every internal
  // step made while transitioning into a route, including
  // `beforeModel`, `model`, and `afterModel` hooks, and
  // information about redirects and aborted transitions
  
  LOG_TRANSITIONS_INTERNAL: true
});

// Use a local storage adapter to persist the model
Imagical.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'imagical-emberjs'
});

// Custom FileDialog which calls 'readInputFile' action on controller
ImagicalFileDialog = Ember.View.extend({
    tagName: 'input',
    attributeBindings: ['type'],
    type: 'file',
    change: function(e){
        this.get('controller').send('readInputFile', e);
    }
});

// SearchPlugin object used to store plugin information
// (see google.js for example-code)
SearchPlugin = Ember.Object.extend({
    isEnabled: true,
    pluginName: null,
    pluginFunction : null
});

// Array used to push all SearchPlugins into
Imagical.searchPlugins = [];