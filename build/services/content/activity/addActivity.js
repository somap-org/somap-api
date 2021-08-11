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
exports.deleteActivity = exports.main = void 0;
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
        const requestActivity = JSON.parse(event.body);
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCam()) || !(yield securityManager.isUserCamPlaceOwner()))
            return responseManager.send(401);
        let addActivity = {
            name: requestActivity.name,
            description: requestActivity.description,
            date: requestActivity.date,
            thumbnail: requestActivity.thumbnail,
            place: placeId
        };
        try {
            let activity = yield repo.addActivity(addActivity);
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
                date: activity.date.toISOString(),
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
function deleteActivity(activityId) {
    return __awaiter(this, void 0, void 0, function* () {
        let repo = new ActivityRepository_1.ActivityRepository();
        try {
            yield repo.deleteActivity(activityId);
            return true;
        }
        catch (e) {
            return null;
        }
    });
}
exports.deleteActivity = deleteActivity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkQWN0aXZpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2VydmljZXMvY29udGVudC9hY3Rpdml0eS9hZGRBY3Rpdml0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLG1FQUE0RDtBQUc1RCxtRUFBOEQ7QUFDOUQseUVBQW9FO0FBR3BFLGlGQUE0RTtBQUU1RSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksV0FBVyxFQUFDLENBQUMsQ0FBQztBQUMvRCxNQUFNLHVCQUF1QixHQUFHLEVBQUUsR0FBQyxFQUFFLENBQUM7QUFDdEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7QUFLcEQsU0FBc0IsSUFBSSxDQUFDLEtBQUs7O1FBQzVCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksSUFBSSxHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUNwQyxJQUFJLFFBQVEsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNwQyxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNELE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDO1FBRzdDLE1BQU0sZUFBZSxHQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBR3hELElBQUcsQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFBLElBQUksQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFBLElBQUksQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLG1CQUFtQixFQUFFLENBQUE7WUFDMUgsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBR3JDLElBQUksV0FBVyxHQUFHO1lBQ2QsSUFBSSxFQUFFLGVBQWUsQ0FBQyxJQUFJO1lBQzFCLFdBQVcsRUFBRSxlQUFlLENBQUMsV0FBVztZQUN4QyxJQUFJLEVBQUUsZUFBZSxDQUFDLElBQUk7WUFDMUIsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTO1lBQ3BDLEtBQUssRUFBRSxPQUFPO1NBQ2pCLENBQUM7UUFFRixJQUFJO1lBQ0EsSUFBSSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRW5ELElBQUksWUFBWSxHQUFHLElBQUksQ0FBQztZQUN4QixJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3BCLE1BQU0sTUFBTSxHQUFHO29CQUNYLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQjtvQkFDcEMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxTQUFTO29CQUN2QixPQUFPLEVBQUUsdUJBQXVCO2lCQUNuQyxDQUFDO2dCQUNGLFlBQVksR0FBRyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQzdEO1lBRUQsTUFBTSxRQUFRLEdBQVk7Z0JBQ3RCLFVBQVUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUMzQixPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDckMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO2dCQUNuQixXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVc7Z0JBQ2pDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDakMsU0FBUyxFQUFFLFlBQVk7YUFDMUIsQ0FBQztZQUVGLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1NBQzNDO0lBQ0wsQ0FBQztDQUFBO0FBakRELG9CQWlEQztBQUVELFNBQXNCLGNBQWMsQ0FBQyxVQUFrQjs7UUFDbkQsSUFBSSxJQUFJLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQ3BDLElBQUk7WUFDQSxNQUFNLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdEMsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUVMLENBQUM7Q0FBQTtBQVRELHdDQVNDIn0=