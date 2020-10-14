const { link } = require('fs');

const Album = require('./lib/getAlbum.js')();
for (const link in Album) {
    arg = {link: link, albumObj: Album[link]};
    const shstr = require('./getShScript.js')(arg);
    console.log(shstr);
} 