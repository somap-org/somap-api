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
    getActivies(placeId, type, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
            switch (type) {
                case 'onging': {
                    return yield Activity_1.ActivityModel.find({ place: placeId }).skip(startIndex).limit(endIndex);
                    break;
                }
                case 'scheduled': {
                    return yield Activity_1.ActivityModel.find({ place: placeId }).skip(startIndex).limit(endIndex);
                    break;
                }
                case 'past': {
                    return yield Activity_1.ActivityModel.find({ place: placeId }).skip(startIndex).limit(endIndex);
                    break;
                }
                default: {
                    return yield Activity_1.ActivityModel.find({ place: placeId }).skip(startIndex).limit(endIndex);
                    break;
                }
            }
        });
    }
    searchByQuery(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
            let regex = new RegExp(query, 'i');
            if (query === "ALLENTITIES")
                return Activity_1.ActivityModel.find().skip(startIndex).limit(endIndex);
            return Activity_1.ActivityModel.find({
                $or: [
                    {
                        name: regex
                    },
                    {
                        description: regex
                    }
                ]
            }).skip(startIndex).limit(endIndex);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aXZpdHlSZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9BY3Rpdml0eVJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBd0M7QUFDeEMsaURBQWlEO0FBR2pELE1BQWEsa0JBQWtCO0lBQzNCO1FBQ0ksaUJBQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVLLFdBQVcsQ0FBQyxRQUFROztZQUN0QixPQUFPLE1BQU0sd0JBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUFBO0lBRUssV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUs7O1lBQ3hDLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUN0QyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdkIsUUFBUSxJQUFJLEVBQUU7Z0JBQ1YsS0FBSyxRQUFRLENBQUMsQ0FBQztvQkFDWCxPQUFPLE1BQU0sd0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNuRixNQUFNO2lCQUNUO2dCQUNELEtBQUssV0FBVyxDQUFDLENBQUM7b0JBQ2QsT0FBTyxNQUFNLHdCQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbkYsTUFBTTtpQkFDVDtnQkFDRCxLQUFLLE1BQU0sQ0FBQyxDQUFDO29CQUNULE9BQU8sTUFBTSx3QkFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ25GLE1BQU07aUJBQ1Q7Z0JBQ0QsT0FBTyxDQUFDLENBQUM7b0JBQ0wsT0FBTyxNQUFNLHdCQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbkYsTUFBTTtpQkFDVDthQUNKO1FBQ0wsQ0FBQztLQUFBO0lBRUssYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSzs7WUFDbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkMsSUFBSSxLQUFLLEtBQUssYUFBYTtnQkFDdkIsT0FBTyx3QkFBYSxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFakUsT0FBTyx3QkFBYSxDQUFDLElBQUksQ0FBQztnQkFDdEIsR0FBRyxFQUFFO29CQUNEO3dCQUNJLElBQUksRUFBRSxLQUFLO3FCQUNkO29CQUNEO3dCQUNJLFdBQVcsRUFBRSxLQUFLO3FCQUNyQjtpQkFDSjthQUNKLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7S0FBQTtJQUVLLFdBQVcsQ0FBQyxVQUFVOztZQUN4QixPQUFPLE1BQU0sd0JBQWEsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDO0tBQUE7SUFFSyxZQUFZLENBQUMsVUFBVSxFQUFFLFFBQVE7O1lBQ25DLE9BQU8sTUFBTSx3QkFBYSxDQUFDLGdCQUFnQixDQUFDLEVBQUMsR0FBRyxFQUFFLFVBQVUsRUFBQyxFQUFFLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzFGLENBQUM7S0FBQTtJQUVLLGNBQWMsQ0FBQyxVQUFVOztZQUMzQixPQUFPLHdCQUFhLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztRQUM3RCxDQUFDO0tBQUE7Q0FHSjtBQWhFRCxnREFnRUMifQ==