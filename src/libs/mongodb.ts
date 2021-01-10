import * as Mongoose from "mongoose";
let database: Mongoose.Connection;
export const connect = () => {
    // add your own uri below
    //const uri = "mongodb+srv://admin:XXIFBvTuizWIgWvw@somapcial-qhoqb.mongodb.net/"+db;
    let stageName = process.env.STAGE || 'test';
    const uri = "mongodb://admin:XXIFBvTuizWIgWvw@somapcial-shard-00-00-qhoqb.mongodb.net:27017,somapcial-shard-00-01-qhoqb.mongodb.net:27017,somapcial-shard-00-02-qhoqb.mongodb.net:27017/somap-"+stageName+"?ssl=true&replicaSet=soMapCial-shard-0&authSource=admin&retryWrites=true&w=majority";
    if (database) {
        return;
    }
    Mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    }).catch(err => {
        console.error(err);
        return;
    });
    database = Mongoose.connection;
    database.once("open", async () => {
        //console.log("Connected to database");
    });
    database.on("error", () => {
        console.log("Error connecting to database");
    });
};
export const disconnect = () => {
    if (!database) {
        return;
    }
    Mongoose.disconnect();
};
