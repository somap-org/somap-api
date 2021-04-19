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
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('START MAIN');
        if (((_b = (_a = event.request) === null || _a === void 0 ? void 0 : _a.userAttributes) === null || _b === void 0 ? void 0 : _b.email) && ((_c = event.request) === null || _c === void 0 ? void 0 : _c.userAttributes['custom:userType'])) {
            console.log('EMAIL AND USER TYPE FOUND', event.request.userAttributes.email, (_d = event.request) === null || _d === void 0 ? void 0 : _d.userAttributes['custom:userType']);
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
                    region: process.env.REGION || 'us-east-1'
                });
                var params = {
                    UserAttributes: [
                        {
                            Name: 'custom:userId',
                            Value: userAdded['_id'].toString()
                        },
                    ],
                    UserPoolId: process.env.COGNITO_USER_POOL_ID,
                    Username: event.request.userAttributes.sub
                };
                yield cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
                if (user.userType === User_1.UserTypes.CamUser) {
                    const ivs = new AWS.IVS({
                        apiVersion: '2020-07-14',
                        region: process.env.REGION || 'us-east-1'
                    });
                    const params = {
                        latencyMode: 'LOW',
                        name: userAdded['_id'].toString(),
                        type: 'STANDARD'
                    };
                    const result = yield ivs.createChannel(params).promise();
                    console.log(result);
                    let live = yield repo.updateLiveInfo(userAdded._id, {
                        channel: result.channel.arn,
                        streamServerUrl: result.channel.ingestEndpoint,
                        streamKey: result.streamKey.value,
                        liveUrl: result.channel.playbackUrl
                    });
                    console.log(live);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3NpZ25VcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx5RUFBb0U7QUFDcEUsaUdBQWlHO0FBRWpHLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDakUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzdCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLGNBQWMsRUFBQyxDQUFDLENBQUM7QUFrQmxFLFNBQXNCLElBQUksQ0FBQyxLQUFLOzs7UUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxQixJQUFJLGFBQUEsS0FBSyxDQUFDLE9BQU8sMENBQUUsY0FBYywwQ0FBRSxLQUFLLFlBQUksS0FBSyxDQUFDLE9BQU8sMENBQUUsY0FBYyxDQUFDLGlCQUFpQixFQUFDLEVBQUU7WUFDNUYsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLFFBQUUsS0FBSyxDQUFDLE9BQU8sMENBQUUsY0FBYyxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDL0gsSUFBSSxJQUFJLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7WUFDaEMsSUFBSSxJQUFJLENBQUM7WUFFVCxJQUFJLGlCQUFpQixHQUFHO2dCQUN0QixZQUFZLEVBQUUsTUFBTTtnQkFDcEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUk7Z0JBQzNDLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2FBQ2IsQ0FBQztZQUVG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