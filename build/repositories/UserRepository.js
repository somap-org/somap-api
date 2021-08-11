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
exports.UserRepository = void 0;
const User_1 = require("../models/User");
const mongodb_1 = require("../libs/mongodb");
class UserRepository {
    constructor() {
        mongodb_1.connect();
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOne({ _id: id });
        });
    }
    getUserPublicProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ _id: id });
            let response = {
                userId: user['_id'].toString(),
                userType: user.userType,
                username: user.publicProfile.username,
                profileImage: user.publicProfile.profileImage
            };
            return response;
        });
    }
    getUserByReferralCode(referralCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.UserModel.findOne({ referralCode: referralCode });
            return user;
        });
    }
    getUserByCognitoId(cognitoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOne({ cognitoId: cognitoId });
        });
    }
    getUserByChannelArn(channelArn) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOne({ channel: channelArn });
        });
    }
    signUpUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.UserModel.create(user);
        });
    }
    editUsername(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOneAndUpdate({ _id: userId }, { "publicProfile.username": username }, { new: true });
        });
    }
    editProfileImage(userId, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOneAndUpdate({ _id: userId }, { "publicProfile.profileImage": filename }, { new: true });
        });
    }
    editUserSettings(userId, userSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOneAndUpdate({ _id: userId }, { "settings": userSettings }, { new: true });
        });
    }
    updateLiveInfo(userId, liveInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOneAndUpdate({ _id: userId }, liveInfo, { new: true });
        });
    }
    searchByQuery(query, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
            let regex = new RegExp(query, 'i');
            if (query === "ALLENTITIES")
                return User_1.UserModel.find().skip(startIndex).limit(endIndex);
            return yield User_1.UserModel.find({ "publicProfile.username": regex }).skip(startIndex).limit(endIndex);
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.deleteOne({ "_id": userId });
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL1VzZXJSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEseUNBQWlEO0FBQ2pELDZDQUF3QztBQUt4QyxNQUFhLGNBQWM7SUFDdkI7UUFDSSxpQkFBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUssT0FBTyxDQUFDLEVBQVU7O1lBQ3BCLE9BQU8sZ0JBQVMsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDO0tBQUE7SUFFSyxvQkFBb0IsQ0FBQyxFQUFVOztZQUNqQyxNQUFNLElBQUksR0FBRyxNQUFNLGdCQUFTLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxRQUFRLEdBQXFCO2dCQUM3QixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDOUIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRO2dCQUNyQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZO2FBQ2hELENBQUM7WUFDRixPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7SUFFSyxxQkFBcUIsQ0FBQyxZQUFvQjs7WUFDNUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFDLFlBQVksRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO1lBQ25FLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQUVLLGtCQUFrQixDQUFDLFNBQWlCOztZQUN0QyxPQUFPLGdCQUFTLENBQUMsT0FBTyxDQUFDLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztLQUFBO0lBRUssbUJBQW1CLENBQUMsVUFBa0I7O1lBQ3hDLE9BQU8sZ0JBQVMsQ0FBQyxPQUFPLENBQUMsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDO0tBQUE7SUFFSyxVQUFVLENBQUMsSUFBVTs7WUFDdkIsT0FBTyxNQUFNLGdCQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7S0FBQTtJQUVLLFlBQVksQ0FBQyxNQUFjLEVBQUUsUUFBZ0I7O1lBQy9DLE9BQU8sZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUMsRUFBRSxFQUFDLHdCQUF3QixFQUFFLFFBQVEsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7UUFDdkcsQ0FBQztLQUFBO0lBRUssZ0JBQWdCLENBQUMsTUFBYyxFQUFFLFFBQWdCOztZQUNuRCxPQUFPLGdCQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFDLEVBQUUsRUFBQyw0QkFBNEIsRUFBRSxRQUFRLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1FBQzNHLENBQUM7S0FBQTtJQUVLLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxZQUFZOztZQUN2QyxPQUFPLGdCQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFDLEVBQUUsRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFDLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtRQUM3RixDQUFDO0tBQUE7SUFFSyxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQXVGOztZQUNoSCxPQUFPLGdCQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUUsQ0FBQztLQUFBO0lBRUssYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSzs7WUFDbEMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN2QixJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDbkMsSUFBSSxLQUFLLEtBQUssYUFBYTtnQkFDdkIsT0FBTyxnQkFBUyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFN0QsT0FBTyxNQUFNLGdCQUFTLENBQUMsSUFBSSxDQUFDLEVBQUMsd0JBQXdCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BHLENBQUM7S0FBQTtJQUVLLFVBQVUsQ0FBQyxNQUFjOztZQUMzQixPQUFPLGdCQUFTLENBQUMsU0FBUyxDQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUFBO0NBQ0o7QUFsRUQsd0NBa0VDIn0=