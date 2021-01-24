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
exports.deleteUser = exports.main = void 0;
const User_1 = require("../../../models/User");
const UserRepository_1 = require("../../../repositories/UserRepository");
const CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
function main(event) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_b = (_a = event.request) === null || _a === void 0 ? void 0 : _a.userAttributes) === null || _b === void 0 ? void 0 : _b.email) && ((_c = event.request) === null || _c === void 0 ? void 0 : _c.userAttributes['custom:userType'])) {
            let repo = new UserRepository_1.UserRepository();
            let user;
            let userPublicProfile = {
                profileImage: "test",
                username: event.request.userAttributes.name,
                followers: 0,
                following: 0,
            };
            let userSettings = {
                enableNotification: true,
                appearInPeopleHere: true,
                receiveComment: true,
                profilePrivacy: "public"
            };
            user = {
                cognitoId: event.request.userAttributes.sub.toString(),
                email: event.request.userAttributes.email,
                instagram: null,
                facebook: null,
                publicProfile: userPublicProfile,
                settings: userSettings
            };
            if (event.request.userAttributes['custom:userType'] == "classicUser") {
                user.userType = User_1.UserTypes.ClassicUser;
            }
            else if (event.request.userAttributes['custom:userType'] == "camUser") {
                user.userType = User_1.UserTypes.CamUser;
            }
            else {
                return null;
            }
            try {
                let userAdded = yield repo.signUpUser(user);
                console.log('USER ADDED', userAdded);
                let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
                    region: process.env.REGION || 'eu-central-1'
                });
                var params = {
                    UserAttributes: [
                        {
                            Name: 'custom:userId',
                            Value: userAdded['_id'].toString()
                        },
                    ],
                    UserPoolId: 'eu-central-1_EVTeuSqat',
                    Username: event.request.userAttributes.sub
                };
                yield cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
                return userAdded;
            }
            catch (e) {
                console.log('ERROR ADDING USER', e);
                return null;
            }
        }
        else {
            console.log('ERROR EMAIL OR USER TYPE NOT FOUND');
            return null;
        }
    });
}
exports.main = main;
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let repo = new UserRepository_1.UserRepository();
        try {
            yield repo.deleteUser(userId);
            return true;
        }
        catch (e) {
            return null;
        }
    });
}
exports.deleteUser = deleteUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3NpZ25VcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx5RUFBb0U7QUFDcEUsaUdBQWlHO0FBa0JqRyxTQUFzQixJQUFJLENBQUMsS0FBSzs7O1FBRTVCLElBQUksYUFBQSxLQUFLLENBQUMsT0FBTywwQ0FBRSxjQUFjLDBDQUFFLEtBQUssWUFBSSxLQUFLLENBQUMsT0FBTywwQ0FBRSxjQUFjLENBQUMsaUJBQWlCLEVBQUMsRUFBRTtZQUUxRixJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztZQUNoQyxJQUFJLElBQUksQ0FBQztZQUVULElBQUksaUJBQWlCLEdBQUc7Z0JBQ3BCLFlBQVksRUFBRSxNQUFNO2dCQUNwQixRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSTtnQkFDM0MsU0FBUyxFQUFFLENBQUM7Z0JBQ1osU0FBUyxFQUFFLENBQUM7YUFDZixDQUFDO1lBRUYsSUFBSSxZQUFZLEdBQUc7Z0JBQ2Ysa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsa0JBQWtCLEVBQUUsSUFBSTtnQkFDeEIsY0FBYyxFQUFFLElBQUk7Z0JBQ3BCLGNBQWMsRUFBRSxRQUFRO2FBQzNCLENBQUM7WUFFRixJQUFJLEdBQUc7Z0JBQ0gsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RELEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLO2dCQUN6QyxTQUFTLEVBQUUsSUFBSTtnQkFDZixRQUFRLEVBQUUsSUFBSTtnQkFDZCxhQUFhLEVBQUUsaUJBQWlCO2dCQUNoQyxRQUFRLEVBQUUsWUFBWTthQUN6QixDQUFDO1lBRUYsSUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLGFBQWEsRUFBQztnQkFDaEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxnQkFBUyxDQUFDLFdBQVcsQ0FBQzthQUN6QztpQkFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLElBQUksU0FBUyxFQUFFO2dCQUNyRSxJQUFJLENBQUMsUUFBUSxHQUFHLGdCQUFTLENBQUMsT0FBTyxDQUFDO2FBQ3JDO2lCQUFNO2dCQUVILE9BQU8sSUFBSSxDQUFDO2FBQ2Y7WUFJRCxJQUFJO2dCQUNBLElBQUksU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBRXJDLElBQUksOEJBQThCLEdBQUcsSUFBSSw4QkFBOEIsQ0FBQztvQkFDcEUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLGNBQWM7aUJBQy9DLENBQUMsQ0FBQztnQkFDSCxJQUFJLE1BQU0sR0FBRztvQkFDVCxjQUFjLEVBQUU7d0JBQ1o7NEJBQ0ksSUFBSSxFQUFFLGVBQWU7NEJBQ3JCLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFO3lCQUNyQztxQkFDSjtvQkFDRCxVQUFVLEVBQUUsd0JBQXdCO29CQUNwQyxRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRztpQkFDN0MsQ0FBQztnQkFFRixNQUFNLDhCQUE4QixDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUNqRixPQUFPLFNBQVMsQ0FBQzthQUNwQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLE9BQU8sSUFBSSxDQUFDO2FBQ2Y7U0FFSjthQUFNO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1lBQ2xELE9BQU8sSUFBSSxDQUFDO1NBQ2Y7O0NBQ0o7QUF0RUQsb0JBc0VDO0FBRUQsU0FBc0IsVUFBVSxDQUFDLE1BQWM7O1FBQzNDLElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1FBQ2hDLElBQUk7WUFDQSxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsT0FBTyxJQUFJLENBQUM7U0FDZjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1IsT0FBTyxJQUFJLENBQUM7U0FDZjtJQUVMLENBQUM7Q0FBQTtBQVRELGdDQVNDIn0=