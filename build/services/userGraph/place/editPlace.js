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
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCamPlaceOwner(placeId)))
            return responseManager.send(401);
        let newPlace = {
            name: body.name,
            description: body.description,
            address: body.address,
            location: {
                type: 'Point',
                coordinates: [
                    parseFloat(body.coordinates.longitude.toString()),
                    parseFloat(body.coordinates.latitude.toString())
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdFBsYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC9wbGFjZS9lZGl0UGxhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxtRUFBNEQ7QUFDNUQsbUVBQThEO0FBQzlELHlFQUFvRTtBQUNwRSwyRUFBc0U7QUFNdEUsU0FBc0IsSUFBSSxDQUFDLEtBQUs7O1FBQzVCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQ2pDLElBQUksUUFBUSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ3BDLElBQUksZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7UUFHN0MsTUFBTSxJQUFJLEdBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUMsSUFBRyxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUEsSUFBSSxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDM0YsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR3JDLElBQUksUUFBUSxHQUFHO1lBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixRQUFRLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLE9BQU87Z0JBQ2IsV0FBVyxFQUFFO29CQUNULFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDakQsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUNuRDthQUNKO1NBQ0osQ0FBQztRQUVGLElBQUk7WUFDQSxJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBRXBELE1BQU0sYUFBYSxHQUFTO2dCQUN4QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDOUIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO2dCQUN0QixXQUFXLEVBQUU7b0JBQ1QsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztpQkFDM0M7Z0JBQ0QsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ3JCLE9BQU8sRUFBRTtvQkFDTCxNQUFNLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7b0JBQzVCLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztvQkFDbkMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO29CQUNuQyxZQUFZLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7aUJBQzlDO2FBQ0osQ0FBQztZQUNGLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDbkQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1NBQzNDO0lBQ0wsQ0FBQztDQUFBO0FBbERELG9CQWtEQyJ9