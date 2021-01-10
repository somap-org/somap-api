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
            const endIndex = limit;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zdFJlcG9zaXRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVwb3NpdG9yaWVzL1Bvc3RSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsNkNBQXdDO0FBQ3hDLHlDQUErQztBQUsvQyxxREFBZ0Q7QUFDaEQsK0NBQStDO0FBQy9DLHlDQUF5QztBQUd6QyxNQUFhLGNBQWM7SUFFdkI7UUFDSSxpQkFBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUssT0FBTyxDQUFDLE1BQU07O1lBQ2hCLE9BQU8sZ0JBQVMsQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUM1QyxDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLOztZQUNqQyxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEMsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU8sTUFBTSxnQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkYsQ0FBQztLQUFBO0lBRUssT0FBTyxDQUFDLElBQUk7O1lBQ2QsT0FBTyxNQUFNLGdCQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7S0FBQTtJQUVLLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSTs7WUFDdkIsT0FBTyxNQUFNLGdCQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDaEYsQ0FBQztLQUFBO0lBRUssVUFBVSxDQUFD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