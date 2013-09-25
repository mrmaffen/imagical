window.Imagical = Ember.Application.create();

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