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
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new PlaceRepository_1.PlaceRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const requestPlace = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCam()))
            return responseManager.send(401);
        let userLogged = yield userRepo.getUserByCognitoId((_b = (_a = event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider.toString().slice(((_d = (_c = event.requestContext) === null || _c === void 0 ? void 0 : _c.identity) === null || _d === void 0 ? void 0 : _d.cognitoAuthenticationProvider.toString().lastIndexOf(':')) + 1));
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
                placeId: place['_id'],
                userCam: {
                    userId: place.camUser['_id'],
                    userType: place.camUser['userType'],
                    username: place.camUser['username'],
                    profileImage: place.camUser['profileImage']
                }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkUGxhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvdXNlckdyYXBoL3BsYWNlL2FkZFBsYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsbUVBQTREO0FBQzVELDJFQUFzRTtBQUV0RSxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBS3BFLFNBQXNCLElBQUksQ0FBQyxLQUFLOzs7UUFDOUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDakMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUczRCxNQUFNLFlBQVksR0FBVSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUduRCxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtZQUM3RSxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkMsSUFBSSxVQUFVLEdBQUcsTUFBTSxRQUFRLENBQUMsa0JBQWtCLGFBQUMsS0FBSyxDQUFDLGNBQWMsMENBQUUsUUFBUSwwQ0FBRSw2QkFBNkIsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLGFBQUEsS0FBSyxDQUFDLGNBQWMsMENBQUUsUUFBUSwwQ0FBRSw2QkFBNkIsQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUcsS0FBRSxDQUFDLEVBQUUsQ0FBQztRQUdoTyxJQUFJLFFBQVEsR0FBRztZQUNiLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSTtZQUN2QixXQUFXLEVBQUUsWUFBWSxDQUFDLFdBQVc7WUFDckMsT0FBTyxFQUFFLFlBQVksQ0FBQyxPQUFPO1lBQzdCLFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsT0FBTztnQkFDYixXQUFXLEVBQUU7b0JBQ1gsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTO29CQUNsQyxZQUFZLENBQUMsV0FBVyxDQUFDLFFBQVE7aUJBQ2xDO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQztTQUMzQixDQUFDO1FBRUYsSUFBSTtZQUNGLElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUUxQyxNQUFNLGFBQWEsR0FBVTtnQkFDM0IsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dCQUNoQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7Z0JBQzlCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsV0FBVyxFQUFFO29CQUNYLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQ3pDO2dCQUNELE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUNyQixPQUFPLEVBQUU7b0JBQ1AsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO29CQUM1QixRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7b0JBQ25DLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztvQkFDbkMsWUFBWSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO2lCQUM1QzthQUNGLENBQUM7WUFFRixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ2pEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQztTQUN6Qzs7Q0FDRjtBQXRERCxvQkFzREM7QUFFRCxTQUFzQixXQUFXLENBQUMsT0FBZTs7UUFDL0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDakMsSUFBSTtZQUNGLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoQyxPQUFPLElBQUksQ0FBQztTQUNiO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQztTQUNiO0lBRUgsQ0FBQztDQUFBO0FBVEQsa0NBU0MifQ==