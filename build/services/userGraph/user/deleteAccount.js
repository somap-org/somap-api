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
const CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
const ActivityRepository_1 = require("../../../repositories/ActivityRepository");
const LiveRepository_1 = require("../../../repositories/LiveRepository");
const PlaceRepository_1 = require("../../../repositories/PlaceRepository");
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new UserRepository_1.UserRepository();
        let activityRepository = new ActivityRepository_1.ActivityRepository();
        let liveRepository = new LiveRepository_1.LiveRepository();
        let placeRepository = new PlaceRepository_1.PlaceRepository();
        let securityManager = new SecurityManager_1.SecurityManager(repo, event);
        if (!(yield securityManager.isUserLogged()))
            return responseManager.send(401);
        const loggedUser = yield securityManager.getUserLogged();
        const deleteParams = {
            Username: (yield securityManager.getUserLogged()).email,
            UserPoolId: process.env.COGNITO_USER_POOL_ID
        };
        try {
            let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
                region: process.env.REGION || 'eu-central-1'
            });
            const result = yield cognitoIdentityServiceProvider.adminDeleteUser(deleteParams).promise();
            if (yield securityManager.isUserCam()) {
                const place = yield placeRepository.getCamUserPlace(loggedUser);
                yield placeRepository.deletePlace(place['_id']);
                yield activityRepository.deleteActivityByPlaceId(place['_id']);
                yield liveRepository.deleteLiveByPlaceId(place['_id']);
            }
            yield repo.deleteUser(loggedUser['_id']);
            return result;
        }
        catch (e) {
            console.log(`error deleting user ${(yield securityManager.getUserLogged()).email}: ${e}`);
            throw e;
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlQWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy91c2VyR3JhcGgvdXNlci9kZWxldGVBY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsbUVBQTREO0FBQzVELHlFQUFvRTtBQUNwRSxtRUFBOEQ7QUFDOUQsaUdBQWlHO0FBQ2pHLGlGQUE0RTtBQUM1RSx5RUFBb0U7QUFDcEUsMkVBQXNFO0FBS3RFLFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUM5QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNoQyxJQUFJLGtCQUFrQixHQUFHLElBQUksdUNBQWtCLEVBQUUsQ0FBQztRQUNsRCxJQUFJLGNBQWMsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUMxQyxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXZELElBQUcsQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLFlBQVksRUFBRSxDQUFBO1lBQ3RDLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxNQUFNLFVBQVUsR0FBRyxNQUFNLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtRQUV4RCxNQUFNLFlBQVksR0FBRztZQUNuQixRQUFRLEVBQUUsQ0FBQyxNQUFNLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEtBQUs7WUFDdkQsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CO1NBQzdDLENBQUE7UUFFRCxJQUFJO1lBQ0YsSUFBSSw4QkFBOEIsR0FBRyxJQUFJLDhCQUE4QixDQUFDO2dCQUN0RSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksY0FBYzthQUM3QyxDQUFDLENBQUM7WUFFSCxNQUFNLE1BQU0sR0FBRyxNQUFNLDhCQUE4QixDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUU1RixJQUFJLE1BQU0sZUFBZSxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLGVBQWUsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBQy9ELE1BQU0sZUFBZSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtnQkFDL0MsTUFBTSxrQkFBa0IsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtnQkFDOUQsTUFBTSxjQUFjLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7YUFDdkQ7WUFFRCxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFekMsT0FBTyxNQUFNLENBQUM7U0FDZjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3pGLE1BQU0sQ0FBQyxDQUFDO1NBQ1Q7SUFFSCxDQUFDO0NBQUE7QUF4Q0Qsb0JBd0NDIn0=