const { ipcMain } = require('electron');

const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('last-album-sent', function(event, album) {
//    console.log(album); 
    document.getElementById("link").value = album.link;
    document.getElementById("album").value = album.album;
    document.getElementById("singer").value = album.singer;
    document.getElementById("regex").value = album.regex;
    document.getElementById("timetitle").value = album.timetitles.join("\n");
    document.getElementById("bashscript").value = require('./getShScript')(album);
});

function requestLastAlbum() {
    ipcRenderer.send('request-last-album',"request last album")
}

function sendForm(event) {
    event.preventDefault() // stop the form from submitting
    const link = document.getElementById("link").value;
    const album = document.getElementById("album").value;
    const singer = document.getElementById("singer").value;
    const regex = document.getElementById("regex").value;
    const timetitle = document.getElementById("timetitle").value;
    const Album = {
        link: link,
        album: album,
        singer: singer,
        regex: regex,
        timetitles: timetitle.replace(/\n+$/, "").split("\n")
    };
    ipcRenderer.send('form-submission', Album)
}
