var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = exports.Comment = void 0;
const typegoose_1 = require("@hasezoey/typegoose");
const mongoose = require("mongoose");
class Comment extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Comment.prototype, "parent", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Comment.prototype, "parentType", void 0);
__decorate([
    typegoose_1.prop({ required: true, ref: 'User' }),
    __metadata("design:type", Object)
], Comment.prototype, "author", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Comment.prototype, "postedAt", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Comment.prototype, "body", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Number)
], Comment.prototype, "repliesCount", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Number)
], Comment.prototype, "likesCount", void 0);
exports.Comment = Comment;
exports.CommentModel = new Comment().getModelForClass(Comment, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'comments' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvQ29tbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1EQUF5RDtBQUd6RCxxQ0FBcUM7QUFFckMsTUFBYSxPQUFRLFNBQVEscUJBQVM7Q0FlckM7QUFiQztJQURDLGdCQUFJLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7O3VDQUNSO0FBRWY7SUFEQyxnQkFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDOzsyQ0FDSjtBQUVuQjtJQURDLGdCQUFJLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUMsQ0FBQzs7dUNBQ2xCO0FBRWxCO0lBREMsZ0JBQUksQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7eUNBQ047QUFFakI7SUFEQyxnQkFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDOztxQ0FDVjtBQUViO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7NkNBQ0o7QUFFckI7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzsyQ0FDTjtBQWRyQiwwQkFlQztBQUNZLFFBQUEsWUFBWSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFO0lBQ2xFLGdCQUFnQixFQUFFLFFBQVE7SUFDMUIsYUFBYSxFQUFFLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBQztDQUN4QyxDQUFDLENBQUMifQ==