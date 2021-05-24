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
AWS.config.update({ region: process.env.REGION || 'us-east-1' });
function main(event) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        if (((_b = (_a = event.request) === null || _a === void 0 ? void 0 : _a.userAttributes) === null || _b === void 0 ? void 0 : _b.email) && ((_c = event.request) === null || _c === void 0 ? void 0 : _c.userAttributes['custom:userType'])) {
            let repo = new UserRepository_1.UserRepository();
            let placeRepo = new PlaceRepository_1.PlaceRepository();
            let user;
            let userPublicProfile = {
                profileImage: "test",
                username: event.request.userAttributes.name
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
                        type: 'BASIC'
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
                        location: {
                            type: 'Point',
                            coordinates: [
                                0,
                                0
                            ]
                        },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnblVwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NlcnZpY2VzL3VzZXJHcmFwaC91c2VyL3NpZ25VcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLCtDQUErQztBQUMvQyx5RUFBb0U7QUFDcEUsaUdBQWlHO0FBQ2pHLDJFQUFzRTtBQUV0RSxNQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ2pFLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBa0IvRCxTQUFzQixJQUFJLENBQUMsS0FBSzs7O1FBRTlCLElBQUksYUFBQSxLQUFLLENBQUMsT0FBTywwQ0FBRSxjQUFjLDBDQUFFLEtBQUssWUFBSSxLQUFLLENBQUMsT0FBTywwQ0FBRSxjQUFjLENBQUMsaUJBQWlCLEVBQUMsRUFBRTtZQUM1RixJQUFJLElBQUksR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztZQUNoQyxJQUFJLFNBQVMsR0FBRyxJQUFJLGlDQUFlLEVBQUUsQ0FBQztZQUN0QyxJQUFJLElBQUksQ0FBQztZQUdULElBQUksaUJBQWlCLEdBQUc7Z0JBQ3RCLFlBQVksRUFBRSxNQUFNO2dCQUNwQixRQUFRLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSTthQUM1QyxDQUFDO1lBQ0YsSUFBSSxZQUFZLEdBQUc7Z0JBQ2pCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGNBQWMsRUFBRSxJQUFJO2dCQUNwQixjQUFjLEVBQUUsUUFBUTthQUN6QixDQUFDO1lBQ0YsSUFBSSxHQUFHO2dCQUNMLFNBQVMsRUFBRSxLQUFL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