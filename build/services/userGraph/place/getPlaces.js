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
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'us-east-1' });
const signedUrlExpiresSeconds = 60 * 10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
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
                let presignedUrl = null;
                if (place.camUser['publicProfile']['profileImage']) {
                    const params = {
                        Bucket: process.env.PHOTOS_BUCKET_S3,
                        Key: place.camUser['publicProfile']['profileImage'],
                        Expires: signedUrlExpiresSeconds
                    };
                    presignedUrl = yield s3.getSignedUrl('getObject', params);
                }
                response.push({
                    placeId: place['_id'],
                    name: place.name,
                    currentLiveUrl: place.currentLiveUrl,
                    description: place.description,
                    address: place.address,
                    coordinates: coordinates,
                    userCam: {
                        userId: place.camUser['_id'],
                        userType: place.camUser['userType'],
                        username: place.camUser['publicProfile']['username'],
                        profileImage: presignedUrl
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UGxhY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC9wbGFjZS9nZXRQbGFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxtRUFBNEQ7QUFDNUQsMkVBQXNFO0FBR3RFLG1FQUE4RDtBQUM5RCx5RUFBb0U7QUFFcEUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLFdBQVcsRUFBQyxDQUFDLENBQUM7QUFDL0QsTUFBTSx1QkFBdUIsR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDO0FBQ3RDLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBS3BELFNBQXNCLElBQUksQ0FBQyxLQUFLOzs7UUFDOUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDakMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBR25CLElBQUksUUFBUSxHQUFHLFVBQVUsT0FBQyxLQUFLLENBQUMscUJBQXFCLDBDQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLElBQUksU0FBUyxHQUFHLFVBQVUsT0FBQyxLQUFLLENBQUMscUJBQXFCLDBDQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLElBQUksS0FBSyxHQUFHLFFBQVEsT0FBQyxLQUFLLENBQUMscUJBQXFCLDBDQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFBO1lBQ3ZDLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxJQUFJO1lBQ0YsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUQsSUFBSSxRQUFRLEdBQVcsSUFBSSxLQUFLLEVBQVMsQ0FBQztZQUUxQyxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtnQkFDMUIsSUFBSSxXQUFXLEdBQXFCO29CQUNsQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUN6QyxDQUFDO2dCQUVGLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDeEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxFQUFFO29CQUNsRCxNQUFNLE1BQU0sR0FBRzt3QkFDYixNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0I7d0JBQ3BDLEdBQUcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGNBQWMsQ0FBQzt3QkFDbkQsT0FBTyxFQUFFLHVCQUF1QjtxQkFDakMsQ0FBQztvQkFDRixZQUFZLEdBQUcsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDM0Q7Z0JBRUQsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFDWixPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztvQkFDckIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO29CQUNoQixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWM7b0JBQ3BDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztvQkFDOUIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO29CQUN0QixXQUFXLEVBQUUsV0FBVztvQkFDeEIsT0FBTyxFQUFFO3dCQUNQLE1BQU0sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQzt3QkFDNUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO3dCQUNuQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxVQUFVLENBQUM7d0JBQ3BELFlBQVksRUFBRSxZQUFZO3FCQUMzQjtpQkFDRixDQUFDLENBQUM7YUFDSjtZQUNELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDNUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakIsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7U0FDekM7O0NBQ0Y7QUF4REQsb0JBd0RDIn0=