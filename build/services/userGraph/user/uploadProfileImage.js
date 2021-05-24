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
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'us-east-1' });
const signedUrlExpiresSeconds = 60 * 10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(repo, event);
        const userId = event.pathParameters.userId;
        console.log(1);
        if (!(yield securityManager.isUserIdLogged()))
            return responseManager.send(401);
        console.log(2);
        try {
            const params = { Bucket: process.env.PHOTOS_BUCKET_S3, Key: userId + "/profile_image", Expires: signedUrlExpiresSeconds };
            console.log(params);
            const uploadUrl = yield s3.getSignedUrl('putObject', params);
            if (!uploadUrl) {
                return { error: 'Unable to get presigned upload URL from S3' };
            }
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Methods': '*',
                    'Access-Control-Allow-Origin': '*'
                },
                body: uploadUrl
            };
            return responseManager.send(200, { presignedUrl: uploadUrl });
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501);
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkUHJvZmlsZUltYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3VwbG9hZFByb2ZpbGVJbWFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1FQUE0RDtBQUM1RCx5RUFBb0U7QUFDcEUsbUVBQThEO0FBQzlELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBRS9ELE1BQU0sdUJBQXVCLEdBQUcsRUFBRSxHQUFDLEVBQUUsQ0FBQztBQUV0QyxNQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztBQU9wRCxTQUFzQixJQUFJLENBQUMsS0FBSzs7UUFDNUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxJQUFJLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDaEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUd2RCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQztRQUUzQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBR2YsSUFBRyxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsY0FBYyxFQUFFLENBQUE7WUFDdEMsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXJDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFZixJQUFHO1lBQ0MsTUFBTSxNQUFNLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsTUFBTSxHQUFDLGdCQUFnQixFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxDQUFBO1lBQ3ZILE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEIsTUFBTSxTQUFTLEdBQVcsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVyRSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNaLE9BQU8sRUFBRSxLQUFLLEVBQUUsNENBQTRDLEVBQUUsQ0FBQTthQUNqRTtZQUNELE9BQU87Z0JBQ0gsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsT0FBTyxFQUFFO29CQUNMLGNBQWMsRUFBRSxZQUFZO29CQUM1Qiw4QkFBOEIsRUFBRSxHQUFHO29CQUNuQyw2QkFBNkIsRUFBRSxHQUFHO2lCQUNyQztnQkFDRCxJQUFJLEVBQUUsU0FBUzthQUNsQixDQUFDO1lBRUYsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFDLFlBQVksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1NBQy9EO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNwQztJQUNMLENBQUM7Q0FBQTtBQXZDRCxvQkF1Q0MifQ==