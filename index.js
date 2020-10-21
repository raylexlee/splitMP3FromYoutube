#!/usr/bin/env node
const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const { exec } = require('child_process');
const get_mp3 = (_path, _link) => `cd ${_path}; ~/dd ${_link}`;
const path = require ('path');
const fs = require('fs');
const Album = require('./lib/getAlbum.js')();
const albumJSONpath = './album.json';
const collectionPath = '/media/raylex/data/DownloadFromYoutube/collection';
const XLSX = require('xlsx');
const wb = XLSX.readFile('YoutubeCollection.xlsx');

let window, wintube  

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

//    window.webContents.openDevTools();

    let contents = window.webContents;

    window.on('closed', function() {
        window = null;
    });
}

function createWintube() { 
  const url =  `https://www.youtube.com`
  wintube = new BrowserWindow({width: 1280, height: 700, title: url}) 
  wintube.loadURL(url) 
//  wintube.webContents.openDevTools()
}  

app.whenReady().then(() => {
  globalShortcut.register('CommandOrControl+X', () => {
  //  console.log('CommandOrControl+X is pressed')
    let currentURL = wintube.webContents.getURL();
    exec(get_mp3(collectionPath, currentURL),
        (error, stdout, stderr) => {
            console.log(stdout);
            console.log(stderr);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
  })
})
ipcMain.on('form-submission', function (event, arg) {
    Album[arg.link] = arg.albumObj;
    fs.writeFileSync(albumJSONpath, JSON.stringify(Album));
//    console.log("Album Object", Album)
});

ipcMain.on('request-album', (event, link) => {
  const arg = ( link && (link in Album) ) 
      ? {link: link, albumObj: Album[link]} 
      : {link: link, albumObj: {}};
  event.reply('album-sent', arg)
});

ipcMain.on('request-link-title', (event, req) => {
   const url = wintube.getURL();
   const r = url.match(/v=(.*)$/);
   const link = r ? r[1] : '';
   const linktitle = r ? wintube.getTitle().replace(/\s-\sYouTube$/,'') : '';
   event.reply('link-title-sent', {link: link, linktitle: linktitle});
});

ipcMain.on('request-time-title', (event, singer) => {
   let timetitle = '';
   if (wb.SheetNames.includes(singer)) {
     timetitle = XLSX.utils.sheet_to_csv(wb.Sheets[singer]);
   }
   event.reply('time-title-sent', timetitle);
});

app.on('ready', function(){
    createWindow();
    createWintube();
});
