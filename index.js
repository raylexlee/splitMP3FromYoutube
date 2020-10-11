const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require ('path');
const fs = require('fs');
const Songs = require('./lib/getSongs.js')();
const songsJSONpath = './songs.json';

let window;

function createWindow(){
    window = new BrowserWindow({
        show: false,
        width: 1280,
        height: 720,
        webPreferences: {
          nodeIntegration: true
          }

    });

    window.loadURL(`file://${__dirname}/index.html`);
    window.once('ready-to-show', function (){
        window.maximize();
        window.show();
    });

    window.webContents.openDevTools();

    let contents = window.webContents;

    window.on('closed', function() {
        window = null;
    });
}

ipcMain.on('form-submission', function (event, Album) {
    Songs.albums.push(Album);
    fs.writeFileSync(songsJSONpath, JSON.stringify(Songs));
//    console.log("Album Object", Album)
});

ipcMain.on('request-last-album', (event, arg) => {
//  console.log(arg) 
//  console.log(Songs.albums[Songs.albums.length-1])
  event.reply('last-album-sent', Songs.albums[Songs.albums.length-1])
})

app.on('ready', function(){
    createWindow();
});
