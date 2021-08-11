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
                        try {
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
                                placeId: activity['place'].toString(),
                                name: activity.name,
                                description: activity.description,
                                date: activity.date.toISOString(),
                                thumbnail: presignedUrl
                            });
                        }
                        catch (e) {
                            console.error(e);
                        }
                    }
                    resolve();
                })),
                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let places = yield placeRepository.searchByQuery(query, page, limit);
                    console.log('PLACES', places);
                    for (const place of places) {
                        try {
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
                        catch (e) {
                            console.error(e);
                        }
                    }
                    resolve();
                })),
                new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    let users = yield userRepository.searchByQuery(query, page, limit);
                    for (const user of users) {
                        try {
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
                        catch (e) {
                            console.error(e);
                        }
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