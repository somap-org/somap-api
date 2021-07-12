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
                    for (const activity of activities) {
                        let presignedUrl = null;
                        if (activity.thumbnail) {
                            const params = {
                                Bucket: process.env.PHOTOS_BUCKET_S3,
                                Key: activity.thumbnail,
                                Expires: signedUrlExpiresSeconds
                            };
                            presignedUrl = yield s3.getSignedUrl('getObject', params);
                        }
                        responseActivities.push({
                            activityId: activity['_id'].toString(),
                            name: activity.name,
                            description: activity.description,
                            date: activity.date,
                            thumbnail: presignedUrl
                        });
                    }
                    ;
                    resolve();
                })),
                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let places = yield placeRepository.searchByQuery(query, page, limit);
                    console.log('PLACES', places);
                    for (const place of places) {
                        console.log('PLACE', place);
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
                        responsePlaces.push({
                            placeId: place['_id'].toString(),
                            name: place.name,
                            currentLiveUrl: place.currentLiveUrl,
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
                    resolve();
                })),
                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let users = yield userRepository.searchByQuery(query, page, limit);
                    for (const user of users) {
                        let presignedUrl = null;
                        if (user.publicProfile.profileImage) {
                            const params = {
                                Bucket: process.env.PHOTOS_BUCKET_S3,
                                Key: user.publicProfile.profileImage,
                                Expires: signedUrlExpiresSeconds
                            };
                            presignedUrl = yield s3.getSignedUrl('getObject', params);
                        }
                        responseUsers.push({
                            userId: user['_id'].toString(),
                            userType: user.userType,
                            username: user.publicProfile.username,
                            profileImage: presignedUrl
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWRTZWFyY2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc2VhcmNoL21peGVkU2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsZ0VBQXlEO0FBQ3pELGdFQUEyRDtBQUMzRCxzRUFBaUU7QUFDakUsd0VBQW1FO0FBQ25FLDhFQUF5RTtBQU16RSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksV0FBVyxFQUFDLENBQUMsQ0FBQztBQUMvRCxNQUFNLHVCQUF1QixHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDeEMsTUFBTSxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUMsVUFBVSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUM7QUFLbEQsU0FBc0IsSUFBSSxDQUFDLEtBQUs7OztRQUM5QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUNsRCxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLGNBQWMsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUMxQyxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWpFLE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUM7UUFFaEQsTUFBTSxJQUFJLEdBQUcsUUFBUSxPQUFDLEtBQUssQ0FBQyxxQkFBcUIsMENBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlELE1BQU0sS0FBSyxHQUFHLFFBQVEs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