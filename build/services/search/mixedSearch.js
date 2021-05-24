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
const ResponseManager_1 = require("../../libs/ResponseManager");
const SecurityManager_1 = require("../../libs/SecurityManager");
const UserRepository_1 = require("../../repositories/UserRepository");
const PlaceRepository_1 = require("../../repositories/PlaceRepository");
const ActivityRepository_1 = require("../../repositories/ActivityRepository");
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'us-east-1' });
const signedUrlExpiresSeconds = 60 * 10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
function main(event) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let activityRepository = new ActivityRepository_1.ActivityRepository();
        let placeRepository = new PlaceRepository_1.PlaceRepository();
        let userRepository = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepository, event);
        const query = event.queryStringParameters.query;
        const page = parseInt((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = parseInt((_b = event.queryStringParameters) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        if (!(yield securityManager.isUserLogged()))
            return responseManager.send(401);
        try {
            let responseActivities = [];
            let responsePlaces = [];
            let responseUsers = [];
            console.log('test');
            yield Promise.all([
                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let activities = yield activityRepository.searchByQuery(query, page, limit);
                    activities.map((activity) => {
                        responseActivities.push({
                            activityId: activity['_id'].toString(),
                            name: activity.name,
                            description: activity.description,
                            date: activity.date,
                            thumbnail: activity.thumbnail
                        });
                    });
                    resolve();
                })),
                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let places = yield placeRepository.searchByQuery(query, page, limit);
                    for (const place of places) {
                        let coordinates = {
                            latitude: place.location.coordinates[1],
                            longitude: place.location.coordinates[0]
                        };
                        const params = { Bucket: process.env.PHOTOS_BUCKET_S3, Key: place.camUser['profileImage'], Expires: signedUrlExpiresSeconds };
                        const uploadUrl = yield s3.getSignedUrl('getObject', params);
                        responsePlaces.push({
                            placeId: place['_id'].toString(),
                            name: place.name,
                            description: place.description,
                            address: place.address,
                            coordinates: coordinates,
                            userCam: {
                                userId: place.camUser['_id'],
                                userType: place.camUser['userType'],
                                username: place.camUser['username'],
                                profileImage: uploadUrl
                            }
                        });
                    }
                    resolve();
                })),
                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let users = yield userRepository.searchByQuery(query, page, limit);
                    for (const user of users) {
                        responseUsers.push({
                            userId: user['_id'].toString(),
                            userType: user.userType,
                            username: user.publicProfile.username,
                            profileImage: user.publicProfile.profileImage
                        });
                    }
                    resolve();
                }))
            ]);
            let response = {
                activities: responseActivities,
                places: responsePlaces,
                users: responseUsers,
            };
            return responseManager.send(200, response);
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWRTZWFyY2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc2VhcmNoL21peGVkU2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsZ0VBQXlEO0FBQ3pELGdFQUEyRDtBQUMzRCxzRUFBaUU7QUFDakUsd0VBQW1FO0FBQ25FLDhFQUF5RTtBQU16RSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksV0FBVyxFQUFDLENBQUMsQ0FBQztBQUMvRCxNQUFNLHVCQUF1QixHQUFHLEVBQUUsR0FBQyxFQUFFLENBQUM7QUFDdEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7QUFLcEQsU0FBc0IsSUFBSSxDQUFDLEtBQUs7OztRQUM5QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUNsRCxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLGNBQWMsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUMxQyxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWpFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUM7UUFFaEQsTUFBTSxJQUFJLEdBQUcsUUFBUSxPQUFDLEtBQUssQ0FBQyxxQkFBcUIsMENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlELE1BQU0sS0FBSyxHQUFHLFFBQVEs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