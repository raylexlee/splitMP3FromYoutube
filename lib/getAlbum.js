const fs = require('fs');

module.exports = () => {
  const albumJSONpath = './album.json';
  let Album = {};
  if (fs.existsSync(albumJSONpath)) {
    const rawdata = fs.readFileSync(albumJSONpath);
    Album = JSON.parse(rawdata);
  } 
  return Album;
};
