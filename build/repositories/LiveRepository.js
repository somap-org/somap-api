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
exports.LiveRepository = void 0;
const mongodb_1 = require("../libs/mongodb");
const Live_1 = require("../models/Live");
class LiveRepository {
    constructor() {
        mongodb_1.connect();
    }
    addLive(live) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Live_1.LiveModel.create(live);
        });
    }
    editLive(liveId, live) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Live_1.LiveModel.findOneAndUpdate({ _id: liveId }, live, { new: true });
        });
    }
    getLives(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Live_1.LiveModel.find({ place: placeId });
        });
    }
    getLive(liveId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Live_1.LiveModel.findOne({ _id: liveId });
        });
    }
    deleteLive(liveId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Live_1.LiveModel.deleteOne({ _id: liveId });
        });
    }
}
exports.LiveRepository = LiveRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGl2ZVJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL0xpdmVSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkNBQXdDO0FBQ3hDLHlDQUF5QztBQUd6QyxNQUFhLGNBQWM7SUFDdkI7UUFDSSxpQkFBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUssT0FBTyxDQUFDLElBQUk7O1lBQ2QsT0FBTyxNQUFNLGdCQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7S0FBQTtJQUVLLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSTs7WUFDdkIsT0FBTyxNQUFNLGdCQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLE9BQU87O1lBQ2xCLE9BQU8sTUFBTSxnQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxNQUFNOztZQUNoQixPQUFPLE1BQU0sZ0JBQVMsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFFSyxVQUFVLENBQUMsTUFBYzs7WUFDM0IsT0FBTyxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FBQTtDQUdKO0FBMUJELHdDQTBCQyJ9