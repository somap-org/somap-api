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
exports.CommentSystem = void 0;
const Comment_1 = require("../models/Comment");
const PostRepository_1 = require("../repositories/PostRepository");
const CommentRepository_1 = require("../repositories/CommentRepository");
class CommentSystem {
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
    }
    addComment(comment, parentType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                comment.parentType = parentType;
                yield this.parentRepositories[parentType].repository.incrementComment(comment.parent);
                return yield Comment_1.CommentModel.create(comment);
            }
            catch (e) {
                return e;
            }
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let comment = yield Comment_1.CommentModel.findOne({ _id: commentId });
                yield this.parentRepositories[comment.parentType].repository.decrementComment(comment.parentType);
                yield Comment_1.CommentModel.deleteMany({ parent: commentId });
                return Comment_1.CommentModel.deleteOne({ _id: commentId });
            }
            catch (e) {
                return e;
            }
        });
    }
}
exports.CommentSystem = CommentSystem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWVudFN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWJzL0NvbW1lbnRTeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSwrQ0FBd0Q7QUFPeEQsbUVBQThEO0FBQzlELHlFQUFvRTtBQUlwRSxNQUFhLGFBQWE7SUFldEI7UUFiUSxnQkFBVyxHQUFHO1lBQ2xCLElBQUksRUFBRSxNQUFNO1lBQ1osT0FBTyxFQUFFLFNBQVM7U0FDckIsQ0FBQztRQUNNLHVCQUFrQixHQUFHO1lBQ3pCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDckIsVUFBVSxFQUFFLElBQUksK0JBQWMsRUFBRTthQUNuQztZQUNELENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDeEIsVUFBVSxFQUFFLElBQUkscUNBQWlCLEVBQUU7YUFDdEM7U0FDSixDQUFDO0lBRWEsQ0FBQztJQUdWLFVBQVUsQ0FBQyxPQUFPLEVBQUUsVUFBa0I7O1lBQ3hDLElBQUk7Z0JBQ0EsT0FBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7Z0JBQ2hDLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRXRGLE9BQU8sTUFBTSxzQkFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUM3QztZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxDQUFDO2FBQ1o7UUFDTCxDQUFDO0tBQUE7SUFFSyxhQUFhLENBQUMsU0FBUzs7WUFDekIsSUFBSTtnQkFDQSxJQUFJLE9BQU8sR0FBRyxNQUFNLHNCQUFZLENBQUMsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7Z0JBQzNELE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUVsRyxNQUFNLHNCQUFZLENBQUMsVUFBVSxDQUFDLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7Z0JBRW5ELE9BQU8sc0JBQVksQ0FBQyxTQUFTLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQzthQUNuRDtZQUFDLE9BQU8sQ0FBQyxFQUFDO2dCQUNQLE9BQU8sQ0FBQyxDQUFDO2FBQ1o7UUFDTCxDQUFDO0tBQUE7Q0FFSjtBQTFDRCxzQ0EwQ0MifQ==