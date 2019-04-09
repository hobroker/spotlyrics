const menubar = require('menubar');
const mb = menubar({
  dir: __dirname
});

mb.on('ready', function ready() {
  console.log('app is ready');
});
