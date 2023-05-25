const fs = require('fs');
const path = require('path');

// File destination.txt will be created or overwritten by default.
fs.copyFile(
  path.join(__dirname, '../dist/index.html'),
  path.join(__dirname, '../views/home.handlebars'),
  (err: any) => {
    if (err) throw err;
  },
);
