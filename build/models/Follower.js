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
exports.FollowerModel = void 0;
const typegoose_1 = require("@hasezoey/typegoose");
const mongoose = require("mongoose");
class Follower extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop({ required: true, ref: 'User' }),
    __metadata("design:type", Object)
], Follower.prototype, "_f", void 0);
__decorate([
    typegoose_1.prop({ required: true, ref: 'User' }),
    __metadata("design:type", Object)
], Follower.prototype, "_t", void 0);
exports.FollowerModel = new Follower().getModelForClass(Follower, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'followers' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9sbG93ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL0ZvbGxvd2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbURBQXlEO0FBR3pELHFDQUFxQztBQUdyQyxNQUFNLFFBQVMsU0FBUSxxQkFBUztDQUsvQjtBQUhDO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDOztvQ0FDdkI7QUFFZjtJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQzs7b0NBQ3ZCO0FBRUosUUFBQSxhQUFhLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUU7SUFDckUsZ0JBQWdCLEVBQUUsUUFBUTtJQUMxQixhQUFhLEVBQUUsRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFDO0NBQ3pDLENBQUMsQ0FBQyJ9