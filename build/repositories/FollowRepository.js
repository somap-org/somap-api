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
            const endIndex = limit;
            return yield Follower_1.FollowerModel.find({ _t: id }).select("-_id _f").populate('_f').skip(startIndex).limit(endIndex);
        });
    }
    getFollowing(id, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9sbG93UmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZXBvc2l0b3JpZXMvRm9sbG93UmVwb3NpdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHlDQUFpRDtBQUNqRCw2Q0FBd0M7QUFHeEMsaURBQWlEO0FBQ2pELG1EQUFtRDtBQUduRCxNQUFhLGdCQUFnQjtJQUN6QjtRQUNJLGlCQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFSyxZQUFZLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLOztZQUM5QixNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sTUFBTSx3QkFBYSxDQUFDLElBQUksQ0FBQyxFQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoSCxDQUFDO0tBQUE7SUFDSyxZQUFZLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLOztZQUM5QixNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sTUFBTSwwQkFBYyxDQUFDLElBQUksQ0FBQyxFQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqSCxDQUFDO0tBQUE7SUFDSyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVE7O1lBQ3pCLElBQUk7Z0JBQ0EsSUFBSSxDQUFDLENBQUEsTUFBTSx3QkFBYSxDQUFDLE9BQU8sQ0FBQztvQkFDN0IsRUFBRSxFQUFFLE1BQU07b0JBQ1YsRUFBRSxFQUFFLFFBQVE7aUJBQ2YsQ0FBQyxDQUFBLEVBQUU7b0JBRUEsSUFBSSxNQUFNLHdCQUFhLENBQUMsTUFBTSxDQUFDO3dCQUMzQixFQUFFLEVBQUUsTUFBTTt3QkFDVixFQUFFLEVBQUUsUUFBUTtxQkFDZixDQUFDLEVBQUU7d0JBQ0EsTUFBTSxnQkFBUyxDQUFDLGdCQUFnQixDQUFDOzRCQUM3QixHQUFHLEVBQUUsTUFBTTt5QkFDZCxFQUFFOzRCQUNDLElBQUksRUFBRTtnQ0FDRix5QkFBeUIsRUFBRSxDQUFDOzZCQUMvQjt5QkFDSixDQUFDLENBQUM7cUJBQ047b0JBQ0QsSUFBSSxNQUFNLDBCQUFjLENBQUMsTUFBTSxDQUFDO3dCQUM1QixFQUFFLEVBQUUsUUFBUTt3QkFDWixFQUFFLEVBQUUsTUFBTTtxQkFDYixDQUFDLEVBQUU7d0JBQ0EsTUFBTSxnQkFBUyxDQUFDLGdCQUFnQixDQUFDOzRCQUM3QixHQUFHLEVBQUUsUUFBUTt5QkFDaEIsRUFBRTs0QkFDQyxJQUFJLEVBQUU7Z0NBQ0YseUJBQXlCLEVBQUUsQ0FBQzs2QkFDL0I7eUJBQ0osQ0FBQyxDQUFDO3FCQUNOO29CQUNELE9BQU8sSUFBSSxDQUFDO2lCQUNmO3FCQUFNO29CQUNILE9BQU8sS0FBSyxDQUFDO2lCQUNoQjthQUNKO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxHQUFHLENBQUM7YUFDZDtRQUNMLENBQUM7S0FBQTtJQUNLLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUTs7WUFDM0IsSUFBSTtnQkFDQSxJQUFHLE1BQU0sd0JBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDcEMsRUFBRSxFQUFFLE1BQU07b0JBQ1YsRUFBRSxFQUFFLFFBQVE7aUJBQ2YsQ0FBQyxFQUFDO29CQUNDLE1BQU0sZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQzt3QkFDN0IsR0FBRyxFQUFFLE1BQU07cUJBQ2QsRUFBRTt3QkFDQyxJQUFJLEVBQUU7NEJBQ0YseUJBQXlCLEVBQUUsQ0FBQyxDQUFDO3lCQUNoQztxQkFDSixDQUFDLENBQUM7aUJBQ047Z0JBQ0QsSUFBRyxNQUFNLDBCQUFjLENBQUMsZ0JBQWdCLENBQUM7b0JBQ3JDLEVBQUUsRUFBRSxRQUFRO29CQUNaLEVBQUUsRUFBRSxNQUFNO2lCQUNiLENBQUMsRUFBQztvQkFDQyxNQUFNLGdCQUFTLENBQUMsZ0JBQWdCLENBQUM7d0JBQzdCLEdBQUcsRUFBRSxRQUFRO3FCQUNoQixFQUFFO3dCQUNDLElBQUksRUFBRTs0QkFDRix5QkFBeUIsRUFBRSxDQUFDLENBQUM7eUJBQ2hDO3FCQUNKLENBQUMsQ0FBQztpQkFDTjtnQkFDRCxPQUFPLElBQUksQ0FBQzthQUNmO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsT0FBTyxHQUFHLENBQUM7YUFDZDtRQUNMLENBQUM7S0FBQTtDQUNKO0FBckZELDRDQXFGQyJ9