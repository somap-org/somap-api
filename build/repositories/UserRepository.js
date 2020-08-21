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
                profileImage: user.publicProfile.profileImage,
                followers: user.publicProfile.followers,
                following: user.publicProfile.following
            };
            return response;
        });
    }
    getUserByCognitoId(cognitoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOne({ cognitoId: cognitoId });
        });
    }
    signUpUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.create(user);
        });
    }
    editUsername(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOneAndUpdate({ _id: userId }, { "publicProfile.username": username }, { new: true });
        });
    }
    editUserSettings(userId, userSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.findOneAndUpdate({ _id: userId }, { "settings": userSettings }, { new: true });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.UserModel.deleteOne({ "_id": userId });
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlclJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL1VzZXJSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEseUNBQWlEO0FBQ2pELDZDQUF3QztBQUt4QyxNQUFhLGNBQWM7SUFDdkI7UUFDSSxpQkFBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUssT0FBTyxDQUFDLEVBQVU7O1lBQ3BCLE9BQU8sZ0JBQVMsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQztRQUN4QyxDQUFDO0tBQUE7SUFFSyxvQkFBb0IsQ0FBQyxFQUFVOztZQUNqQyxNQUFNLElBQUksR0FBRyxNQUFNLGdCQUFTLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxRQUFRLEdBQXFCO2dCQUM3QixNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRTtnQkFDOUIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2dCQUN2QixRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRO2dCQUNyQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZO2dCQUM3QyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTO2dCQUN2QyxTQUFTLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTO2FBQzFDLENBQUM7WUFDRixPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7SUFFSyxrQkFBa0IsQ0FBQyxTQUFpQjs7WUFDdEMsT0FBTyxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7S0FBQTtJQUVLLFVBQVUsQ0FBQyxJQUFVOztZQUN2QixPQUFPLGdCQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xDLENBQUM7S0FBQTtJQUVLLFlBQVksQ0FBQyxNQUFjLEVBQUUsUUFBZ0I7O1lBQy9DLE9BQU8sZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUMsRUFBRSxFQUFDLHdCQUF3QixFQUFFLFFBQVEsRUFBQyxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7UUFDdkcsQ0FBQztLQUFBO0lBRUssZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFlBQVk7O1lBQ3ZDLE9BQU8sZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUMsRUFBRSxFQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUMsRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO1FBQzdGLENBQUM7S0FBQTtJQUNLLFVBQVUsQ0FBQyxNQUFjOztZQUMzQixPQUFPLGdCQUFTLENBQUMsU0FBUyxDQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUFBO0NBQ0o7QUF4Q0Qsd0NBd0NDIn0=