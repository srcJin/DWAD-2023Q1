const bookshelf = require('../bookshelf')

const Room = bookshelf.model('Room', {
    tableName:'product_rooms'
});

const Headshot = bookshelf.model('Headshot', {
    tableName:'product_headshots'
});

const Treatment = bookshelf.model('Treatment', {
    tableName:'product_treatments'
});

module.exports = { Room, Headshot, Treatment };
