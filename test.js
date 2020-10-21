const { link } = require('fs');

const Album = require('./lib/getAlbum.js')();
// const linkrax = 'MAktNj5Eh8o';
const linkrax = 'tjj4zBeMfTc';
arg = {link: linkrax, albumObj: Album[linkrax]};
const shstr = require('./xgetShScript.js')(arg);
console.log(shstr);
