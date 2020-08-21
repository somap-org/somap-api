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
            const endIndex = page * limit;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWVudFJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL0NvbW1lbnRSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkNBQXdDO0FBRXhDLHFEQUFnRDtBQUNoRCwrQ0FBd0Q7QUFFeEQscURBQWdEO0FBUWhELHlDQUF5QztBQVV6QyxNQUFhLGlCQUFpQjtJQWdCMUI7UUFkTyxnQkFBVyxHQUFHO1lBQ2pCLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDckIsQ0FBQztRQUNNLHVCQUFrQixHQUFHO1lBQ3pCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsVUFBVSxFQUFFLElBQUksK0JBQWMsRUFBRTthQUNuQztZQUNELENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDeEIsVUFBVSxFQUFFLElBQUk7YUFDbkI7U0FDSixDQUFDO1FBSUUsaUJBQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUlLLFVBQVUsQ0FBQyxPQUFPOztZQUNwQixJQUFJO2dCQUNBLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUU5RixPQUFPLE1BQU0sc0JBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDN0M7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixPQUFPLENBQUMsQ0FBQzthQUNaO1FBQ0wsQ0FBQztLQUFBO0lBRUssVUFBVSxDQUFDLFNBQVM7O1lBQ3RCLE9BQU8sTUFBTSxzQkFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7S0FBQTtJQUVLLFdBQVcs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