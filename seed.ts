import { ObjectId } from 'mongodb';
import Faker from 'faker';
import { Database } from './database/Database';
import { CategoryModel } from './models/CategoryModel';
import { Config } from './config/config';
import { ProductModel } from './models/ProductModel';

const catArg = process.argv.filter(i => i.startsWith('CategoryCount'))[0];
const proArg = process.argv.filter(i => i.startsWith('ProductCount'))[0];

const insertCatFlag = process.argv.filter(i => i.startsWith('InsertCat'))[0] === 'InsertCat=true';
const insertProductFlag = process.argv.filter(i => i.startsWith('InsertProduct'))[0] === 'InsertProduct=true';


function getRandomCategories(catArr: ObjectId[], count: number) {
    const randIn = getRandomInRange(1, catArr.length - count);
    return catArr.slice(randIn, randIn + getRandomInRange(1, count));
}

function getRandomInRange(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomProductSpecificFieldObject(max: number) {
    let obj: any = {};
    for (let i = 0; i < max; i++) {
        const rand = getRandomInRange(0, 1)
        if (rand === 0) {
            obj[Faker.commerce.productAdjective()] = getRandomInRange(0, 125000);
        } else {
            obj[Faker.commerce.productAdjective()] = Faker.commerce.productMaterial();
        }
    }
    return obj;
}

function getRandomImages(max: number) {
    let obj: string[] = [];
    for (let i = 0; i < max; i++) {
        obj.push(Faker.image.cats())
    }
    return obj;
}

if (proArg && catArg) {
    const cats = [];
    const prods = [];
    const catCount = parseInt((catArg.split('=')[1]));
    const productCount = parseInt((proArg.split('=')[1]));

    (async () => {
        const catModel = new CategoryModel();
        const proModel = new ProductModel('products');
        const seedcodeDB = new Database(Config.DBName, Config.DBUrl);

        const cdb = await seedcodeDB.connect();        
        await catModel.InitializeCollection(cdb);
        await proModel.InitializeCollection(cdb);
        if (insertCatFlag){
            for (let i = 0; i < catCount; i++) {
                cats.push({
                    Name: Faker.random.alpha({ count: 10 }),
                    Image: Faker.image.avatar(),
                    _id: new ObjectId()
                })
            }
            const data = await catModel.InsertMany(cats);
            console.log('[Seed] Inserted: ' + data + ' Categories')
        }
            
        if (insertProductFlag) {
            const Ids = await catModel.GetIds()
            if (Ids) {
                for (let i = 0; i < productCount; i++) {
                    prods.push({
                        _id: new ObjectId(),
                        Name: Faker.commerce.productName(),
                        Description: Faker.commerce.productDescription(),
                        Price: parseFloat(Faker.commerce.price(0, 125000)),
                        Rating: getRandomInRange(0, 10),
                        DiscountRate:  getRandomInRange(0, 10),
                        Categories: getRandomCategories(Ids, 4),
                        ProductSpecificFields: getRandomProductSpecificFieldObject(getRandomInRange(1, 5)),
                        Images: getRandomImages(getRandomInRange(1, 5)),
                        Color: Faker.commerce.color(),
                        Brand: Faker.company.companyName()
                    })
                }
                const data = await proModel.InsertMany(prods);
                console.log('[Seed] Inserted: ' + data + ' Products')
            }
        }

        await catModel.Destroy();
        await proModel.Destroy();
        await seedcodeDB.disconnect();
        process.exit(0)

    })()
}