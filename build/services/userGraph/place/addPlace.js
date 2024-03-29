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
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'us-east-1' });
const signedUrlExpiresSeconds = 60 * 10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new PlaceRepository_1.PlaceRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const requestPlace = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCam()))
            return responseManager.send(401);
        let userLogged = yield userRepo.getUserByCognitoId(yield securityManager.getCognitoId());
        let addPlace = {
            name: requestPlace.name,
            description: requestPlace.description,
            address: requestPlace.address,
            location: {
                type: 'Point',
                coordinates: [
                    parseFloat(requestPlace.coordinates.longitude.toString()),
                    parseFloat(requestPlace.coordinates.latitude.toString())
                ]
            },
            camUser: userLogged['_id']
        };
        try {
            let place = yield repo.addPlace(addPlace);
            let presignedUrl = null;
            if (place.camUser['publicProfile']['profileImage']) {
                const params = {
                    Bucket: process.env.PHOTOS_BUCKET_S3,
                    Key: place.camUser['publicProfile']['profileImage'],
                    Expires: signedUrlExpiresSeconds
                };
                presignedUrl = yield s3.getSignedUrl('getObject', params);
            }
            const responsePlace = {
                name: place.name,
                description: place.description,
                currentLiveUrl: place.currentLiveUrl,
                address: place.address,
                coordinates: {
                    latitude: place.location.coordinates[1],
                    longitude: place.location.coordinates[0]
                },
                placeId: place['_id'],
                userCam: {
                    userId: place.camUser['_id'],
                    userType: place.camUser['userType'],
                    username: place.camUser['publicProfile']['username'],
                    profileImage: presignedUrl
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkUGxhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvdXNlckdyYXBoL3BsYWNlL2FkZFBsYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsbUVBQTREO0FBQzVELDJFQUFzRTtBQUV0RSxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBQ3BFLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBQy9ELE1BQU0sdUJBQXVCLEdBQUcsRUFBRSxHQUFDLEVBQUUsQ0FBQztBQUN0QyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUtwRCxTQUFzQixJQUFJLENBQUMsS0FBSzs7UUFDOUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDakMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUczRCxNQUFNLFlBQVksR0FBVSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUduRCxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtZQUM3RSxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFF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