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
const ActivityRepository_1 = require("../../../repositories/ActivityRepository");
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'us-east-1' });
const signedUrlExpiresSeconds = 60 * 10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new ActivityRepository_1.ActivityRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const placeId = event.pathParameters.placeId;
        const activityId = event.pathParameters.activityId;
        const requestActivity = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCam()) || !(yield securityManager.isUserCamPlaceOwner()))
            return responseManager.send(401);
        let editActivity = {
            name: requestActivity.name,
            description: requestActivity.description,
            date: requestActivity.date,
            place: placeId
        };
        try {
            let activity = yield repo.editActivity(activityId, editActivity);
            let presignedUrl = null;
            if (activity.thumbnail) {
                const params = {
                    Bucket: process.env.PHOTOS_BUCKET_S3,
                    Key: activity.thumbnail,
                    Expires: signedUrlExpiresSeconds
                };
                presignedUrl = yield s3.getSignedUrl('getObject', params);
            }
            const response = {
                activityId: activity['_id'],
                placeId: activity['place'].toString(),
                name: activity.name,
                description: activity.description,
                date: activity.date,
                thumbnail: presignedUrl
            };
            return responseManager.send(200, response);
        }
        catch (err) {
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdEFjdGl2aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnRlbnQvYWN0aXZpdHkvZWRpdEFjdGl2aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsbUVBQTREO0FBRzVELG1FQUE4RDtBQUM5RCx5RUFBb0U7QUFHcEUsaUZBQTRFO0FBRTVFLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBQy9ELE1BQU0sdUJBQXVCLEdBQUcsRUFBRSxHQUFDLEVBQUUsQ0FBQztBQUN0QyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUtwRCxTQUFzQixJQUFJLENBQUMsS0FBSzs7UUFDNUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQ3BDLElBQUksUUFBUSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ3BDLElBQUksZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0QsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUM7UUFDN0MsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7UUFHbkQsTUFBTSxlQUFlLEdBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFHeEQsSUFBRyxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUEsSUFBSSxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUEsSUFBSSxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtZQUMxSCxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFHckMsSUFBSSxZQUFZLEdBQUc7WUFDZixJQUFJLEVBQUUsZUFBZSxDQUFDLElBQUk7WUFDMUIsV0FBVyxFQUFFLGVBQWUsQ0FBQyxXQUFXO1lBQ3hDLElBQUksRUFBRSxlQUFlLENBQUMsSUFBSTtZQUMxQixLQUFLLEVBQUUsT0FBTztTQUNqQixDQUFDO1FBRUYsSUFBSTtZQUNBLElBQUksUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFakUsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ3hCLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTtnQkFDcEIsTUFBTSxNQUFNLEdBQUc7b0JBQ1gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCO29CQUNwQyxHQUFHLEVBQUUsUUFBUSxDQUFDLFNBQVM7b0JBQ3ZCLE9BQU8sRUFBRSx1QkFBdUI7aUJBQ25DLENBQUM7Z0JBQ0YsWUFBWSxHQUFHLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDN0Q7WUFFRCxNQUFNLFFBQVEsR0FBWTtnQkFDdEIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQzNCLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUNyQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ25CLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVztnQkFDakMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO2dCQUNuQixTQUFTLEVBQUUsWUFBWTthQUMxQixDQUFDO1lBRUYsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM5QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFDLEdBQUcsRUFBQyxDQUFDLENBQUM7U0FDM0M7SUFDTCxDQUFDO0NBQUE7QUFqREQsb0JBaURDIn0=