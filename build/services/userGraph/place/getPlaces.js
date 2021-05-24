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
                const params = { Bucket: process.env.PHOTOS_BUCKET_S3, Key: place.camUser['profileImage'], Expires: signedUrlExpiresSeconds };
                const presignedUrl = yield s3.getSignedUrl('getObject', params);
                response.push({
                    placeId: place['_id'],
                    name: place.name,
                    description: place.description,
                    address: place.address,
                    coordinates: coordinates,
                    userCam: {
                        userId: place.camUser['_id'],
                        userType: place.camUser['userType'],
                        username: place.camUser['username'],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UGxhY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC9wbGFjZS9nZXRQbGFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxtRUFBNEQ7QUFDNUQsMkVBQXNFO0FBR3RFLG1FQUE4RDtBQUM5RCx5RUFBb0U7QUFFcEUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLFdBQVcsRUFBQyxDQUFDLENBQUM7QUFDL0QsTUFBTSx1QkFBdUIsR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDO0FBQ3RDLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBS3BELFNBQXNCLElBQUksQ0FBQyxLQUFLOzs7UUFDOUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDakMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzRCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBR25CLElBQUksUUFBUSxHQUFHLFVBQVUsT0FBQyxLQUFLLENBQUMscUJBQXFCLDBDQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLElBQUksU0FBUyxHQUFHLFVBQVUsT0FBQyxLQUFLLENBQUMscUJBQXFCLDBDQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ25FLElBQUksS0FBSyxHQUFHLFFBQVEsT0FBQyxLQUFLLENBQUMscUJBQXFCLDBDQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXpELElBQUksQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFBO1lBQ3ZDLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxJQUFJO1lBQ0YsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUQsSUFBSSxRQUFRLEdBQVcsSUFBSSxLQUFLLEVBQVMsQ0FBQztZQUUxQyxLQUFLLE1BQU0sS0FBSyxJQUFJLE1BQU0sRUFBRTtnQkFDMUIsSUFBSSxXQUFXLEdBQXFCO29CQUNsQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUN6QyxDQUFDO2dCQUVGLE1BQU0sTUFBTSxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFDLENBQUM7Z0JBQzdILE1BQU0sWUFBWSxHQUFXLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRXhFLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQ1osT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7b0JBQ3JCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtvQkFDaEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO29CQUM5QixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87b0JBQ3RCLFdBQVcsRUFBRSxXQUFXO29CQUN4QixPQUFPLEVBQUU7d0JBQ1AsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO3dCQUM1QixRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7d0JBQ25DLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQzt3QkFDbkMsWUFBWSxFQUFFLFlBQVk7cUJBQzNCO2lCQUNGLENBQUMsQ0FBQzthQUNKO1lBQ0QsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM1QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQztTQUN6Qzs7Q0FDRjtBQWhERCxvQkFnREMifQ==