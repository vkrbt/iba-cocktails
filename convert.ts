import * as fs from 'fs';
import cocktails from '../vkrbt.me/src/cocktails.json';
import path from "path";

let main = {};

cocktails.list.forEach((cocktail) => {
    let {name} = cocktail.ingredients[0];

    main[name] = name;
})
// fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'cocktails_done.json'), JSON.stringify(data));
// fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'amounts.json'), JSON.stringify({amounts}));
fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'main.json'), JSON.stringify({top: Object.keys(main)}));
