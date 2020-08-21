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
                        $geometry: { type: "Point", coordinates: [latitude, longitude] },
                        $maxDistance: range
                    }
                }
            });
            return places;
        });
    }
}
exports.PlaceRepository = PlaceRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhY2VSZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9QbGFjZVJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBd0M7QUFDeEMsMkNBQWtEO0FBR2xELE1BQWEsZUFBZTtJQUN4QjtRQUNJLGlCQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFSyxRQUFRLENBQUMsT0FBZTs7WUFDMUIsT0FBTyxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7S0FBQTtJQUVLLFFBQVEsQ0FBQyxLQUFLOztZQUNoQixPQUFPLE1BQU0sa0JBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsQ0FBQztLQUFBO0lBRUssU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLOztZQUMxQixPQUFPLE1BQU0sa0JBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUMsRUFBRSxLQUFLLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNqRixDQUFDO0tBQUE7SUFFSyxXQUFXLENBQUMsT0FBZTs7WUFDN0IsT0FBTyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUM7S0FBQTtJQUVLLFNBQVMsQ0FBQyxRQUFnQixFQUFFLFNBQWlCLEVBQUUsS0FBYTs7WUFDOUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxrQkFBVSxDQUFDLElBQUksQ0FBQztnQkFDL0IsUUFBUSxFQUFFO29CQUNOLEtBQUssRUFBRTt3QkFDSCxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFHLFdBQVcsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsRUFBRTt3QkFDakUsWUFBWSxFQUFFLEtBQUs7cUJBQ3RCO2lCQUNKO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQztLQUFBO0NBQ0o7QUFoQ0QsMENBZ0NDIn0=