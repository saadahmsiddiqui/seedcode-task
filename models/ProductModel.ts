import { MongoCollection } from "./MongoCollection";
import { IProduct } from "../interfaces/IProduct";

export class ProductModel extends MongoCollection<IProduct> {
    constructor(collectionName: string = 'products') {
        super(collectionName);
    }

    public async InsertOne(val: IProduct) {
        try {
            const result = await this.collection.insertOne(val);
            return result.insertedId;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async InsertMany(vals: IProduct[]) {
        try {
            const result = await this.collection.insertMany(vals);
            return result.insertedCount;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

}