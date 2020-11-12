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
            thumbnail: requestActivity.thumbnail,
            place: placeId
        };
        try {
            let activity = yield repo.editActivity(activityId, editActivity);
            const response = {
                activityId: activity['_id'],
                name: activity.name,
                description: activity.description,
                date: activity.date,
                thumbnail: activity.thumbnail
            };
            return responseManager.send(200, response);
        }
        catch (err) {
            return responseManager.send(501, { err });
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdEFjdGl2aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL2NvbnRlbnQvYWN0aXZpdHkvZWRpdEFjdGl2aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsbUVBQTREO0FBRzVELG1FQUE4RDtBQUM5RCx5RUFBb0U7QUFHcEUsaUZBQTRFO0FBTTVFLFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUM1QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLHVDQUFrQixFQUFFLENBQUM7UUFDcEMsSUFBSSxRQUFRLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7UUFDcEMsSUFBSSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMzRCxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQztRQUM3QyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQztRQUduRCxNQUFNLGVBQWUsR0FBWSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUd4RCxJQUFHLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQSxJQUFJLENBQUMsQ0FBQSxNQUFNLGVBQWUsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO1lBQzFILE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUdyQyxJQUFJLFlBQVksR0FBRztZQUNmLElBQUksRUFBRSxlQUFlLENBQUMsSUFBSTtZQUMxQixXQUFXLEVBQUUsZUFBZSxDQUFDLFdBQVc7WUFDeEMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxJQUFJO1lBQzFCLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUztZQUNwQyxLQUFLLEVBQUUsT0FBTztTQUNqQixDQUFDO1FBRUYsSUFBSTtZQUNBLElBQUksUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFFakUsTUFBTSxRQUFRLEdBQVk7Z0JBQ3RCLFVBQVUsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7Z0JBQ25CLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVztnQkFDakMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO2dCQUNuQixTQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVM7YUFDaEMsQ0FBQztZQUVGLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDOUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO1NBQzNDO0lBQ0wsQ0FBQztDQUFBO0FBdkNELG9CQXVDQyJ9