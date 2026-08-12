const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:\\Users\\kaise\\Downloads\\daily quest - ag\\components');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace primary large shadow for cards/modals
  content = content.replace(/shadow-\[0_0_40px_rgba\(79,195,255,0\.35\)\]/g, 'animate-glow');
  content = content.replace(/shadow-\[0_0_50px_rgba\(79,195,255,0\.4\),inset_0_0_20px_rgba\(79,195,255,0\.1\)\]/g, 'animate-glow');

  // Replace hover primary glows
  content = content.replace(/hover:shadow-\[0_0_15px_rgba\(79,195,255,0\.[34]\)\]/g, 'hover:animate-glow-subtle');
  content = content.replace(/hover:shadow-\[0_0_12px_rgba\(79,195,255,0\.[34]\)\]/g, 'hover:animate-glow-subtle');
  
  // Replace focus glows
  content = content.replace(/focus:shadow-\[0_0_12px_rgba\(79,195,255,0\.5\)\]/g, 'focus:animate-glow-subtle');
  content = content.replace(/focus:shadow-\[0_0_15px_rgba\(79,195,255,0\.5\),inset_0_0_8px_rgba\(79,195,255,0\.1\)\]/g, 'focus:animate-glow-subtle');
  content = content.replace(/focus:shadow-\[0_0_12px_rgba\(79,195,255,0\.5\),inset_0_0_6px_rgba\(79,195,255,0\.1\)\]/g, 'focus:animate-glow-subtle');

  // Replace component active shadows
  content = content.replace(/shadow-\[0_0_15px_rgba\(79,195,255,0\.5\)\]/g, 'animate-glow-subtle');
  content = content.replace(/shadow-\[0_0_14px_rgba\(79,195,255,0\.8\)\]/g, 'animate-glow-subtle');
  content = content.replace(/shadow-\[0_0_15px_rgba\(79,195,255,0\.6\)\]/g, 'animate-glow-subtle');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
