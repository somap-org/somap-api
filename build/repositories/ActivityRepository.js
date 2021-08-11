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
            var start = new Date();
            start.setUTCHours(0, 0, 0, 0);
            var end = new Date();
            end.setUTCHours(23, 59, 59, 999);
            console.log({
                place: placeId,
                date: {
                    $gte: start,
                    $lte: end
                }
            });
            switch (type) {
                case 'onging': {
                    return Activity_1.ActivityModel.find({
                        place: placeId,
                        $and: [
                            {
                                date: {
                                    $gte: start,
                                }
                            },
                            {
                                date: {
                                    $lte: end,
                                }
                            }
                        ]
                    }).skip(startIndex).limit(endIndex);
                    break;
                }
                case 'scheduled': {
                    return Activity_1.ActivityModel.find({ place: placeId, date: { $gte: new Date() } }).skip(startIndex).limit(endIndex);
                    break;
                }
                case 'past': {
                    return Activity_1.ActivityModel.find({ place: placeId, date: { $lte: new Date() } }).skip(startIndex).limit(endIndex);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aXZpdHlSZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9BY3Rpdml0eVJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBd0M7QUFDeEMsaURBQWlEO0FBR2pELE1BQWEsa0JBQWtCO0lBQzdCO1FBQ0UsaUJBQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVLLFdBQVcsQ0FBQyxRQUFROztZQUN4QixPQUFPLE1BQU0sd0JBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQztLQUFBO0lBRUssV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUs7O1lBQzFDLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUN0QyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFFdkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUN2QixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTlCLElBQUksR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDckIsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDO2dCQUNWLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRTtvQkFDSixJQUFJLEVBQUUsS0FBSztvQkFDWCxJQUFJLEVBQUUsR0FBRztpQkFDVjthQUNGLENBQUMsQ0FBQztZQUNILFFBQVEsSUFBSSxFQUFFO2dCQUNaLEtBQUssUUFBUSxDQUFDLENBQUM7b0JBQ2IsT0FBTyx3QkFBYSxDQUFDLElBQUksQ0FBQzt3QkFDeEIs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