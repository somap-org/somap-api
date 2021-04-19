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
exports.CommentRepository = void 0;
const mongodb_1 = require("../libs/mongodb");
const UserRepository_1 = require("./UserRepository");
const Comment_1 = require("../models/Comment");
const PostRepository_1 = require("./PostRepository");
const Like_1 = require("../models/Like");
class CommentRepository {
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
                repository: this
            }
        };
        mongodb_1.connect();
    }
    addComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.parentRepositories[comment.parentType].repository.incrementComment(comment.parent);
                return yield Comment_1.CommentModel.create(comment);
            }
            catch (e) {
                return e;
            }
        });
    }
    getComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.CommentModel.findOne({ _id: commentId });
        });
    }
    getComments(parentId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = limit;
            const comments = yield Comment_1.CommentModel.find({ parent: parentId }).skip(startIndex).limit(endIndex);
            return comments;
        });
    }
    editComment(commentId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.CommentModel.findOneAndUpdate({ _id: commentId }, comment, { new: true });
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let comment = yield Comment_1.CommentModel.findOne({ _id: commentId });
                yield this.parentRepositories[comment.parentType].repository.decrementComment(comment.parent);
                yield Comment_1.CommentModel.deleteMany({ parent: commentId });
                yield Like_1.LikeModel.deleteMany({ parent: commentId });
                return Comment_1.CommentModel.deleteOne({ _id: commentId });
            }
            catch (e) {
                return e;
            }
        });
    }
    populate(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            let author = yield new UserRepository_1.UserRepository().getUserPublicProfile(comment.author);
            let response = {
                commentId: comment['_id'],
                author: author,
                body: comment.body,
                postedAt: comment.postedAt,
                repliesCount: comment.repliesCount,
                likesCount: comment.likesCount
            };
            return response;
        });
    }
    incrementComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.CommentModel.findOneAndUpdate({ _id: commentId }, {
                $inc: {
                    repliesCount: 1
                }
            });
        });
    }
    decrementComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.CommentModel.findOneAndUpdate({ _id: commentId }, {
                $inc: {
                    repliesCount: -1
                }
            });
        });
    }
    incrementLike(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.CommentModel.findOneAndUpdate({ _id: commentId }, {
                $inc: {
                    likesCount: 1
                }
            });
        });
    }
    decrementLike(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.CommentModel.findOneAndUpdate({ _id: commentId }, {
                $inc: {
                    likesCount: -1
                }
            });
        });
    }
}
exports.CommentRepository = CommentRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWVudFJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL0NvbW1lbnRSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkNBQXdDO0FBRXhDLHFEQUFnRDtBQUNoRCwrQ0FBd0Q7QUFFeEQscURBQWdEO0FBUWhELHlDQUF5QztBQVV6QyxNQUFhLGlCQUFpQjtJQWdCMUI7UUFkTyxnQkFBVyxHQUFHO1lBQ2pCLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDckIsQ0FBQztRQUNNLHVCQUFrQixHQUFHO1lBQ3pCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsVUFBVSxFQUFFLElBQUksK0JBQWMsRUFBRTthQUNuQztZQUNELENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDeEIsVUFBVSxFQUFFLElBQUk7YUFDbkI7U0FDSixDQUFDO1FBSUUsaUJBQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUlLLFVBQVUsQ0FBQyxPQUFPOztZQUNwQixJQUFJO2dCQUNBLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUU5RixPQUFPLE1BQU0sc0JBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDN0M7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixPQUFPLENBQUMsQ0FBQzthQUNaO1FBQ0wsQ0FBQztLQUFBO0lBRUssVUFBVSxDQUFDLFNBQVM7O1lBQ3RCLE9BQU8sTUFBTSxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7S0FBQTtJQUVLLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUs7O1lBQ25DLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUN0QyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdkIsTUFBTSxRQUFRLEdBQUcsTUFBTSxzQkFBWSxDQUFDLElBQUksQ0FBQyxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDOUYsT0FBTyxRQUFRLENBQUM7UUFDcEIsQ0FBQztLQUFBO0lBRUssV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPOztZQUNoQyxPQUFPLE1BQU0sc0JBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6RixDQUFDO0tBQUE7SUFDSyxhQUFhLENBQUMsU0FBUzs7WUFDekIsSUFBSTtnQkFDQSxJQUFJLE9BQU8sR0FBRyxNQUFNLHNCQUFZLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7Z0JBQzNELE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUU5RixNQUFNLHNCQUFZLENBQUMsVUFBVSxDQUFDLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sZ0JBQVMsQ0FBQyxVQUFVLENBQUMsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztnQkFFaEQsT0FBTyxzQkFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO2FBQ25EO1lBQUMsT0FBTyxDQUFDLEVBQUM7Z0JBQ1AsT0FBTyxDQUFDLENBQUM7YUFDWjtRQUNMLENBQUM7S0FBQTtJQUlLLFFBQVEsQ0FBQyxPQUFPOztZQUNsQixJQUFJLE1BQU0sR0FBc0IsTUFBTSxJQUFJLCtCQUFjLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEcsSUFBSSxRQUFRLEdBQXdCO2dCQUNoQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFDekIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO2dCQUNsQixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVE7Z0JBQzFCLFlBQVksRUFBRSxPQUFPLENBQUMsWUFBWTtnQkFDbEMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO2FBQ2pDLENBQUE7WUFDRCxPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7SUFFSyxnQkFBZ0IsQ0FBQyxTQUFTOztZQUM1QixPQUFPLE1BQU0sc0JBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsRUFBRTtnQkFDekQsSUFBSSxFQUFFO29CQUNGLFlBQVksRUFBRSxDQUFDO2lCQUNsQjthQUNKLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtJQUNLLGdCQUFnQixDQUFDLFNBQVM7O1lBQzVCLE9BQU8sTUFBTSxzQkFBWSxDQUFDLGdCQUFnQixDQUFDLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxFQUFFO2dCQUN6RCxJQUFJLEVBQUU7b0JBQ0YsWUFBWSxFQUFFLENBQUMsQ0FBQztpQkFDbkI7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7SUFFSyxhQUFhLENBQUMsU0FBUzs7WUFDekIsT0FBTyxNQUFNLHNCQUFZLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLEVBQUU7Z0JBQ3pELElBQUksRUFBRTtvQkFDRixVQUFVLEVBQUUsQ0FBQztpQkFDaEI7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7SUFDSyxhQUFhLENBQUMsU0FBUzs7WUFDekIsT0FBTyxNQUFNLHNCQUFZLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLEVBQUU7Z0JBQ3pELElBQUksRUFBRTtvQkFDRixVQUFVLEVBQUUsQ0FBQyxDQUFDO2lCQUNqQjthQUNKLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtDQUVKO0FBekdELDhDQXlHQyJ9