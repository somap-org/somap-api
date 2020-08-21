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
    getActivies(activityId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            return yield Activity_1.ActivityModel.find({ place: activityId }).skip(startIndex).limit(endIndex);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aXZpdHlSZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9BY3Rpdml0eVJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBd0M7QUFDeEMsaURBQWlEO0FBR2pELE1BQWEsa0JBQWtCO0lBQzNCO1FBQ0ksaUJBQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVLLFdBQVcsQ0FBQyxRQUFROztZQUN0QixPQUFPLE1BQU0sd0JBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUFBO0lBRUssV0FBVyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSzs7WUFDckMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7WUFDOUIsT0FBTyxNQUFNLHdCQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxRixDQUFDO0tBQUE7SUFFSyxXQUFXLENBQUMsVUFBVTs7WUFDeEIsT0FBTyxNQUFNLHdCQUFhLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQztLQUFBO0lBRUssWUFBWSxDQUFDLFVBQVUsRUFBRSxRQUFROztZQUNuQyxPQUFPLE1BQU0sd0JBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUMsRUFBRSxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDO0tBQUE7SUFFSyxjQUFjLENBQUMsVUFBVTs7WUFDM0IsT0FBTyx3QkFBYSxDQUFDLGdCQUFnQixDQUFDLEVBQUMsR0FBRyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztLQUFBO0NBR0o7QUE1QkQsZ0RBNEJDIn0=