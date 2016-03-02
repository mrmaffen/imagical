Imagical.Imageresult = DS.Model.extend({
    urlToShow: DS.attr('string'),
    siteUrl: DS.attr('string'),
    title: DS.attr('string'),
    tnUrl: DS.attr('string'),
    url: DS.attr('string'),
    isSelected: DS.attr('boolean'),
    isError: DS.attr('boolean'),
    loadedByPlugin: DS.attr('string'),
    terms: DS.hasMany('term')
});

Imagical.Term = DS.Model.extend({
    termText: DS.attr('string'),
    isQuerying: DS.attr('boolean'),
    imageresults: DS.hasMany('imageresult'),
    files: DS.hasMany('file')
});

Imagical.File = DS.Model.extend({
    fileName: DS.attr('string'),
    terms: DS.hasMany('term')
});