const fs = require('fs');

module.exports = () => {
  const songsJSONpath = './songs.json';
  let Songs = {
    genre: 13,
    albums: []
  };
  if (fs.existsSync(songsJSONpath)) {
    const rawdata = fs.readFileSync(songsJSONpath);
    Songs = JSON.parse(rawdata);
  } 
  return Songs;
};
