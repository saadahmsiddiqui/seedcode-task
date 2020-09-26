import { MongoClient, Db } from "mongodb";


export class Database {
    private dataBase: any;
    private databaseName: string;
    private databaseUrl: string;

    constructor(databaseName: string, databaseUrl: string) {
        this.databaseName = databaseName;
        this.databaseUrl = databaseUrl; 
        this.dataBase = undefined;
    }

    public async connect(): Promise<Db> {

        try {
            if (!this.dataBase) {

                let mongoClient = await this.connectDatabase();
                this.dataBase = mongoClient.db(this.databaseName);
                this.onClose(this.dataBase);

                console.log('\x1b[36m%s\x1b[0m', "connected to Database");
                console.log('\x1b[36m%s\x1b[0m', "Database Name : " + this.dataBase.databaseName);
                return this.dataBase;
            } else return this.dataBase

        } catch (error) {
            console.log(error);
            console.log('Error Database');
            console.log(process.env.NODE_ENV);
            console.log(process.env.DB_ADDRESS);
            throw new Error(error);
        }
    }

    public async onClose(db: any) {
        db.on('close', async (response: any) => {
            console.log('db closed!');
            try {
                this.dataBase.removeAllListeners();
                let mongoClient = await this.connectDatabase();
                this.dataBase = mongoClient.db(this.databaseName);
                console.log("connected to Database ");

                // this.reconnect()
                this.onClose(this.dataBase);
            } catch (err) {
                console.log(err);
                console.log('Reconnection Error!');
            }
        });
    }


    public async connectDatabase(): Promise<any> {
        try {
            let client = await MongoClient.connect(this.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            return client;
        } catch (error) {
            console.log(error)
            console.log('Error Connecting DB');
            let client = await this.connectDatabase()
            return client;
        }
    }


    public disconnect(): void {
        if (this.dataBase) {
            this.dataBase = undefined;
        }
    }
}
