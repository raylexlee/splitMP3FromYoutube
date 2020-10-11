module.exports = album => {
    const pattern = new RegExp(album.regex);
    const TimeTitles = album.timetitles.map(timetitle => {
        const r = pattern.exec(timetitle);
        let Time, Title;
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
        return {Time: Time, Title: Title.replace(/\s/g, '+')};
    });
    const Times = TimeTitles.map(e => e.Time);
    const artist = album.singer.replace(/\s/g, '\\ ');
    const alBum = album.album.replace(/\s/g, '+');
    const Titles = TimeTitles.map( (e, idx) => 
        (idx === 0 )  ? `%[@a=${artist},@b=${alBum},@t=${e.Title},@g=13]` : `[@t=${e.Title}]`);
    const TimeArg = `${Times.join(" ")} EOF`;
    const TitleArg = Titles.join('');
    return `mkdir ~/NewMusic/${artist}
youtube-dl --extract-audio --audio-format mp3 --audio-quality 5 -o 'album.%(ext)s' ${album.link}
mp3splt -o @a-@t -d ~/NewMusic/${artist} -g ${TitleArg} album.mp3 ${TimeArg}
rm album.mp3
`;
};