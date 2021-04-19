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
exports.PlaceRepository = void 0;
const mongodb_1 = require("../libs/mongodb");
const Place_1 = require("../models/Place");
class PlaceRepository {
    constructor() {
        mongodb_1.connect();
    }
    getPlace(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Place_1.PlaceModel.findOne({ _id: placeId });
        });
    }
    getCamUserPlace(loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return Place_1.PlaceModel.findOne({ camUser: loggedUser });
        });
    }
    addPlace(place) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Place_1.PlaceModel.create(place);
        });
    }
    editPlace(placeId, place) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Place_1.PlaceModel.findOneAndUpdate({ _id: placeId }, place, { new: true });
        });
    }
    deletePlace(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Place_1.PlaceModel.deleteOne({ _id: placeId });
        });
    }
    getPlaces(latitude, longitude, range) {
        return __awaiter(this, void 0, void 0, function* () {
            let places = yield Place_1.PlaceModel.find({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [longitude, latitude] },
                        $maxDistance: range
                    }
                }
            });
            return places;
        });
    }
    searchByQuery(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
            let regex = new RegExp(query, 'i');
            return yield Place_1.PlaceModel.find({ name: regex }).skip(startIndex).limit(endIndex);
        });
    }
}
exports.PlaceRepository = PlaceRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhY2VSZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9QbGFjZVJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBd0M7QUFDeEMsMkNBQWtEO0FBTWxELE1BQWEsZUFBZTtJQUN4QjtRQUNJLGlCQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFSyxRQUFRLENBQUMsT0FBZTs7WUFDMUIsT0FBTyxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FBQTtJQUVLLGVBQWUsQ0FBQyxVQUFVOztZQUU1QixPQUFPLGtCQUFVLENBQUMsT0FBTyxDQUFDLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLEtBQUs7O1lBQ2hCLE9BQU8sTUFBTSxrQkFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQyxDQUFDO0tBQUE7SUFFSyxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUs7O1lBQzFCLE9BQU8sTUFBTSxrQkFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUMsR0FBRyxFQUFFLE9BQU8sRUFBQyxFQUFFLEtBQUssRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQ2pGLENBQUM7S0FBQTtJQUVLLFdBQVcsQ0FBQyxPQUFlOztZQUM3QixPQUFPLGtCQUFVLENBQUMsU0FBUyxDQUFDLEVBQUMsR0FBRyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUFBO0lBRUssU0FBUyxDQUFDLFFBQWdCLEVBQUUsU0FBaUIsRUFBRSxLQUFhOztZQUM5RCxJQUFJLE1BQU0sR0FBRyxNQUFNLGtCQUFVLENBQUMsSUFBSSxDQUFDO2dCQUMvQixRQUFRLEVBQUU7b0JBQ04sS0FBSyxFQUFFO3dCQUNILFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUcsV0FBVyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxFQUFFO3dCQUNqRSxZQUFZLEVBQUUsS0FBSztxQkFDdEI7aUJBQ0o7YUFDSixDQUFDLENBQUM7WUFDSCxPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDO0tBQUE7SUFFSyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLOztZQUNsQyxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNuQyxPQUFPLE1BQU0sa0JBQVUsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pGLENBQUM7S0FBQTtDQUNKO0FBNUNELDBDQTRDQyJ9