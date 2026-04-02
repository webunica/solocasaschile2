const fs = require('fs');
const glob = require('glob');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
}

walk('./src', (err, results) => {
  if (err) throw err;
  results.filter(f => f.endsWith('.tsx')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace 'brand-gradient' with 'bg-brand-indigo' wherever it refers to buttons/backgrounds
    // Since 'brand-gradient text-white' is common for solid buttons
    content = content.replace(/brand-gradient/g, 'bg-brand-indigo');
    content = content.replace(/bg-brand-indigo text-transparent bg-clip-text/g, 'text-brand-indigo');
    content = content.replace(/bg-brand-indigo text-brand-indigo/g, 'text-brand-indigo'); // just in case

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Updated', file);
    }
  });
});
