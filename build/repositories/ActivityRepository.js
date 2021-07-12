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
exports.ActivityRepository = void 0;
const mongodb_1 = require("../libs/mongodb");
const Activity_1 = require("../models/Activity");
class ActivityRepository {
    constructor() {
        mongodb_1.connect();
    }
    addActivity(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Activity_1.ActivityModel.create(activity);
        });
    }
    getActivies(placeId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
            return yield Activity_1.ActivityModel.find({ place: placeId });
        });
    }
    searchByQuery(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
            let regex = new RegExp(query, 'i');
            return yield Activity_1.ActivityModel.find({ name: regex }).skip(startIndex).limit(endIndex);
        });
    }
    getActivity(activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Activity_1.ActivityModel.findOne({ _id: activityId });
        });
    }
    editActivity(activityId, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Activity_1.ActivityModel.findOneAndUpdate({ _id: activityId }, activity, { new: true });
        });
    }
    deleteActivity(activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Activity_1.ActivityModel.findOneAndDelete({ _id: activityId });
        });
    }
}
exports.ActivityRepository = ActivityRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aXZpdHlSZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9BY3Rpdml0eVJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBd0M7QUFDeEMsaURBQWlEO0FBR2pELE1BQWEsa0JBQWtCO0lBQzNCO1FBQ0ksaUJBQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVLLFdBQVcsQ0FBQyxRQUFROztZQUN0QixPQUFPLE1BQU0sd0JBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUFBO0lBRUssV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSzs7WUFDbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN2QixPQUFPLE1BQU0sd0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDO0tBQUE7SUFFSyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLOztZQUNsQyxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNuQyxPQUFPLE1BQU0sd0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BGLENBQUM7S0FBQTtJQUVLLFdBQVcsQ0FBQyxVQUFVOztZQUN4QixPQUFPLE1BQU0sd0JBQWEsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDO0tBQUE7SUFFSyxZQUFZLENBQUMsVUFBVSxFQUFFLFFBQVE7O1lBQ25DLE9BQU8sTUFBTSx3QkFBYSxDQUFDLGdCQUFnQixDQUFDLEVBQUMsR0FBRyxFQUFFLFVBQVUsRUFBQyxFQUFFLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzFGLENBQUM7S0FBQTtJQUVLLGNBQWMsQ0FBQyxVQUFVOztZQUMzQixPQUFPLHdCQUFhLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztRQUM3RCxDQUFDO0tBQUE7Q0FHSjtBQW5DRCxnREFtQ0MifQ==