var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.connect = void 0;
const Mongoose = require("mongoose");
let database;
exports.connect = () => {
    const uri = "mongodb://admin:XXIFBvTuizWIgWvw@somapcial-shard-00-00-qhoqb.mongodb.net:27017,somapcial-shard-00-01-qhoqb.mongodb.net:27017,somapcial-shard-00-02-qhoqb.mongodb.net:27017/somap-" + process.env.STAGE + "?ssl=true&replicaSet=soMapCial-shard-0&authSource=admin&retryWrites=true&w=majority";
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
    database.once("open", () => __awaiter(this, void 0, void 0, function* () {
    }));
    database.on("error", () => {
        console.log("Error connecting to database");
    });
};
exports.disconnect = () => {
    if (!database) {
        return;
    }
    Mongoose.disconnect();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29kYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWJzL21vbmdvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBcUM7QUFDckMsSUFBSSxRQUE2QixDQUFDO0FBQ3JCLFFBQUEsT0FBTyxHQUFHLEdBQUcsRUFBRTtJQUd4QixNQUFNLEdBQUcsR0FBRyxtTEFBbUwsR0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBQyxxRkFBcUYsQ0FBQztJQUN4UyxJQUFJLFFBQVEsRUFBRTtRQUNWLE9BQU87S0FDVjtJQUNELFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQ2xCLGVBQWUsRUFBRSxJQUFJO1FBQ3JCLGtCQUFrQixFQUFFLElBQUk7UUFDeEIsY0FBYyxFQUFFLElBQUk7UUFDcEIsZ0JBQWdCLEVBQUUsSUFBSTtLQUN6QixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixPQUFPO0lBQ1gsQ0FBQyxDQUFDLENBQUM7SUFDSCxRQUFRLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztJQUMvQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFTLEVBQUU7SUFFakMsQ0FBQyxDQUFBLENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFDVyxRQUFBLFVBQVUsR0FBRyxHQUFHLEVBQUU7SUFDM0IsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE9BQU87S0FDVjtJQUNELFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUMxQixDQUFDLENBQUMifQ==