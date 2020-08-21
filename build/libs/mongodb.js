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
    const uri = "mongodb://admin:XXIFBvTuizWIgWvw@somapcial-shard-00-00-qhoqb.mongodb.net:27017,somapcial-shard-00-01-qhoqb.mongodb.net:27017,somapcial-shard-00-02-qhoqb.mongodb.net:27017/" + "somap" + "?ssl=true&replicaSet=soMapCial-shard-0&authSource=admin&retryWrites=true&w=majority";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29kYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWJzL21vbmdvZGIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBcUM7QUFDckMsSUFBSSxRQUE2QixDQUFDO0FBQ3JCLFFBQUEsT0FBTyxHQUFHLEdBQUcsRUFBRTtJQUd4QixNQUFNLEdBQUcsR0FBRyw2S0FBNkssR0FBQyxPQUFPLEdBQUMscUZBQXFGLENBQUM7SUFDeFIsSUFBSSxRQUFRLEVBQUU7UUFDVixPQUFPO0tBQ1Y7SUFDRCxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtRQUNsQixlQUFlLEVBQUUsSUFBSTtRQUNyQixrQkFBa0IsRUFBRSxJQUFJO1FBQ3hCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGdCQUFnQixFQUFFLElBQUk7S0FDekIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsT0FBTztJQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ0gsUUFBUSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDL0IsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBUyxFQUFFO0lBRWpDLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFDSCxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBQ1csUUFBQSxVQUFVLEdBQUcsR0FBRyxFQUFFO0lBQzNCLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDWCxPQUFPO0tBQ1Y7SUFDRCxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDMUIsQ0FBQyxDQUFDIn0=