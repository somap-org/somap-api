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
    editLiveByLiveId(liveId, live) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Live_1.LiveModel.findOneAndUpdate({ liveId: liveId }, live, { new: true });
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
    deleteLiveByPlaceId(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Live_1.LiveModel.deleteMany({ place: placeId });
        });
    }
}
exports.LiveRepository = LiveRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGl2ZVJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL0xpdmVSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkNBQXdDO0FBQ3hDLHlDQUF5QztBQUd6QyxNQUFhLGNBQWM7SUFDekI7UUFDRSxpQkFBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUssT0FBTyxDQUFDLElBQUk7O1lBQ2hCLE9BQU8sTUFBTSxnQkFBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUk7O1lBQ3pCLE9BQU8sTUFBTSxnQkFBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBQyxFQUFFLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzVFLENBQUM7S0FBQTtJQUVLLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJOztZQUNqQyxPQUFPLE1BQU0sZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsRUFBRSxJQUFJLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUMvRSxDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsT0FBTzs7WUFDcEIsT0FBTyxNQUFNLGdCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLE1BQU07O1lBQ2xCLE9BQU8sTUFBTSxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUM7S0FBQTtJQUVLLFVBQVUsQ0FBQyxNQUFjOztZQUM3QixPQUFPLGdCQUFTLENBQUMsU0FBUyxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUFBO0lBRUssbUJBQW1CLENBQUMsT0FBTzs7WUFDL0IsT0FBTyxnQkFBUyxDQUFDLFVBQVUsQ0FBQyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUM7S0FBQTtDQUVGO0FBakNELHdDQWlDQyJ9