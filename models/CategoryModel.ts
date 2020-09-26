import { MongoCollection } from "./MongoCollection";
import { ICategory } from "../interfaces/ICategory";
import { ObjectId } from "mongodb";

export class CategoryModel extends MongoCollection<ICategory> {
    constructor(collectionName: string = 'categories') {
        super(collectionName);
    }

    public async InsertOne(val: ICategory) {
        try {
            const result = await this.collection.insertOne(val);
            return result.insertedId;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async InsertMany(vals: ICategory[]) {
        try {
            const result = await this.collection.insertMany(vals);
            return result.insertedCount;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async GetIds(): Promise<ObjectId[] | null> {
        try {
            const result: any[] = await this.collection.find({}, {
                projection: {
                    _id: 1
                }
            }).toArray();
            return result.map(i => i._id);
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}