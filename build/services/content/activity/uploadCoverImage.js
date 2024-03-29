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
const UserRepository_1 = require("../../../repositories/UserRepository");
const SecurityManager_1 = require("../../../libs/SecurityManager");
const ActivityRepository_1 = require("../../../repositories/ActivityRepository");
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'us-east-1' });
const signedUrlExpiresSeconds = 60 * 10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let userRepo = new UserRepository_1.UserRepository();
        let repo = new ActivityRepository_1.ActivityRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepo, event);
        const placeId = event.pathParameters.placeId;
        const activityId = event.pathParameters.activityId;
        const body = JSON.parse(event.body);
        const userLogged = yield securityManager.getUserLogged();
        if (!(yield securityManager.isUserLogged()) || !(yield securityManager.isUserCamPlaceOwner()))
            return responseManager.send(401);
        try {
            const params = { Bucket: process.env.PHOTOS_BUCKET_S3, Key: userLogged['_id'] + "/" + placeId + "/" + activityId + "/cover-image/" + body.fileName, Expires: signedUrlExpiresSeconds, ContentType: body.fileType };
            const uploadUrl = yield s3.getSignedUrl('putObject', params);
            if (!uploadUrl) {
                return { error: 'Unable to get presigned upload URL from S3' };
            }
            yield repo.editActivity(activityId, {
                thumbnail: userLogged['_id'] + "/" + placeId + "/" + activityId + "/cover-image/" + body.fileName
            });
            return responseManager.send(200, { presignedUrl: uploadUrl });
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501);
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkQ292ZXJJbWFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy9jb250ZW50L2FjdGl2aXR5L3VwbG9hZENvdmVySW1hZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtRUFBNEQ7QUFDNUQseUVBQW9FO0FBQ3BFLG1FQUE4RDtBQUM5RCxpRkFBNEU7QUFFNUUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLFdBQVcsRUFBQyxDQUFDLENBQUM7QUFDL0QsTUFBTSx1QkFBdUIsR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDO0FBQ3RDLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBTXBELFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUM1QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLFFBQVEsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNwQyxJQUFJLElBQUksR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUczRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztRQUM3QyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQztRQUNuRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxNQUFNLFVBQVUsR0FBRyxNQUFNLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUd6RCxJQUFHLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO1lBQ3BGLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVyQyxJQUFHO1lBQ0MsTUFBTSxNQUFNLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFDLEdBQUcsR0FBQyxPQUFPLEdBQUMsR0FBRyxHQUFDLFVBQVUsR0FBQyxlQUFlLEdBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQztZQUN0TSxNQUFNLFNBQVMsR0FBVyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRXJFLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLEtBQUssRUFBRSw0Q0FBNEMsRUFBRSxDQUFBO2FBQ2pFO1lBRUQsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRTtnQkFDaEMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBQyxHQUFHLEdBQUMsT0FBTyxHQUFDLEdBQUcsR0FBQyxVQUFVLEdBQUMsZUFBZSxHQUFDLElBQUksQ0FBQyxRQUFRO2FBQ3hGLENBQUMsQ0FBQztZQUVILE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxZQUFZLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztTQUMvRDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDcEM7SUFDTCxDQUFDO0NBQUE7QUFsQ0Qsb0JBa0NDIn0=