const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /Aluva/g, replace: 'Station Alpha' },
  { regex: /Edapally/g, replace: 'Station Beta' },
  { regex: /MG Road/g, replace: 'Station Gamma' },
  { regex: /Vyttila/g, replace: 'Station Delta' },
  { regex: /Kaloor/g, replace: 'Station Epsilon' },
  { regex: /aluva/g, replace: 'station_a' },
  { regex: /edapally/g, replace: 'station_b' },
  { regex: /mg_road/g, replace: 'station_c' },
  { regex: /vyttila/g, replace: 'station_d' },
  { regex: /kaloor/g, replace: 'station_e' },
  { regex: /ALU/g, replace: 'STA' },
  { regex: /EDA/g, replace: 'STB' },
  { regex: /MGR/g, replace: 'STC' },
  { regex: /VYT/g, replace: 'STD' },
  { regex: /KAL/g, replace: 'STE' },
  { regex: /colorAluva/g, replace: 'colorStationA' },
  { regex: /colorEdapally/g, replace: 'colorStationB' },
  { regex: /colorMgRoad/g, replace: 'colorStationC' },
  { regex: /Kochi/g, replace: 'Metro' }, 
  { regex: /Kerala/gi, replace: '' },    
  { regex: /Keralam/gi, replace: '' }    
];

function processDirectory(dirPath) {
    if(!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
        if(item === 'node_modules' || item === '.next' || item === '.git') continue;
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else {
            const ext = path.extname(fullPath);
            if (['.js', '.ts', '.tsx', '.jsx', '.json', '.md'].includes(ext)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let changed = false;
                for (const r of replacements) {
                    if (r.regex.test(content)) {
                        content = content.replace(r.regex, r.replace);
                        changed = true;
                    }
                }
                if (changed) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log('Updated', fullPath);
                }
            }
        }
    }
}

processDirectory(path.join(__dirname, 'dashboard'));
processDirectory(path.join(__dirname, 'backend'));
