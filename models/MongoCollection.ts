import { Db, Collection } from "mongodb";

export class MongoCollection<T> {
    protected database!: Db;
    protected collection!: Collection<T>;
    protected collectionName: string;

    constructor(collectionName: string = '') {
        this.collectionName = collectionName;
    }

    public async InitializeCollection(database: Db) {
        try {
            this.database = database;
            this.collection = await this.database.createCollection(this.collectionName);
            console.log('\x1b[36m%s\x1b[0m', 'Init Collection: '+ this.collectionName)
        } catch (error) {
            console.log(error);
        }
    }

    public async Destroy() {
        (this.database as any) = undefined;
        (this.collection as any) = undefined;
    }


    public async findOne(conditions: any, project: any = {}): Promise<T | null> {
        try {
            const item = await this.collection.findOne(conditions, { fields: project });
            return item;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async find(conditions: any, project: any = {}, sort: any = {}, skip: number = 0, limit: number = 15): Promise<T[] | null> {
        try {
            const items = await this.collection.find(conditions, {
                fields: project,
                sort: sort
            }).skip(skip).limit(limit).toArray();
            return items;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async updateOne(conditions: any, updates: any): Promise<number | null> {
        try {
            const result = await this.collection.updateOne(conditions, updates, { upsert: false });
            return result.result.ok;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async deleteOne(conditions: any): Promise<number | undefined> {
        try {
            const result = await this.collection.deleteOne(conditions);
            return result.deletedCount;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
}


