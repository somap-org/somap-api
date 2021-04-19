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
    let stageName = process.env.STAGE || 'test';
    const uri = "mongodb://admin:XXIFBvTuizWIgWvw@somapcial-shard-00-00-qhoqb.mongodb.net:27017,somapcial-shard-00-01-qhoqb.mongodb.net:27017,somapcial-shard-00-02-qhoqb.mongodb.net:27017/somap-" + stageName + "?ssl=true&replicaSet=soMapCial-shard-0&authSource=admin&retryWrites=true&w=majority";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29kYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWJzL21vbmdvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBcUM7QUFDckMsSUFBSSxRQUE2QixDQUFDO0FBQ3JCLFFBQUEsT0FBTyxHQUFHLEdBQUcsRUFBRTtJQUd4QixJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUM7SUFDNUMsTUFBTSxHQUFHLEdBQUcsbUxBQW1MLEdBQUMsU0FBUyxHQUFDLHFGQUFxRixDQUFDO0lBQ2hTLElBQUksUUFBUSxFQUFFO1FBQ1YsT0FBTztLQUNWO0lBQ0QsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUU7UUFDbEIsZUFBZSxFQUFFLElBQUk7UUFDckIsa0JBQWtCLEVBQUUsSUFBSTtRQUN4QixjQUFjLEVBQUUsSUFBSTtRQUNwQixnQkFBZ0IsRUFBRSxJQUFJO0tBQ3pCLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLE9BQU87SUFDWCxDQUFDLENBQUMsQ0FBQztJQUNILFFBQVEsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBQy9CLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQVMsRUFBRTtJQUVqQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQUNXLFFBQUEsVUFBVSxHQUFHLEdBQUcsRUFBRTtJQUMzQixJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ1gsT0FBTztLQUNWO0lBQ0QsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzFCLENBQUMsQ0FBQyJ9