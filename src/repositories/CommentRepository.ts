import {connect} from "../libs/mongodb";
import {Post as PostInterface} from "../interfaces/models/post"
import {UserRepository} from "./UserRepository";
import {Comment, CommentModel} from "../models/Comment";
import {PostModel} from "../models/Post";
import {PostRepository} from "./PostRepository";
import {Model} from "mongoose";
import {UserPublicProfile} from "../interfaces/models/userPublicProfile";
import {Comment as CommentAPIInterface} from "../interfaces/models/comment";
import {Comment as CommentInterface} from "../interfaces/classes/Comment";
import {Like as LikeInterface} from "../interfaces/classes/Like";
import {Comment as CommentSystemInterface} from "../interfaces/classes/Comment"
import {CommentSystem} from "../libs/CommentSystem";
import {LikeModel} from "../models/Like";

/*
Questa repository gestisce il servizio di commenti. Quando si effettua la lettura o la modifica di un commento cè solo bisogno di conoscere il suo identificativo.
In fase di aggiunta o di eliminazione di un commento invece nasce il bisogno di conoscere qual è il parente di quel commento per permettere di incrementare/decrementare
il contatore dei commenti del parente.
Ogni repository delle entità commentabili devono implementare l'interfaccia Comment "../interfaces/classes/Comment" che all'intero definisce le funzioni per incrementare/decrementare il contatore dei commenti
In questa repository inoltre si definiscono quali sono le entità commentabili.
 */

export class CommentRepository implements CommentInterface, LikeInterface {

    public parentTypes = {
        POST: "POST",
        COMMENT: "COMMENT"
    };
    private parentRepositories = {
        [this.parentTypes.POST]: {
            repository: new PostRepository()
        },
        [this.parentTypes.COMMENT]: {
            repository: this
        }
    };


    constructor() {
        connect();
    }

    //CRUD operations

    async addComment(comment){
        try {
            await this.parentRepositories[comment.parentType].repository.incrementComment(comment.parent);
            //aggiunge il commento
            return await CommentModel.create(comment);
        } catch (e) {
            return e;
        }
    }

    async getComment(commentId): Promise<Comment> {
        return await CommentModel.findOne({_id: commentId});
    }

    async getComments(parentId, page, limit) {
        const startIndex = (page - 1) * limit;
        const endIndex = limit;
        const comments = await CommentModel.find({parent: parentId}).skip(startIndex).limit(endIndex);
        return comments;
    }

    async editComment(commentId, comment){
        return await CommentModel.findOneAndUpdate({_id: commentId}, comment, { new: true });
    }
    async deleteComment(commentId) {
        try {
            let comment = await CommentModel.findOne({_id: commentId});
            await this.parentRepositories[comment.parentType].repository.decrementComment(comment.parent);
            //Elimina tutti i commenti risposta
            await CommentModel.deleteMany({parent: commentId});
            await LikeModel.deleteMany({parent: commentId});
            //Elimina il commento
            return CommentModel.deleteOne({_id: commentId});
        } catch (e){
            return e;
        }
    }


    // Utilities
    async populate(comment) {
        let author: UserPublicProfile = await new UserRepository().getUserPublicProfile(comment.author);
        let response: CommentAPIInterface = {
            commentId: comment['_id'],
            author: author,
            body: comment.body,
            postedAt: comment.postedAt,
            repliesCount: comment.repliesCount,
            likesCount: comment.likesCount
        }
        return response;
    }

    async incrementComment(commentId){
        return await CommentModel.findOneAndUpdate({_id: commentId}, {
            $inc: {
                repliesCount: 1
            }
        });
    }
    async decrementComment(commentId){
        return await CommentModel.findOneAndUpdate({_id: commentId}, {
            $inc: {
                repliesCount: -1
            }
        });
    }

    async incrementLike(commentId){
        return await CommentModel.findOneAndUpdate({_id: commentId}, {
            $inc: {
                likesCount: 1
            }
        });
    }
    async decrementLike(commentId){
        return await CommentModel.findOneAndUpdate({_id: commentId}, {
            $inc: {
                likesCount: -1
            }
        });
    }

}
