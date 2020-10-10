const ipcRenderer = require('electron').ipcRenderer;

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
