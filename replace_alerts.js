const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('i:/0_pro/school-page/frontend/src', function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    if (content.includes('alert(')) {
      if (!content.includes('react-hot-toast')) {
        content = content.replace(/(import .*?;?\n)/, "$1import toast from 'react-hot-toast';\n");
      }
      
      content = content.replace(/alert\((.*?(?:بنجاح|نجاح|Demo mode).*?)\)/g, 'toast.success($1)');
      content = content.replace(/alert\((.*?err.*?)\)/gi, 'toast.error($1)');
      content = content.replace(/alert\((.*?error.*?)\)/gi, 'toast.error($1)');
      content = content.replace(/alert\((.*?)\)/g, 'toast($1)');
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
      }
    }
  }
});
