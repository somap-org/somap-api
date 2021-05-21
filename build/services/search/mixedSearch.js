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
                                profileImage: place.camUser['profileImage']
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWRTZWFyY2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc2VhcmNoL21peGVkU2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsZ0VBQXlEO0FBQ3pELGdFQUEyRDtBQUMzRCxzRUFBaUU7QUFDakUsd0VBQW1FO0FBQ25FLDhFQUF5RTtBQVN6RSxTQUFzQixJQUFJLENBQUMsS0FBSzs7O1FBQzlCLElBQUksZUFBZSxHQUFHLElBQUkseUJBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksa0JBQWtCLEdBQUcsSUFBSSx1Q0FBa0IsRUFBRSxDQUFDO1FBQ2xELElBQUksZUFBZSxHQUFHLElBQUksaUNBQWUsRUFBRSxDQUFDO1FBQzVDLElBQUksY0FBYyxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQzFDLElBQUksZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFakUsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQztRQUVoRCxNQUFNLElBQUksR0FBRyxRQUFRLE9BQUMsS0FBSyxDQUFDLHFCQUFxQiwwQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUQsTUFBTSxLQUFLLEdBQUcsUUFBUSxPQUFDLEtBQUssQ0FBQyxxQkFBcUIsMENBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWpFLElBQUksQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFBO1lBQ3ZDLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxJQUFJO1lBQ0YsSUFBSSxrQkFBa0IsR0FBZSxFQUFFLENBQUM7WUFDeEMsSUFBSSxjQUFjLEdBQVUsRUFBRSxDQUFDO1lBQy9CLElBQUksYUFBYSxHQUFzQixFQUFFLENBQUM7WUFDMUMsT0FBTyxDQUFD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