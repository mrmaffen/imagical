Imagical.Imageresult = DS.Model.extend({
    url: DS.attr('string'),
    thumbNailUrl: DS.attr('string')
});

Imagical.Imageresult.FIXTURES = [
    {
        id: 1,
        url: 'http://placehold.it/400x350/4D99E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4D99E0/ffffff.png&text=thumbnail'
    },
    {
        id: 2,
        url: 'http://placehold.it/400x350/4019E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4019E0/ffffff.png&text=thumbnail'
    },
    {
        id: 3,
        url: 'http://placehold.it/400x350/6D9900/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/6D9900/ffffff.png&text=thumbnail'
    },
    {
        id: 4,
        url: 'http://placehold.it/400x350/4D99E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4D99E0/ffffff.png&text=thumbnail'
    },
    {
        id: 5,
        url: 'http://placehold.it/400x350/4019E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4019E0/ffffff.png&text=thumbnail'
    },
    {
        id: 6,
        url: 'http://placehold.it/400x350/6D9900/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/6D9900/ffffff.png&text=thumbnail'
    },
    {
        id: 7,
        url: 'http://placehold.it/400x350/4D99E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4D99E0/ffffff.png&text=thumbnail'
    },
    {
        id: 8,
        url: 'http://placehold.it/400x350/4019E0/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/4019E0/ffffff.png&text=thumbnail'
    },
    {
        id: 9,
        url: 'http://placehold.it/400x350/6D9900/ffffff.png&text=test',
        thumbNailUrl: 'http://placehold.it/200x175/6D9900/ffffff.png&text=thumbnail'
    }
];