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
function main(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseManager = new ResponseManager_1.default();
        let repo = new UserRepository_1.UserRepository();
        let securityManager = new SecurityManager_1.SecurityManager(repo, event);
        if (!(yield securityManager.isUserIdLogged()))
            return responseManager.send(401);
        const deleteParams = {
            Username: (yield securityManager.getUserLogged()).email,
            UserPoolId: process.env.COGNITO_CLIENT_ID
        };
        try {
            let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
                region: process.env.REGION || 'eu-central-1'
            });
            const result = yield cognitoIdentityServiceProvider.adminDeleteUser(deleteParams).promise();
            return result;
        }
        catch (e) {
            console.log(`error deleting user ${(yield securityManager.getUserLogged()).email}: ${e}`);
            throw e;
        }
    });
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlQWNjb3VudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zZXJ2aWNlcy91c2VyR3JhcGgvdXNlci9kZWxldGVBY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsbUVBQTREO0FBQzVELHlFQUFvRTtBQUNwRSxtRUFBOEQ7QUFDOUQsaUdBQWlHO0FBS2pHLFNBQXNCLElBQUksQ0FBQyxLQUFLOztRQUM5QixJQUFJLGVBQWUsR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNoQyxJQUFJLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXZELElBQUcsQ0FBQyxDQUFBLE1BQU0sZUFBZSxDQUFDLGNBQWMsRUFBRSxDQUFBO1lBQ3hDLE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQyxNQUFNLFlBQVksR0FBRztZQUNuQixRQUFRLEVBQUUsQ0FBQyxNQUFNLGVBQWUsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEtBQUs7WUFDdkQsVUFBVSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCO1NBQzFDLENBQUE7UUFFRCxJQUFJO1lBQ0YsSUFBSSw4QkFBOEIsR0FBRyxJQUFJLDhCQUE4QixDQUFDO2dCQUN0RSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksY0FBYzthQUM3QyxDQUFDLENBQUM7WUFFSCxNQUFNLE1BQU0sR0FBRyxNQUFNLDhCQUE4QixDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUM1RixPQUFPLE1BQU0sQ0FBQztTQUNmO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLE1BQU0sZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDekYsTUFBTSxDQUFDLENBQUM7U0FDVDtJQUVILENBQUM7Q0FBQTtBQXpCRCxvQkF5QkMifQ==