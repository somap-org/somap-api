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
exports.PostRepository = void 0;
const mongodb_1 = require("../libs/mongodb");
const Post_1 = require("../models/Post");
const UserRepository_1 = require("./UserRepository");
const Comment_1 = require("../models/Comment");
const Like_1 = require("../models/Like");
class PostRepository {
    constructor() {
        mongodb_1.connect();
    }
    getPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Post_1.PostModel.findOne({ _id: postId });
        });
    }
    getPosts(profileId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            return yield Post_1.PostModel.find({ profile: profileId }).skip(startIndex).limit(endIndex);
        });
    }
    addPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Post_1.PostModel.create(post);
        });
    }
    editPost(postId, post) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Post_1.PostModel.findOneAndUpdate({ _id: postId }, post, { new: true });
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Post_1.PostModel.updateMany({ sharedPost: postId }, { sharedPost: null });
                let post = yield Post_1.PostModel.findOne({ _id: postId });
                if (post.sharedPost) {
                    let sharedPost = yield Post_1.PostModel.findOne({ _id: post.sharedPost });
                    if (sharedPost) {
                        yield this.decrementShare(sharedPost['_id']);
                    }
                }
                yield Comment_1.CommentModel.deleteMany({ parent: postId });
                yield Like_1.LikeModel.deleteMany({ parent: postId });
                yield Post_1.PostModel.findOneAndDelete({ _id: postId });
                return true;
            }
            catch (e) {
                return e;
            }
        });
    }
    populatePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            let userRepo = new UserRepository_1.UserRepository();
            let author = yield userRepo.getUserPublicProfile(post.author.toString());
            let embeddedSharedPost = null;
            if (post.sharedPost) {
                let sharedPost = yield this.getPost(post.sharedPost.toString());
                let authorSharedPost = yield userRepo.getUserPublicProfile(sharedPost.author.toString());
                embeddedSharedPost = {
                    postId: sharedPost['_id'],
                    author: authorSharedPost,
                    postedAt: sharedPost.postedAt,
                    body: sharedPost.body,
                    medias: sharedPost.mediaUri || [],
                    sharedCount: sharedPost.sharedCount,
                    commentsCount: sharedPost.commentsCount,
                    likesCount: sharedPost.likesCount,
                    sharedPost: null
                };
            }
            const response = {
                postId: post['_id'],
                author: author,
                postedAt: post.postedAt,
                body: post.body,
                medias: post.medias || [],
                sharedCount: post.sharedCount,
                commentsCount: post.commentsCount,
                likesCount: post.likesCount,
                sharedPost: embeddedSharedPost || null
            };
            return response;
        });
    }
    incrementShare(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Post_1.PostModel.findOneAndUpdate({ _id: postId }, {
                $inc: {
                    sharedCount: 1
                }
            });
        });
    }
    decrementShare(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Post_1.PostModel.findOneAndUpdate({ _id: postId }, {
                $inc: {
                    sharedCount: -1
                }
            });
        });
    }
    incrementLike(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Post_1.PostModel.findOneAndUpdate({ _id: postId }, {
                $inc: {
                    likesCount: 1
                }
            });
        });
    }
    decrementLike(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Post_1.PostModel.findOneAndUpdate({ _id: postId }, {
                $inc: {
                    likesCount: -1
                }
            });
        });
    }
    incrementComment(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Post_1.PostModel.findOneAndUpdate({ _id: postId }, {
                $inc: {
                    commentsCount: 1
                }
            });
        });
    }
    decrementComment(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Post_1.PostModel.findOneAndUpdate({ _id: postId }, {
                $inc: {
                    commentsCount: -1
                }
            });
        });
    }
}
exports.PostRepository = PostRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zdFJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL1Bvc3RSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkNBQXdDO0FBQ3hDLHlDQUErQztBQUsvQyxxREFBZ0Q7QUFDaEQsK0NBQStDO0FBQy9DLHlDQUF5QztBQUd6QyxNQUFhLGNBQWM7SUFFdkI7UUFDSSxpQkFBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUssT0FBTyxDQUFDLE1BQU07O1lBQ2hCLE9BQU8sZ0JBQVMsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLOztZQUNqQyxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUM5QixPQUFPLE1BQU0sZ0JBQVMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FBQyxJQUFJOztZQUNkLE9BQU8sTUFBTSxnQkFBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsTUFBTSxFQUFFLElBQUk7O1lBQ3ZCLE9BQU8sTUFBTSxnQkFBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBQyxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7S0FBQTtJQUVL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