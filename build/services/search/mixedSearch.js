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
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let activityRepository = new ActivityRepository_1.ActivityRepository();
        let placeRepository = new PlaceRepository_1.PlaceRepository();
        let userRepository = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(userRepository, event);
        const query = event.queryStringParameters.query;
        const page = parseInt(event.pathParameters.page) || 1;
        const limit = parseInt(event.pathParameters.limit) || 10;
        if (!(yield securityManager.isUserLogged()))
            return responseManager.send(401);
        try {
            let responseActivities = [];
            let responsePlaces = [];
            let responseUsers = [];
            yield Promise.all([
                () => __awaiter(this, void 0, void 0, function* () {
                    let activities = yield activityRepository.searchByQuery(query, page, limit);
                    activities.map((activity) => {
                        responseActivities.push({
                            activityId: activity['_id'],
                            name: activity.name,
                            description: activity.description,
                            date: activity.date,
                            thumbnail: activity.thumbnail
                        });
                    });
                }),
                () => __awaiter(this, void 0, void 0, function* () {
                    let places = yield placeRepository.searchByQuery(query, page, limit);
                    for (const place of places) {
                        let coordinates = {
                            latitude: place.location.coordinates[1],
                            longitude: place.location.coordinates[0]
                        };
                        responsePlaces.push({
                            placeId: place['_id'],
                            name: place.name,
                            description: place.description,
                            address: place.address,
                            coordinates: coordinates,
                        });
                    }
                }),
                () => __awaiter(this, void 0, void 0, function* () {
                    let users = yield userRepository.searchByQuery(query, page, limit);
                    for (const user of users) {
                        responseUsers.push({
                            userId: user['_id'],
                            userType: user.userType,
                            username: user.publicProfile.username,
                            profileImage: user.publicProfile.profileImage,
                            followers: user.publicProfile.followers,
                            following: user.publicProfile.following
                        });
                    }
                })
            ]);
            let response = {
                activities: responseActivities,
                places: responsePlaces,
                users: responseUsers,
            };
            return response;
        }
        catch (err) {
            console.log(err);
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWl4ZWRTZWFyY2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2VydmljZXMvc2VhcmNoL21peGVkU2VhcmNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsZ0VBQXlEO0FBQ3pELGdFQUEyRDtBQUMzRCxzRUFBaUU7QUFDakUsd0VBQW1FO0FBSW5FLDhFQUF5RTtBQVV6RSxTQUFzQixJQUFJLENBQUMsS0FBSzs7UUFDOUIsSUFBSSxlQUFlLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDbEQsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxFQUFFLENBQUM7UUFDNUMsSUFBSSxjQUFjLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDMUMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVqRSxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDO1FBRWhELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFekQsSUFBSSxDQUFDLENBQUEsTUFBTSxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDdkMsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRW5DLElBQUk7WUFDRixJQUFJLGtCQUFrQixHQUFlLEVBQUUsQ0FBQztZQUN4QyxJQUFJLGNBQWMsR0FBVSxFQUFFLENBQUM7WUFDL0IsSUFBSSxhQUFhLEdBQXNCLEVBQUUsQ0FBQztZQUUxQyxNQUFNLE9BQU8sQ0FBQyxH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