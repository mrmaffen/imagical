Imagical.Imageresult = DS.Model.extend({
    url: DS.attr('string'),
    thumbNailUrl: DS.attr('string'),
    term: DS.belongsTo('terms')
});

Imagical.Terms = DS.Model.extend({
    term: DS.attr('string'),
    imageresults: DS.hasMany('imageresult')
});

Imagical.Imageresult.FIXTURES = [
    {
        id: 1,
        url: 'http://placehold.it/400x350/4D99E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4D99E0/ffffff.png&text=thumbnail',
        term: 1
    },
    {
        id: 2,
        url: 'http://placehold.it/400x350/4019E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4019E0/ffffff.png&text=thumbnail',
        term: 1
    },
    {
        id: 3,
        url: 'http://placehold.it/400x350/6D9900/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/6D9900/ffffff.png&text=thumbnail',
        term: 1
    },
    {
        id: 4,
        url: 'http://placehold.it/400x350/4D99E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4D99E0/ffffff.png&text=thumbnail',
        term: 2
    },
    {
        id: 5,
        url: 'http://placehold.it/400x350/4019E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4019E0/ffffff.png&text=thumbnail',
        term: 2
    },
    {
        id: 6,
        url: 'http://placehold.it/400x350/6D9900/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/6D9900/ffffff.png&text=thumbnail',
        term: 2
    },
    {
        id: 7,
        url: 'http://placehold.it/400x350/4D99E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4D99E0/ffffff.png&text=thumbnail',
        term: 2
    },
    {
        id: 8,
        url: 'http://placehold.it/400x350/4019E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4019E0/ffffff.png&text=thumbnail',
        term: 4
    },
    {
        id: 9,
        url: 'http://placehold.it/400x350/6D9900/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/6D9900/ffffff.png&text=thumbnail',
        term: 4
    }
];

Imagical.Terms.FIXTURES = [
    {
        id: 1,
        term: 'testteaetetateatea',
        imageresults: [1,2,3]
    },
    {
        id: 2,
        term: 'testteaetetateatea',
        imageresults: [4,5,6,7]
    },
    {
        id: 3,
        term: 'testteaetetateatea',
        imageresults: []
    },
    {
        id: 4,
        term: 'testteaetetateatea',
        imageresults: [8,9]
    },
    {
        id: 5,
        term: 'testteaetetateatea',
        imageresults: []
    },
    {
        id: 6,
        term: 'testteaetetateatea',
        imageresults: []
    },
    {
        id: 7,
        term: 'testteaetetateatea',
        imageresults: []
    }
];