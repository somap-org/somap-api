import {connect} from "../libs/mongodb";
import {Post as PostInterface} from "../interfaces/models/post"
import {UserRepository} from "./UserRepository";
import {Comment, CommentModel} from "../models/Comment";
import {PostModel} from "../models/Post";
import {PostRepository} from "./PostRepository";
import {Model} from "mongoose";
import {UserPublicProfile} from "../interfaces/models/userPublicProfile";
import {Comment as CommentAPIInterface} from "../interfaces/models/comment";
import {Like, Like as LikeInterface} from "../interfaces/classes/Like";
import {Comment as CommentSystemInterface} from "../interfaces/classes/Comment"
import {CommentSystem} from "../libs/CommentSystem";
import {LikeModel} from "../models/Like";
import {CommentRepository} from "./CommentRepository";
import {UsersPublicProfile} from "../interfaces/models/usersPublicProfile";

/*
Questa repository gestisce il servizio di commenti. Quando si effettua la lettura o la modifica di un commento cè solo bisogno di conoscere il suo identificativo.
In fase di aggiunta o di eliminazione di un commento invece nasce il bisogno di conoscere qual è il parente di quel commento per permettere di incrementare/decrementare
il contatore dei commenti del parente.
Ogni repository delle entità commentabili devono implementare l'interfaccia Comment "../interfaces/classes/Comment" che all'intero definisce le funzioni per incrementare/decrementare il contatore dei commenti
In questa repository inoltre si definiscono quali sono le entità commentabili.
 */

export class LikeRepository {

    public parentTypes = {
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


    constructor() {
        connect();
    }

    //CRUD operations

    async addLike(like){
            let check = await LikeModel.findOne(like, {_id: 0, parent: 1});
            if (check == null) {
                await LikeModel.create(like);
                return await this.parentRepositories[like.parentType].repository.incrementLike(like.parent);
            } else {
                throw "LIKE_ALREADY_EXISTS";
            }
    }

    async getLikes(parentId, parentType, page, limit): Promise<any> {
        const startIndex = (page - 1) * limit;
        const endIndex = limit;
        return await LikeModel.find({parent: parentId, parentType: parentType}).select("-_id author").populate("author").skip(startIndex).limit(endIndex);
    }

    async deleteLike(parentId, parentType, userId) {
        try {
            await LikeModel.deleteOne({parent: parentId, author: userId});
            return await this.parentRepositories[parentType].repository.decrementLike(parentId);
        } catch (e){
            return e;
        }
    }

}
