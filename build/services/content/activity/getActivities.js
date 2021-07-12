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
        console.log('RICHIESTA', event);
        let responseManager = new ResponseManager_1.default();
        let repo = new ActivityRepository_1.ActivityRepository();
        let userRepo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const placeId = event.pathParameters.placeId;
        const page = parseInt(event.pathParameters.page) || 1;
        const limit = parseInt(event.pathParameters.limit) || 10;
        if (!(yield securityManager.isUserLogged()))
            return responseManager.send(401);
        try {
            let activities = yield repo.getActivies(placeId, page, limit);
            console.log(activities);
            let response = [];
            activities.map((activity) => __awaiter(this, void 0, void 0, function* () {
                let presignedUrl = null;
                if (activity.thumbnail) {
                    const params = {
                        Bucket: process.env.PHOTOS_BUCKET_S3,
                        Key: activity.thumbnail,
                        Expires: signedUrlExpiresSeconds
                    };
                    presignedUrl = yield s3.getSignedUrl('getObject', params);
                }
                response.push({
                    activityId: activity['_id'],
                    name: activity.name,
                    description: activity.description,
                    date: activity.date,
                    thumbnail: presignedUrl
                });
            }));
            return responseManager.send(200, response);
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QWN0aXZpdGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9jb250ZW50L2FjdGl2aXR5L2dldEFjdGl2aXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxtRUFBNEQ7QUFDNUQsbUVBQThEO0FBQzlELHlFQUFvRTtBQUtwRSxpRkFBNEU7QUFFNUUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLFdBQVcsRUFBQyxDQUFDLENBQUM7QUFDL0QsTUFBTSx1QkFBdUIsR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDO0FBQ3RDLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBS3BELFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoQyxJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDcEMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztRQUU3QyxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXpELElBQUcsQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFBO1lBQ3BDLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyQyxJQUFJO1lBQ0EsSUFBSSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QixJQUFJLFFBQVEsR0FBYyxFQUFFLENBQUM7WUFDN0IsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFPLFFBQVEsRUFBRSxFQUFFO2dCQUM5QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7Z0JBQ3hCLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTtvQkFDcEIsTUFBTSxNQUFNLEdBQUc7d0JBQ1gsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCO3dCQUNwQyxHQUFHLEVBQUUsUUFBUSxDQUFDLFNBQVM7d0JBQ3ZCLE9BQU8sRUFBRSx1QkFBdUI7cUJBQ25DLENBQUM7b0JBQ0YsWUFBWSxHQUFHLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQzdEO2dCQUVELFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQ1YsVUFBVSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUM7b0JBQzNCLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtvQkFDbkIsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXO29CQUNqQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7b0JBQ25CLFNBQVMsRUFBRSxZQUFZO2lCQUMxQixDQUFDLENBQUE7WUFDTixDQUFDLENBQUEsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM5QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUMsR0FBRyxFQUFDLENBQUMsQ0FBQztTQUMzQztJQUNMLENBQUM7Q0FBQTtBQTFDRCxvQkEwQ0MifQ==