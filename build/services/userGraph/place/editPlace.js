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
exports.main = void 0;
const ResponseManager_1 = require("../../../libs/ResponseManager");
const SecurityManager_1 = require("../../../libs/SecurityManager");
const UserRepository_1 = require("../../../repositories/UserRepository");
const PlaceRepository_1 = require("../../../repositories/PlaceRepository");
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new PlaceRepository_1.PlaceRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const placeId = event.pathParameters.placeId;
        const body = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCamPlaceOwner()))
            return responseManager.send(401);
        let newPlace = {
            name: body.name,
            description: body.description,
            address: body.address,
            location: {
                type: 'Point',
                coordinates: [
                    body.coordinates.longitude,
                    body.coordinates.latitude
                ]
            }
        };
        try {
            let place = yield repo.editPlace(placeId, newPlace);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdFBsYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC9wbGFjZS9lZGl0UGxhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxtRUFBNEQ7QUFDNUQsbUVBQThEO0FBQzlELHlFQUFvRTtBQUNwRSwyRUFBc0U7QUFNdEUsU0FBc0IsSUFBSSxDQUFDLEtBQUs7O1FBQzVCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQ2pDLElBQUksUUFBUSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ3BDLElBQUksZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7UUFHN0MsTUFBTSxJQUFJLEdBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUMsSUFBRyxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUEsSUFBSSxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtZQUNwRixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHckMsSUFBSSxRQUFRLEdBQUc7WUFDWCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7WUFDN0IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLFFBQVEsRUFBRTtnQkFDTixJQUFJLEVBQUUsT0FBTztnQkFDYixXQUFXLEVBQUU7b0JBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTO29CQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVE7aUJBQzVCO2FBQ0o7U0FDSixDQUFDO1FBRUYsSUFBSTtZQUNBLElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFFcEQsTUFBTSxhQUFhLEdBQVM7Z0JBQ3hCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQkFDaEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM5QixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87Z0JBQ3RCLFdBQVcsRUFBRTtvQkFDVCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUMzQztnQkFDRCxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDckIsT0FBTyxFQUFFO29CQUNMLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztvQkFDNUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO29CQUNuQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7b0JBQ25DLFlBQVksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQztpQkFDOUM7YUFDSixDQUFDO1lBQ0YsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUNuRDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7U0FDM0M7SUFDTCxDQUFDO0NBQUE7QUFsREQsb0JBa0RDIn0=