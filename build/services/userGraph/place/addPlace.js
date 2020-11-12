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
exports.deletePlace = exports.main = void 0;
const ResponseManager_1 = require("../../../libs/ResponseManager");
const PlaceRepository_1 = require("../../../repositories/PlaceRepository");
const SecurityManager_1 = require("../../../libs/SecurityManager");
const UserRepository_1 = require("../../../repositories/UserRepository");
function main(event) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new PlaceRepository_1.PlaceRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const requestPlace = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCam()))
            return responseManager.send(401);
        let userLogged = yield userRepo.getUserByCognitoId((_b = (_a = event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId);
        let addPlace = {
            name: requestPlace.name,
            description: requestPlace.description,
            address: requestPlace.address,
            location: {
                type: 'Point',
                coordinates: [
                    requestPlace.coordinates.longitude,
                    requestPlace.coordinates.latitude
                ]
            },
            camUser: userLogged['_id']
        };
        try {
            let place = yield repo.addPlace(addPlace);
            const responsePlace = {
                name: place.name,
                description: place.description,
                address: place.address,
                coordinates: {
                    latitude: place.location.coordinates[1],
                    longitude: place.location.coordinates[0]
                },
                placeId: place['_id']
            };
            return responseManager.send(200, responsePlace);
        }
        catch (err) {
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
function deletePlace(placeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let repo = new PlaceRepository_1.PlaceRepository();
        try {
            yield repo.deletePlace(placeId);
            return true;
        }
        catch (e) {
            return null;
        }
    });
}
exports.deletePlace = deletePlace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkUGxhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvdXNlckdyYXBoL3BsYWNlL2FkZFBsYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsbUVBQTREO0FBQzVELDJFQUFzRTtBQUV0RSxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBS3BFLFNBQXNCLElBQUksQ0FBQyxLQUFLOzs7UUFDOUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDakMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUczRCxNQUFNLFlBQVksR0FBVSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUduRCxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtZQUM3RSxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkMsSUFBSSxVQUFVLEdBQUcsTUFBTSxRQUFRLENBQUMsa0JBQWtCLGFBQUMsS0FBSyxDQUFDLGNBQWMsMENBQUUsUUFBUSwwQ0FBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBR3RHLElBQUksUUFBUSxHQUFHO1lBQ2IsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJO1lBQ3ZCLFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVztZQUNyQyxPQUFPLEVBQUUsWUFBWSxDQUFDLE9BQU87WUFDN0IsUUFBUSxFQUFFO2dCQUNSLElBQUksRUFBRSxPQUFPO2dCQUNiLFdBQVcsRUFBRTtvQkFDWCxZQUFZLENBQUMsV0FBVyxDQUFDLFNBQVM7b0JBQ2xDLFlBQVksQ0FBQyxXQUFXLENBQUMsUUFBUTtpQkFDbEM7YUFDRjtZQUNELE9BQU8sRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDO1NBQzNCLENBQUM7UUFFRixJQUFJO1lBQ0YsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRTFDLE1BQU0sYUFBYSxHQUFVO2dCQUMzQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDOUIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO2dCQUN0QixXQUFXLEVBQUU7b0JBQ1gsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztpQkFDekM7Z0JBQ0QsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7YUFDdEIsQ0FBQztZQUVGLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDakQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1NBQ3pDOztDQUNGO0FBaERELG9CQWdEQztBQUVELFNBQXNCLFdBQVcsQ0FBQyxPQUFlOztRQUMvQyxJQUFJLElBQUksR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztRQUNqQyxJQUFJO1lBQ0YsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFFSCxDQUFDO0NBQUE7QUFURCxrQ0FTQyJ9