import {connect} from "../libs/mongodb";
import {Post as PostInterface} from "../interfaces/models/post"
import {Comment, CommentModel} from "../models/Comment";
import {PostModel} from "../models/Post";
import {Model} from "mongoose";
import {UserPublicProfile} from "../interfaces/models/userPublicProfile";
import {Comment as CommentAPIInterface} from "../interfaces/models/comment";
import {Comment as CommentInterface} from "../interfaces/classes/Comment";
import {Comment as CommentSystemInterface} from "../interfaces/classes/Comment"
import {PostRepository} from "../repositories/PostRepository";
import {CommentRepository} from "../repositories/CommentRepository";
import {UserRepository} from "../repositories/UserRepository";


export class CommentSystem {

    private parentTypes = {
        POST: "POST",
        COMMENT: "COMMENT"
    };
    private parentRepositories = {
        [this.parentTypes.POST]: {
            repository: new PostRepository()
        },
        [this.parentTypes.COMMENT]: {
            repository: new CommentRepository()
        }
    };

    constructor() {}


    async addComment(comment, parentType: string){
        try {
            comment.parentType = parentType;
            await this.parentRepositories[parentType].repository.incrementComment(comment.parent);
            //aggiunge il commento
            return await CommentModel.create(comment);
        } catch (e) {
            return e;
        }
    }

    async deleteComment(commentId) {
        try {
            let comment = await CommentModel.findOne({_id: commentId});
            await this.parentRepositories[comment.parentType].repository.decrementComment(comment.parentType);
            //Elimina tutti i commenti risposta
            await CommentModel.deleteMany({parent: commentId});
            //Elimina il commento
            return CommentModel.deleteOne({_id: commentId});
        } catch (e){
            return e;
        }
    }

}
