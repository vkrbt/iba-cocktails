import * as fs from 'fs';
import cocktails from './src/cocktails.json';
import path from "path";

let main = {};

cocktails.list = cocktails.list.sort((cocktail1, cocktail2) => {
    return ('' + cocktail1.en).localeCompare(cocktail2.en)
})
// fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'cocktails_done.json'), JSON.stringify(data));
// fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'amounts.json'), JSON.stringify({amounts}));
// fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'main.json'), JSON.stringify({top: Object.keys(main)}));
fs.writeFileSync(path.join(process.cwd(), 'src', 'cocktails.json'), JSON.stringify(cocktails));
