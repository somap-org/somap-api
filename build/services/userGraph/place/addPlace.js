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
        const requestPlace = event.body;
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCam()))
            return responseManager.send(401);
        let userLogged = yield userRepo.getUserByCognitoId((_b = (_a = event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoIdentityId);
        let addPlace = {
            name: requestPlace.name,
            description: requestPlace.description,
            address: requestPlace.address,
            location: {
                type: 'Point',
                coordinates: {
                    latitude: requestPlace.coordinates.latitude,
                    longitude: requestPlace.coordinates.longitude
                }
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
                    latitude: place.location.coordinates.latitude,
                    longitude: place.location.coordinates.longitude
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkUGxhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvdXNlckdyYXBoL3BsYWNlL2FkZFBsYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsbUVBQTREO0FBQzVELDJFQUFzRTtBQUV0RSxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBS3BFLFNBQXNCLElBQUksQ0FBQyxLQUFLOzs7UUFDNUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDakMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUczRCxNQUFNLFlBQVksR0FBUyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBR3RDLElBQUcsQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFBLElBQUksQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFBO1lBQzFFLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyQyxJQUFJLFVBQVUsR0FBRyxNQUFNLFFBQVEsQ0FBQyxrQkFBa0IsYUFBQyxLQUFLLENBQUMsY0FBYywwQ0FBRSxRQUFRLDBDQUFFLGlCQUFpQixDQUFDLENBQUM7UUFHdEcsSUFBSSxRQUFRLEdBQUc7WUFDWCxJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUk7WUFDdkIsV0FBVyxFQUFFLFlBQVksQ0FBQyxXQUFXO1lBQ3JDLE9BQU8sRUFBRSxZQUFZLENBQUMsT0FBTztZQUM3QixRQUFRLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLE9BQU87Z0JBQ2IsV0FBVyxFQUFFO29CQUNULFFBQVEsRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVE7b0JBQzNDLFNBQVMsRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLFNBQVM7aUJBQ2hEO2FBQ0o7WUFDRCxPQUFPLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQztTQUM3QixDQUFDO1FBRUYsSUFBSTtZQUNBLElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUxQyxNQUFNLGFBQWEsR0FBUztnQkFDeEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dCQUNoQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQzlCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsV0FBVyxFQUFFO29CQUNULFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRO29CQUM3QyxTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUztpQkFDbEQ7Z0JBQ0QsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7YUFDeEIsQ0FBQztZQUVGLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDbkQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1NBQzNDOztDQUNKO0FBaERELG9CQWdEQztBQUVELFNBQXNCLFdBQVcsQ0FBQyxPQUFlOztRQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztRQUNqQyxJQUFJO1lBQ0EsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2hDLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFFTCxDQUFDO0NBQUE7QUFURCxrQ0FTQyJ9