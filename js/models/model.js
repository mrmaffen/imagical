Imagical.Imageresult = DS.Model.extend({
    siteUrl: DS.attr('string'),
    title: DS.attr('string'),
    tnUrl: DS.attr('string'),
    url: DS.attr('string'),
    terms: DS.hasMany('term'),
    isSelected: DS.attr('boolean')
});

Imagical.Term = DS.Model.extend({
    termText: DS.attr('string'),
    hasBeenQueried: DS.attr('boolean'),
    imageresults: DS.hasMany('imageresult', {
        inverse: 'terms'
    }),
    files: DS.hasMany('file')
});

Imagical.File = DS.Model.extend({
    fileName: DS.attr('string'),
    terms: DS.hasMany('term')
});