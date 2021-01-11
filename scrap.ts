import * as needle from 'needle';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

let index = 'https://probarman.ru';
let listUrl = 'https://probarman.ru/glossary/coctails/iba/';

let categories = [];

let METHODS = ['шейк', 'билд', 'стир & стрейн']
let DISH = {
    "lowball glass": [
        "олд фешен",
        "олд-фешен с крошенным льдом",
        "олд фешен со льдом",
        "олд фешн",
        "олд-фешен"
    ],

    "highball glass": [
        "хайболл или двойной олд фешен",
        "хайболл",
        "хайболл или кубок",
        "хайболл безо льда",
        "хайболл со льдом",
        "хайболл  со льдом",
        "хайболл или большой гоблит",
        "тумблер или хайболл"
    ],

    "champagne flute": [
        "бокал для шампанского (champagne flute)",
        "для шампанского",
        "для шампанского (флюте)",
        "бокал для шампанского"
    ],

    "cocktail glass": [
        "коктейльная рюмка мартини",
        "коктейльная рюмка",
        "коктейльная рюмка с ободком из соли",
        "коктейльный бокал",
        "коктейльная рюмка мартини с сахарным ободком",
        "коктейльная рюмка мартини с ободком из соли",
        "двойной коктейльный бокал (мартини)",
        "маргарита"
    ],

    "wine glass": ["бокал для белого вина"],

    "irish coffee glass": ["айриш кофе"],

    "shot glass": ["шот, стопка (пус-кафе)"]
};
let INGREDIENTS = {};
let DRINK_TIMES = {};

function addMapItem(itemsMap: Record<string, string>, item: string) {
    if (!itemsMap[item]) {
        itemsMap[item] = item;
    }
}

function removeExtraSymbols(str: string) {
    return str.replace('.', '').trim();
}

function getSplitAfterText(text, textAfter) {
    try {
        return removeExtraSymbols(text.toLowerCase().split(textAfter.toLowerCase())[1]);
    } catch (e) {
        console.log('|' + text + '|-|' + textAfter + '|');
        console.log(text.toLowerCase().split(textAfter.toLowerCase())[1]);
    }
}

function extractTextAfter(text, textAfter) {
    try {
        let regex = new RegExp(`${textAfter.toLowerCase()}: (.*)`, 'm')
        return removeExtraSymbols(text.toLowerCase().match(regex)[1]);
    } catch (e) {
        // console.log('|' + text + '|-|' + textAfter + '|');
        // console.log(text.toLowerCase().split(textAfter.toLowerCase())[1]);
    }
}

function prepareIngredients(text) {
    text = text.trim();

    return text.split('\n').map((ingredient) => {
        let name = '';
        let amount = '';

        if (ingredient === '1 дэш Angostura bitter (ароматическая горечь 1-2 капля)') {
            name = ingredient;
        } else {
            let match = ingredient.match(/([^-–\t]+)[ -–\t]?(.*)/);

            if (match) {
                name = match[1].toLowerCase().trim();
                amount = match[2].toLowerCase().trim();
            } else {
                name = ingredient.toLowerCase().trim();
            }
        }

        addMapItem(INGREDIENTS, name);

        return {
            name,
            amount,
        }
    }).filter(ingredient => ingredient.name.trim());
}

function prepateDrinkTime(str) {
    if (/дижестив|десертный/.test(str)) {
        return 'дижестив'
    }

    return str;
}

function detectMethod(str) {
    let method = METHODS.find((properMethod) => {
        return (new RegExp(properMethod)).test(str)
    });

    if (!method) {
        console.log(str, 'NO METHOD !!!!!!!!!');
    }

    return method;
}

function detectDish(str) {
    let dish = Object.keys(DISH).find((key) => {
        return DISH[key].includes(str);
    });

    if (!dish) {
        console.log(str, 'NO DISH !!!!!!!!!');
    }

    return dish;
}

async function main() {
    let res = await needle(listUrl);
    let $ = cheerio.load(res.body);

    $('.white .row:nth-child(4) .row .col-sm-4').each((i, elem) => {
        let [ru, en] = $(elem).find('h4').html().split('<br>');

        let links = $(elem).find('p');

        let preparedLinks = Array.from(links.map((i, elem) => ({
            link: index + $(elem).find('a').attr('href'),
            en: $(elem).find('a').text().trim(),
            ru: $(elem).find('small').text().trim(),
        })));

        categories.push({
            ru,
            en,
            links: preparedLinks,
        });
    });

    await Promise.all(categories.map(async (category) => {
        await Promise.all(category.links.map(async (link) => {
            let res = await needle(link.link);
            let ibaLink = 'https://iba-world.com/iba-official-cocktails/' + link.en.toLowerCase().replace(' ', '-') + '/';
            let $ = cheerio.load(res.body);
            let drinkTime = prepateDrinkTime(getSplitAfterText($('.row:nth-child(4) .row h3').text(), 'Категория:'));

            addMapItem(DRINK_TIMES, drinkTime);

            let infoText = $('.row:nth-child(4) .row div:last-child').text();

            let method = detectMethod(extractTextAfter(infoText, 'метод'));

            let ingredients = prepareIngredients($('.row:nth-child(4) .row div:last-child ul').text());
            let dish = detectDish(extractTextAfter(infoText, 'бокал'));
            let garnish = extractTextAfter(infoText, 'гарнир');

            link.drinkTime = drinkTime;
            link.method = method;
            link.ingredients = ingredients;
            link.dish = dish;
            link.ibaLink = ibaLink;
        }));
    }));

    fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'ingredients.json'), JSON.stringify(INGREDIENTS));
    // fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'dish.json'), JSON.stringify(Object.keys(DISH).reduce((acc, key) => {
    //     acc[key] = key;
    //
    //     return acc;
    // }, {})));
    // fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'methods.json'), JSON.stringify(METHODS.reduce((acc, key) => {
    //     acc[key] = key;
    //
    //     return acc;
    // }, {})));
    // fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'drink_times.json'), JSON.stringify(DRINK_TIMES));
    fs.writeFileSync(path.join(process.cwd(), 'cocktails', 'cocktails1.json'), JSON.stringify(categories.reduce((acc, curr) => {
        acc[curr.en] = curr;

        return acc;
    }, {})));
}

main();
