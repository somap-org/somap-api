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
const referralCodeGenerator = require('referral-code-generator');
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'eu-central-1' });
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
                settings: userSettings,
                referralCode: referralCodeGenerator.custom('uppercase', 6, 6, event.request.userAttributes.name),
                referralCodeUsed: event.request.userAttributes['custom:referralCode']
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
                if (user.userType === User_1.UserTypes.CamUser) {
                    const ivs = new AWS.IVS({
                        apiVersion: '2020-07-14',
                        region: 'us-west-2'
                    });
                    const params = {
                        latencyMode: 'NORMAL',
                        name: userAdded['_id'].toString(),
                        type: 'BASIC'
                    };
                    const result = yield ivs.createChannel(params).promise();
                    yield repo.updateLiveInfo(userAdded._id, {
                        channel: result.channel,
                        streamKey: result.streamKey
                    });
                }
                let paramsUserEmail = {
                    Destination: {
                        ToAddresses: [
                            user.email
                        ]
                    },
                    Source: 'business@somap.app',
                    Template: 'CompleteSomapAccount',
                    TemplateData: JSON.stringify({
                        username: user.publicProfile.username,
                        referralCode: user.referralCode
                    }),
                    ReplyToAddresses: [
                        'business@somap.app'
                    ],
                };
                yield new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(paramsUserEmail).promise();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3NpZ25VcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx5RUFBb0U7QUFDcEUsaUdBQWlHO0FBQ2pHLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDakUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLGNBQWMsRUFBQyxDQUFDLENBQUM7QUFrQmxFLFNBQXNCLElBQUksQ0FBQyxLQUFLOzs7UUFFNUIsSUFBSSxhQUFBLEtBQUssQ0FBQyxPQUFPLDBDQUFFLGNBQWMsMENBQUUsS0FBSyxZQUFJLEtBQUssQ0FBQyxPQUFPLDBDQUFFLGNBQWMsQ0FBQyxpQkFBaUIsRUFBQyxFQUFFO1lBRTFGLElBQUksSUFBSSxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1lBQ2hDLElBQUksSUFBSSxDQUFDO1lBRVQsSUFBSSxpQkFBaUIsR0FBRztnQkFDcEIsWUFBWSxFQUFFLE1BQU07Z0JBQ3BCLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJO2dCQUMzQyxTQUFTLEVBQUUsQ0FBQztnQkFDWixTQUFTLEVBQUUsQ0FBQzthQUNmLENBQUM7WUFFRixJQUFJLFlBQVksR0FBRztnQkFDZixrQkFBa0IsRUFBRSxJQUFJO2dCQUN4QixrQkFBa0IsRUFBRSxJQUFJO2dCQUN4QixjQUFjLEVBQUUsSUFBSTtnQkFDcEIsY0FBYyxFQUFFLFFBQVE7YUFDM0IsQ0FBQztZQUVGLElBQUksR0FBRztnQkFDSCxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FB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