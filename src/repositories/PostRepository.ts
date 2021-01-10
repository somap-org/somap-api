import {connect} from "../libs/mongodb";
import {Post, PostModel} from "../models/Post";
import {Post as PostInterface} from "../interfaces/models/post"
import {Comment} from "../interfaces/classes/Comment"
import {Like as LikeInterface} from "../interfaces/classes/Like"
import {ActivityModel} from "../models/Activity";
import {UserRepository} from "./UserRepository";
import {CommentModel} from "../models/Comment";
import {LikeModel} from "../models/Like";


export class PostRepository implements Comment, LikeInterface {

    constructor() {
        connect();
    }

    async getPost(postId): Promise<Post> {
        return PostModel.findOne({_id: postId});
    }

    async getPosts(profileId, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = limit;
        return await PostModel.find({profile: profileId}).skip(startIndex).limit(endIndex);
    }

    async addPost(post){
        return await PostModel.create(post);
    }

    async editPost(postId, post){
        return await PostModel.findOneAndUpdate({_id: postId}, post, { new: true });
    }

    async deletePost(postId) {
        try {
            //Modifica i post in cui è stato condiviso impostando il campo sharedPost nullo
            await PostModel.updateMany({sharedPost: postId}, {sharedPost: null});
            //Prende le informazioni del post da eliminare
            let post = await PostModel.findOne({_id: postId});
            //Decrementa il contatore delle condivisioni del post condiviso (se esiste)
            if (post.sharedPost) {
                let sharedPost = await PostModel.findOne({_id: post.sharedPost});
                if (sharedPost) {
                    await this.decrementShare(sharedPost['_id']);
                }
            }
            await CommentModel.deleteMany({parent: postId});
            await LikeModel.deleteMany({parent: postId});
            //Elimina il post
            await PostModel.findOneAndDelete({_id: postId});
            return true;
        } catch (e){
            return e;
        }
    }

    async populatePost(post) {
        let userRepo = new UserRepository();
        let author = await userRepo.getUserPublicProfile(post.author.toString());
        let embeddedSharedPost = null;
        if (post.sharedPost) {
            let sharedPost = await this.getPost(post.sharedPost.toString());
            let authorSharedPost = await userRepo.getUserPublicProfile(sharedPost.author.toString());
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

        const response:PostInterface = {
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
    }

    async incrementShare(postId){
        return await PostModel.findOneAndUpdate({_id: postId}, {
            $inc: {
                sharedCount: 1
            }
        });
    }
    async decrementShare(postId){
        return await PostModel.findOneAndUpdate({_id: postId}, {
            $inc: {
                sharedCount: -1
            }
        });
    }

    async incrementLike(postId){

        return await PostModel.findOneAndUpdate({_id: postId}, {
            $inc: {
                likesCount: 1
            }
        });
    }
    async decrementLike(postId){
        return await PostModel.findOneAndUpdate({_id: postId}, {
            $inc: {
                likesCount: -1
            }
        });
    }

    async incrementComment(postId){
        return await PostModel.findOneAndUpdate({_id: postId}, {
            $inc: {
                commentsCount: 1
            }
        });
    }
    async decrementComment(postId){
        return await PostModel.findOneAndUpdate({_id: postId}, {
            $inc: {
                commentsCount: -1
            }
        });
    }

}
