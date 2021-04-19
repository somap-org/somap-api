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
const PlaceRepository_1 = require("../../../repositories/PlaceRepository");
const referralCodeGenerator = require('referral-code-generator');
var AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION || 'eu-central-1' });
function main(event) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_b = (_a = event.request) === null || _a === void 0 ? void 0 : _a.userAttributes) === null || _b === void 0 ? void 0 : _b.email) && ((_c = event.request) === null || _c === void 0 ? void 0 : _c.userAttributes['custom:userType'])) {
            let repo = new UserRepository_1.UserRepository();
            let placeRepo = new PlaceRepository_1.PlaceRepository();
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
                console.log('User added', userAdded);
                let placeAdded = null;
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
                    const ivsResult = yield ivs.createChannel(params).promise();
                    let live = yield repo.updateLiveInfo(userAdded._id, {
                        channel: ivsResult.channel.arn,
                        streamServerUrl: ivsResult.channel.ingestEndpoint,
                        streamKey: ivsResult.streamKey.value,
                        liveUrl: ivsResult.channel.playbackUrl
                    });
                    console.log("User after live info changed", live);
                    let addPlace = {
                        name: null,
                        description: null,
                        address: null,
                        location: null,
                        camUser: userAdded._id
                    };
                    placeAdded = yield placeRepo.addPlace(addPlace);
                    console.log("Place added", placeAdded);
                }
                let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
                    region: process.env.REGION || 'us-east-1'
                });
                var params = {
                    UserAttributes: [
                        {
                            Name: 'custom:userId',
                            Value: userAdded['_id'].toString()
                        }
                    ],
                    UserPoolId: process.env.COGNITO_USER_POOL_ID,
                    Username: event.request.userAttributes.sub
                };
                if (placeAdded) {
                    params.UserAttributes.push({
                        Name: 'custom:placeId',
                        Value: placeAdded['_id'].toString()
                    });
                }
                yield cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3NpZ25VcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx5RUFBb0U7QUFDcEUsaUdBQWlHO0FBQ2pHLDJFQUFzRTtBQUV0RSxNQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ2pFLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxjQUFjLEVBQUMsQ0FBQyxDQUFDO0FBa0JsRSxTQUFzQixJQUFJLENBQUMsS0FBSzs7O1FBRTlCLElBQUksYUFBQSxLQUFLLENBQUMsT0FBTywwQ0FBRSxjQUFjLDBDQUFFLEtBQUssWUFBSSxLQUFLLENBQUMsT0FBTywwQ0FBRSxjQUFjLENBQUMsaUJBQWlCLEVBQUMsRUFBRTtZQUM1RixJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztZQUNoQyxJQUFJLFNBQVMsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUN0QyxJQUFJLElBQUksQ0FBQztZQUdULElBQUksaUJBQWlCLEdBQUc7Z0JBQ3RCLFlBQVksRUFBRSxNQUFNO2dCQUNwQixRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSTtnQkFDM0MsU0FBUyxFQUFFLENBQUM7Z0JBQ1osU0FBUyxFQUFFLENBQUM7YUFDYixDQUFDO1lBQ0YsSUFBSSxZQUFZLEdBQUc7Z0JBQ2pCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixjQUFjLEVBQUUsUUFBUTthQUN6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