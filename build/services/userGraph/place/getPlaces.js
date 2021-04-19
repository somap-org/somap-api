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
const PlaceRepository_1 = require("../../../repositories/PlaceRepository");
const SecurityManager_1 = require("../../../libs/SecurityManager");
const UserRepository_1 = require("../../../repositories/UserRepository");
function main(event) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new PlaceRepository_1.PlaceRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        console.log(event);
        let latitude = parseFloat((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.latitude);
        let longitude = parseFloat((_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.longitude);
        let range = parseInt((_c = event.queryStringParameters) === null || _c === void 0 ? void 0 : _c.range);
        if (!(yield securityManager.isUserLogged()))
            return responseManager.send(401);
        try {
            let places = yield repo.getPlaces(latitude, longitude, range);
            let response = new Array();
            for (const place of places) {
                let coordinates = {
                    latitude: place.location.coordinates[1],
                    longitude: place.location.coordinates[0]
                };
                response.push({
                    placeId: place['_id'],
                    name: place.name,
                    description: place.description,
                    address: place.address,
                    coordinates: coordinates,
                });
            }
            return responseManager.send(200, response);
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UGxhY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC9wbGFjZS9nZXRQbGFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxtRUFBNEQ7QUFDNUQsMkVBQXNFO0FBR3RFLG1FQUE4RDtBQUM5RCx5RUFBb0U7QUFNcEUsU0FBc0IsSUFBSSxDQUFDLEtBQUs7OztRQUM1QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztRQUNqQyxJQUFJLFFBQVEsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNwQyxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTNELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFHbkIsSUFBSSxRQUFRLEdBQUcsVUFBVSxPQUFDLEtBQUssQ0FBQyxxQkFBcUIsMENBQUUsUUFBUSxDQUFDLENBQUM7UUFDakUsSUFBSSxTQUFTLEdBQUcsVUFBVSxPQUFDLEtBQUssQ0FBQyxxQkFBcUIsMENBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkUsSUFBSSxLQUFLLEdBQUcsUUFBUSxPQUFDLEtBQUssQ0FBQyxxQkFBcUIsMENBQUUsS0FBSyxDQUFDLENBQUM7UUFFekQsSUFBRyxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDcEMsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXJDLElBQUk7WUFDQSxJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5RCxJQUFJLFFBQVEsR0FBVSxJQUFJLEtBQUssRUFBUyxDQUFDO1lBRXpDLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxFQUFFO2dCQUN4QixJQUFJLFdBQVcsR0FBb0I7b0JBQy9CLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7aUJBQzNDLENBQUM7Z0JBQ0YsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDVixPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDckIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO29CQUNoQixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7b0JBQzlCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztvQkFDdEIsV0FBVyxFQUFFLFdBQVc7aUJBQzNCLENBQUMsQ0FBQzthQUNOO1lBQ0QsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM5QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQztTQUMzQzs7Q0FDSjtBQXRDRCxvQkFzQ0MifQ==