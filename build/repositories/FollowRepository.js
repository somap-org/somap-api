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
exports.FollowRepository = void 0;
const User_1 = require("../models/User");
const mongodb_1 = require("../libs/mongodb");
const Follower_1 = require("../models/Follower");
const Following_1 = require("../models/Following");
class FollowRepository {
    constructor() {
        mongodb_1.connect();
    }
    getFollowers(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            return yield Follower_1.FollowerModel.find({ _t: id }).select("-_id _f").populate('_f').skip(startIndex).limit(endIndex);
        });
    }
    getFollowing(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            return yield Following_1.FollowingModel.find({ _t: id }).select("-_id _f").populate('_f').skip(startIndex).limit(endIndex);
        });
    }
    follow(userId, targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(yield Follower_1.FollowerModel.findOne({
                    _f: userId,
                    _t: targetId
                }))) {
                    if (yield Follower_1.FollowerModel.create({
                        _f: userId,
                        _t: targetId
                    })) {
                        yield User_1.UserModel.findOneAndUpdate({
                            _id: userId
                        }, {
                            $inc: {
                                "publicProfile.following": 1
                            }
                        });
                    }
                    if (yield Following_1.FollowingModel.create({
                        _f: targetId,
                        _t: userId
                    })) {
                        yield User_1.UserModel.findOneAndUpdate({
                            _id: targetId
                        }, {
                            $inc: {
                                "publicProfile.followers": 1
                            }
                        });
                    }
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (err) {
                return err;
            }
        });
    }
    unfollow(userId, targetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (yield Follower_1.FollowerModel.findOneAndDelete({
                    _f: userId,
                    _t: targetId
                })) {
                    yield User_1.UserModel.findOneAndUpdate({
                        _id: userId
                    }, {
                        $inc: {
                            "publicProfile.following": -1
                        }
                    });
                }
                if (yield Following_1.FollowingModel.findOneAndDelete({
                    _f: targetId,
                    _t: userId
                })) {
                    yield User_1.UserModel.findOneAndUpdate({
                        _id: targetId
                    }, {
                        $inc: {
                            "publicProfile.followers": -1
                        }
                    });
                }
                return true;
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.FollowRepository = FollowRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9sbG93UmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvc2l0b3JpZXMvRm9sbG93UmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlDQUFpRDtBQUNqRCw2Q0FBd0M7QUFHeEMsaURBQWlEO0FBQ2pELG1EQUFtRDtBQUduRCxNQUFhLGdCQUFnQjtJQUN6QjtRQUNJLGlCQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFSyxZQUFZLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLOztZQUM5QixNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUM5QixPQUFPLE1BQU0sd0JBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEgsQ0FBQztLQUFBO0lBQ0ssWUFBWSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSzs7WUFDOUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3RDLE1BQU0sUUFBUSxHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7WUFDOUIsT0FBTyxNQUFNLDBCQUFjLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pILENBQUM7S0FBQTtJQUNLLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUTs7WUFDekIsSUFBSTtnQkFDQSxJQUFJLENBQUMsQ0FBQSxNQUFNLHdCQUFhLENBQUMsT0FBTyxDQUFDO29CQUM3QixFQUFFLEVBQUUsTUFBTTtvQkFDVixFQUFFLEVBQUUsUUFBUTtpQkFDZixDQUFDLENBQUEsRUFBRTtvQkFFQSxJQUFJLE1BQU0sd0JBQWEsQ0FBQyxNQUFNLENBQUM7d0JBQzNCLEVBQUUsRUFBRSxNQUFNO3dCQUNWLEVBQUUsRUFBRSxRQUFRO3FCQUNmLENBQUMsRUFBRTt3QkFDQSxNQUFNLGdCQUFTLENBQUMsZ0JBQWdCLENBQUM7NEJBQzdCLEdBQUcsRUFBRSxNQUFNO3lCQUNkLEVBQUU7NEJBQ0MsSUFBSSxFQUFFO2dDQUNGLHlCQUF5QixFQUFFLENBQUM7NkJBQy9CO3lCQUNKLENBQUMsQ0FBQztxQkFDTjtvQkFDRCxJQUFJLE1BQU0sMEJBQWMsQ0FBQyxNQUFNLENBQUM7d0JBQzVCLEVBQUUsRUFBRSxRQUFRO3dCQUNaLEVBQUUsRUFBRSxNQUFNO3FCQUNiLENBQUMsRUFBRTt3QkFDQSxNQUFNLGdCQUFTLENBQUMsZ0JBQWdCLENBQUM7NEJBQzdCLEdBQUcsRUFBRSxRQUFRO3lCQUNoQixFQUFFOzRCQUNDLElBQUksRUFBRTtnQ0FDRix5QkFBeUIsRUFBRSxDQUFDOzZCQUMvQjt5QkFDSixDQUFDLENBQUM7cUJBQ047b0JBQ0QsT0FBTyxJQUFJLENBQUM7aUJBQ2Y7cUJBQU07b0JBQ0gsT0FBTyxLQUFLLENBQUM7aUJBQ2hCO2FBQ0o7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixPQUFPLEdBQUcsQ0FBQzthQUNkO1FBQ0wsQ0FBQztLQUFBO0lBQ0ssUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFROztZQUMzQixJQUFJO2dCQUNBLElBQUcsTUFBTSx3QkFBYSxDQUFDLGdCQUFnQixDQUFDO29CQUNwQyxFQUFFLEVBQUUsTUFBTTtvQkFDVixFQUFFLEVBQUUsUUFBUTtpQkFDZixDQUFDLEVBQUM7b0JBQ0MsTUFBTSxnQkFBUyxDQUFDLGdCQUFnQixDQUFDO3dCQUM3QixHQUFHLEVBQUUsTUFBTTtxQkFDZCxFQUFFO3dCQUNDLElBQUksRUFBRTs0QkFDRix5QkFBeUIsRUFBRSxDQUFDLENBQUM7eUJBQ2hDO3FCQUNKLENBQUMsQ0FBQztpQkFDTjtnQkFDRCxJQUFHLE1BQU0sMEJBQWMsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDckMsRUFBRSxFQUFFLFFBQVE7b0JBQ1osRUFBRSxFQUFFLE1BQU07aUJBQ2IsQ0FBQyxFQUFDO29CQUNDLE1BQU0sZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQzt3QkFDN0IsR0FBRyxFQUFFLFFBQVE7cUJBQ2hCLEVBQUU7d0JBQ0MsSUFBSSxFQUFFOzRCQUNGLHlCQUF5QixFQUFFLENBQUMsQ0FBQzt5QkFDaEM7cUJBQ0osQ0FBQyxDQUFDO2lCQUNOO2dCQUNELE9BQU8sSUFBSSxDQUFDO2FBQ2Y7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixPQUFPLEdBQUcsQ0FBQzthQUNkO1FBQ0wsQ0FBQztLQUFBO0NBQ0o7QUFyRkQsNENBcUZDIn0=