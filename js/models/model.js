Imagical.Imageresult = DS.Model.extend({
    url: DS.attr('string'),
    thumbNailUrl: DS.attr('string'),
    term: DS.hasMany('term'),
    isSelected: DS.attr('boolean')
});

Imagical.Term = DS.Model.extend({
    termText: DS.attr('string'),
    imageresults: DS.hasMany('imageresult'),
    file: DS.hasMany('file')
});

Imagical.File = DS.Model.extend({
    fileName: DS.attr('string'),
    terms: DS.hasMany('term')
});