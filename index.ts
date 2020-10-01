import express from 'express';
import cors from 'cors';
import * as bodyParser from "body-parser";

import { Config } from './config/config';
import { Database } from './database/Database';

import { CategoryModel } from './models/CategoryModel';
import { categoryRouter } from './controllers/category.controller';
import { productRouter } from './controllers/product.controller';
import { ProductModel } from './models/ProductModel';

export const catModel = new CategoryModel();
export const proModel = new ProductModel();
export const seedcodeDB = new Database(Config.DBName, Config.DBUrl);

export class SeedcodeService {
    static server: express.Application;

    private static registerRoutes() {
        this.server.use(productRouter);
        this.server.use(categoryRouter);
    }

    private static registerMiddleware() {
        // this.server.use(cors());
        this.server.use(bodyParser.json({ limit: '10mb' }));
        this.server.use(bodyParser.urlencoded({ extended: true }));
        // this.server.use('/public', express.static('public'));
    }

    public static async StartServer() {
        const cdb = await seedcodeDB.connect();
        await catModel.InitializeCollection(cdb);
        await proModel.InitializeCollection(cdb);
        SeedcodeService.server = express();
        SeedcodeService.registerMiddleware();
        SeedcodeService.registerRoutes();
        SeedcodeService.server.listen(Config.PORT, () => {
            console.log('[Seedcode Service] Listening on port: '+ Config.PORT);
        })
    }
}

(async() => {
    await SeedcodeService.StartServer();
})();
