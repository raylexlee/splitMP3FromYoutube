const { fstat } = require("fs");

module.exports = arg => {
    const link = `https://www.youtube.com/watch?v=${arg.link}`;
    const album = arg.albumObj;
    const filename = album.linktitle
    const collectionPath = '/media/raylex/data/DownloadFromYoutube/collection';
    const bashEscapePattern = /[\]\['&!?,\s()]/g;
    const escapePattern = bashEscapePattern;
    const pattern = new RegExp(album.regex);
    const hasTime = /\\d/.test(album.regex);
    const TimeTitles = album.timetitles.map(timetitle => {
        const rArray = pattern.exec(timetitle);
        const r = rArray ? rArray : [];
        let Time, Title;
        r[1] = r[1] ? r[1] : '0';
        if (!hasTime) {
            // No timestamp of the songs : This means mp3splt -s works perfect for this album:)
            return {Time: '', Title: r[1].replace(escapePattern, '\\$&')};
        }
        r[2] = r[2] ? r[2] : '0';
        if (/^\d/.test(r[1])) {
            Title = r[r.length-1];
            Time = (r.length === 5) 
                ? `${60*(r[1].replace(/:$/,'')) + 1*r[2]}.${r[3]}`
                : `${r[1]}.${r[2]}`;
        } else {
            Title = r[1];
            Time = (r.length === 5) 
                ? `${60*(r[2].replace(/:$/,'')) + 1*r[3]}.${r[4]}`
                : `${r[2]}.${r[3]}`;
        }
        TitleStr = Title ? Title : '';
        return {Time: Time, Title: TitleStr.replace(escapePattern, '\\$&')};
    });
    const Times = TimeTitles.map(e => e.Time);
    const artist = album.singer.replace(escapePattern, '\\$&');
    const alBum = album.album.replace(escapePattern, '\\$&');
    const Titles = TimeTitles.map( (e, idx) => 
        (idx === 0 )  ? `%[@a=${artist},@b=${alBum},@t=${e.Title},@g=13]` : `[@t=${e.Title}]`);
    const TimeArg = `${Times.join(" ")} EOF`;
    const TitleArg = Titles.join('');
    const AlbumCollectionPath = `${collectionPath}/${filename}.mp3`;
    const mkdirLine = `mkdir ~/NewMusic/${artist}`;
    const dlmp3Line = `youtube-dl --extract-audio --audio-format mp3 --audio-quality 5 -o 'album.%(ext)s' ${link}`;
    const hasMp3 = fs.existsSync(AlbumCollectionPath);
    const albumFile = hasMp3 ? `${AlbumCollectionPath.replace(escapePattern, '\\$&')}`: 'album.mp3';
    const spltLine = hasTime 
      ? `mp3splt -o @a-@t -d ~/NewMusic/${artist} -g ${TitleArg} ${albumFile} ${TimeArg}`
      : `mp3splt -s -o @a-@t -d ~/NewMusic/${artist} -g ${TitleArg} ${albumFile}`;
    return hasMp3 
      ? `${mkdirLine}\n${spltLine}\n`
      : `${mkdirLine}\n${dlmp3Line}\n${spltLine}\nrm album.mp3\n`;  
}