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
exports.LikeRepository = void 0;
const mongodb_1 = require("../libs/mongodb");
const PostRepository_1 = require("./PostRepository");
const Like_1 = require("../models/Like");
const CommentRepository_1 = require("./CommentRepository");
class LikeRepository {
    constructor() {
        this.parentTypes = {
            POST: "POST",
            COMMENT: "COMMENT"
        };
        this.parentRepositories = {
            [this.parentTypes.POST]: {
                repository: new PostRepository_1.PostRepository()
            },
            [this.parentTypes.COMMENT]: {
                repository: new CommentRepository_1.CommentRepository()
            }
        };
        mongodb_1.connect();
    }
    addLike(like) {
        return __awaiter(this, void 0, void 0, function* () {
            let check = yield Like_1.LikeModel.findOne(like, { _id: 0, parent: 1 });
            if (check == null) {
                yield Like_1.LikeModel.create(like);
                return yield this.parentRepositories[like.parentType].repository.incrementLike(like.parent);
            }
            else {
                throw "LIKE_ALREADY_EXISTS";
            }
        });
    }
    getLikes(parentId, parentType, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
            return yield Like_1.LikeModel.find({ parent: parentId, parentType: parentType }).select("-_id author").populate("author").skip(startIndex).limit(endIndex);
        });
    }
    deleteLike(parentId, parentType, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Like_1.LikeModel.deleteOne({ parent: parentId, author: userId });
                return yield this.parentRepositories[parentType].repository.decrementLike(parentId);
            }
            catch (e) {
                return e;
            }
        });
    }
}
exports.LikeRepository = LikeRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlrZVJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL0xpa2VSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkNBQXdDO0FBS3hDLHFEQUFnRDtBQU9oRCx5Q0FBeUM7QUFDekMsMkRBQXNEO0FBV3RELE1BQWEsY0FBYztJQWdCdkI7UUFkTyxnQkFBVyxHQUFHO1lBQ2pCLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDckIsQ0FBQztRQUNNLHVCQUFrQixHQUFHO1lBQ3pCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsVUFBVSxFQUFFLElBQUksK0JBQWMsRUFBRTthQUNuQztZQUNELENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDeEIsVUFBVSxFQUFFLElBQUkscUNBQWlCLEVBQUU7YUFDdEM7U0FDSixDQUFDO1FBSUUsaUJBQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUlLLE9BQU8sQ0FBQyxJQUFJOztZQUNWLElBQUksS0FBSyxHQUFHLE1BQU0sZ0JBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUMvRCxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7Z0JBQ2YsTUFBTSxnQkFBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0IsT0FBTyxNQUFNLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDL0Y7aUJBQU07Z0JBQ0gsTUFBTSxxQkFBcUIsQ0FBQzthQUMvQjtRQUNULENBQUM7S0FBQTtJQUVLLFFBQVEsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLOztZQUM1QyxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sTUFBTSxnQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RKLENBQUM7S0FBQTtJQUVLLFVBQVUsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLE1BQU07O1lBQ3pDLElBQUk7Z0JBQ0EsTUFBTSxnQkFBUyxDQUFDLFNBQVMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7Z0JBQzlELE9BQU8sTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUN2RjtZQUFDLE9BQU8sQ0FBQyxFQUFDO2dCQUNQLE9BQU8sQ0FBQyxDQUFDO2FBQ1o7UUFDTCxDQUFDO0tBQUE7Q0FFSjtBQS9DRCx3Q0ErQ0MifQ==