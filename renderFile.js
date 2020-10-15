const { ipcMain } = require('electron');
const fs = require('fs');

const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('album-sent', function(event, arg) {
    const link = arg.link;
    const album = arg.albumObj;
    document.getElementById("link").value = `https://www.youtube.com/watch?v=${link}`;
    document.getElementById("linktitle").value = album.linktitle;
    document.getElementById("album").value = album.album;
    document.getElementById("singer").value = album.singer;
    document.getElementById("regex").value = album.regex;
    document.getElementById("timetitle").value = album.timetitles.join("\n");
    document.getElementById("bashscript").value = require('./getShScript')(arg);
});

ipcRenderer.on('link-title-sent', function(event, arg) {
    const link = arg.link;
    if (link) {
      document.getElementById("link").value = `https://www.youtube.com/watch?v=${link}`;
      document.getElementById("linktitle").value = arg.linktitle;
    }
});

ipcRenderer.on('time-title-sent', function(event, arg) {
    if (arg) {
      document.getElementById("timetitle").value = arg;
    }  
});

function requestAlbum() {
    const link = document.getElementById("link").value;
    const r = link.match(/\?v=(.*)$/);
    ipcRenderer.send('request-album', r ? r[1] : '')
}

function requestTimeTitle() {
    const singer = document.getElementById('singer').value;
    if (singer) {
        ipcRenderer.send('request-time-title', singer);
    }    
}

function requestLinkTitle() {
    ipcRenderer.send('request-link-title', 'request link title')
}

function sendForm(event) {
    event.preventDefault() // stop the form from submitting
    const url = document.getElementById("link").value;
    const r = url.match(/v=(.*)$/);
    if (!r) return;
    const link = r[1];
    const linktitle = document.getElementById("linktitle").value;
    const album = document.getElementById("album").value;
    const singer = document.getElementById("singer").value;
    const regex = document.getElementById("regex").value;
    const timetitle = document.getElementById("timetitle").value;
    const albumObj = {
        linktitle: linktitle,
        album: album,
        singer: singer,
        regex: regex,
        timetitles: timetitle.replace(/\n+$/, "").split("\n")
    };
    const arg = {link: link, albumObj: albumObj};
    ipcRenderer.send('form-submission', arg)
}
