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
            return Place_1.PlaceModel.findOne({ _id: placeId }).populate("camUser");
        });
    }
    getCamUserPlace(loggedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return Place_1.PlaceModel.findOne({ camUser: loggedUser }).populate("camUser");
        });
    }
    addPlace(place) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Place_1.PlaceModel.create(place);
        });
    }
    editPlace(placeId, place) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Place_1.PlaceModel.findOneAndUpdate({ _id: placeId }, place, { new: true }).populate("camUser");
        });
    }
    deletePlace(placeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Place_1.PlaceModel.deleteOne({ _id: placeId }).populate("camUser");
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
            }).populate("camUser");
            return places;
        });
    }
    searchByQuery(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
            let regex = new RegExp(query, 'i');
            if (query === "ALLENTITIES")
                return Place_1.PlaceModel.find();
            return yield Place_1.PlaceModel.find({
                $or: [
                    {
                        name: regex
                    },
                    {
                        description: regex
                    },
                    {
                        address: regex
                    }
                ]
            }).skip(startIndex).limit(endIndex).populate("camUser");
        });
    }
}
exports.PlaceRepository = PlaceRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhY2VSZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JlcG9zaXRvcmllcy9QbGFjZVJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBd0M7QUFDeEMsMkNBQWtEO0FBR2xELE1BQWEsZUFBZTtJQUN4QjtRQUNJLGlCQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFSyxRQUFRLENBQUMsT0FBZTs7WUFDMUIsT0FBTyxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNsRSxDQUFDO0tBQUE7SUFFSyxlQUFlLENBQUMsVUFBVTs7WUFFNUIsT0FBTyxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN6RSxDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsS0FBSzs7WUFDaEIsT0FBTyxNQUFNLGtCQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFDLENBQUM7S0FBQTtJQUVLLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSzs7WUFDMUIsT0FBTyxNQUFNLGtCQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsT0FBTyxFQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JHLENBQUM7S0FBQTtJQUVLLFdBQVcsQ0FBQyxPQUFlOztZQUM3QixPQUFPLGtCQUFVLENBQUMsU0FBUyxDQUFDLEVBQUMsR0FBRyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7S0FBQTtJQUVLLFNBQVMsQ0FBQyxRQUFnQixFQUFFLFNBQWlCLEVBQUUsS0FBYTs7WUFDOUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxrQkFBVSxDQUFDLElBQUksQ0FBQztnQkFDL0IsUUFBUSxFQUFFO29CQUNOLEtBQUssRUFBRTt3QkFDSCxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFHLFdBQVcsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsRUFBRTt3QkFDakUsWUFBWSxFQUFFLEtBQUs7cUJBQ3RCO2lCQUNKO2FBQ0osQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2QixPQUFPLE1BQU0sQ0FBQztRQUNsQixDQUFDO0tBQUE7SUFFSyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLOztZQUNsQyxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVuQyxJQUFJLEtBQUssS0FBSyxhQUFhO2dCQUN2QixPQUFPLGtCQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFN0IsT0FBTyxNQUFNLGtCQUFVLENBQUMsSUFBSSxDQUFDO2dCQUN6QixHQUFHLEVBQUU7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLEtBQUs7cUJBQ2Q7b0JBQ0Q7d0JBQ0ksV0FBVyxFQUFFLEtBQUs7cUJBQ3JCO29CQUNEO3dCQUNJLE9BQU8sRUFBRSxLQUFLO3FCQUNqQjtpQkFDSjthQUNKLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1RCxDQUFDO0tBQUE7Q0FDSjtBQTVERCwwQ0E0REMifQ==