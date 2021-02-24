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
const referral_code_generator_1 = require("referral-code-generator");
function main(event) {
    var _a, _b, _c, _d;
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
                settings: userSettings,
                referralCode: null,
                referralCodeUsed: (_d = event.request.userAttributes) === null || _d === void 0 ? void 0 : _d.referralCode
            };
            if (event.request.userAttributes['custom:userType'] == "classicUser") {
                user.referralCode = referral_code_generator_1.default.custom('uppercase', 6, 6, event.request.userAttributes.name);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3NpZ25VcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx5RUFBb0U7QUFDcEUsaUdBQWlHO0FBQ2pHLHFFQUE0RDtBQWtCNUQsU0FBc0IsSUFBSSxDQUFDLEtBQUs7OztRQUU1QixJQUFJLGFBQUEsS0FBSyxDQUFDLE9BQU8sMENBQUUsY0FBYywwQ0FBRSxLQUFLLFlBQUksS0FBSyxDQUFDLE9BQU8sMENBQUUsY0FBYyxDQUFDLGlCQUFpQixFQUFDLEVBQUU7WUFFMUYsSUFBSSxJQUFJLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7WUFDaEMsSUFBSSxJQUFJLENBQUM7WUFFVCxJQUFJLGlCQUFpQixHQUFHO2dCQUNwQixZQUFZLEVBQUUsTUFBTTtnQkFDcEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUk7Z0JBQzNDLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2FBQ2YsQ0FBQztZQUVGLElBQUksWUFBWSxHQUFHO2dCQUNmLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixjQUFjLEVBQUUsUUFBUTthQUMzQixDQUFDO1lBRUYsSUFBSSxHQUFHO2dCQUNILFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO2dCQUN0RCxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSztnQkFDekMsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsYUFBYSxFQUFFLGlCQUFpQjtnQkFDaEMsUUFBUSxFQUFFLFlBQVk7Z0JBQ3RCLFlBQVksRUFBRSxJQUFJO2dCQUNsQixnQkFBZ0IsUUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsMENBQUUsWUFBWTthQUMvRCxDQUFDO1lBRUYsSUFBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLGFBQWEsRUFBQztnQkFDaEUsSUFBSSxDQUFDLFlBQVksR0FBRyxpQ0FBcUIsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZHLElBQUksQ0FBQyxRQUFRLEdBQUcsZ0JBQVMsQ0FBQyxXQUFXLENBQUM7YUFDekM7aUJBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLFNBQVMsRUFBRTtnQkFDckUsSUFBSSxDQUFDLFFBQVEsR0FBRyxnQkFBUyxDQUFDLE9BQU8sQ0FBQzthQUNyQztpQkFBTTtnQkFFSCxPQUFPLElBQUksQ0FBQzthQUNmO1lBSUQsSUFBSTtnQkFDQSxJQUFJLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUVyQyxJQUFJLDhCQUE4QixHQUFHLElBQUksOEJBQThCLENBQUM7b0JBQ3BFLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxjQUFjO2lCQUMvQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxNQUFNLEdBQUc7b0JBQ1QsY0FBYyxFQUFFO3dCQUNaOzRCQUNJLElBQUksRUFBRSxlQUFlOzRCQUNyQixLQUFLLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTt5QkFDckM7cUJBQ0o7b0JBQ0QsVUFBVSxFQUFFLHdCQUF3QjtvQkFDcEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUc7aUJBQzdDLENBQUM7Z0JBRUYsTUFBTSw4QkFBOEIsQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDakYsT0FBTyxTQUFTLENBQUM7YUFDcEI7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxPQUFPLElBQUksQ0FBQzthQUNmO1NBRUo7YUFBTTtZQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsQ0FBQztZQUNsRCxPQUFPLElBQUksQ0FBQztTQUNmOztDQUNKO0FBekVELG9CQXlFQztBQUVELFNBQXNCLFVBQVUsQ0FBQyxNQUFjOztRQUMzQyxJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztRQUNoQyxJQUFJO1lBQ0EsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNSLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7SUFFTCxDQUFDO0NBQUE7QUFURCxnQ0FTQyJ9