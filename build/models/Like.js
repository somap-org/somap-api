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
exports.LikeModel = void 0;
const typegoose_1 = require("@hasezoey/typegoose");
const mongoose = require("mongoose");
let Like = class Like extends typegoose_1.Typegoose {
};
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Like.prototype, "parent", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Like.prototype, "parentType", void 0);
__decorate([
    typegoose_1.prop({ required: true, ref: 'User' }),
    __metadata("design:type", Object)
], Like.prototype, "author", void 0);
Like = __decorate([
    typegoose_1.index({ parent: 1, parentType: 1 })
], Like);
exports.LikeModel = new Like().getModelForClass(Like, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'likes' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlrZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvTGlrZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1EQUFnRTtBQUVoRSxxQ0FBcUM7QUFJckMsSUFBTSxJQUFJLEdBQVYsTUFBTSxJQUFLLFNBQVEscUJBQVM7Q0FPM0IsQ0FBQTtBQUxHO0lBREMsZ0JBQUksQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQzs7b0NBQ1I7QUFFZjtJQURDLGdCQUFJLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUM7O3dDQUNKO0FBRW5CO0lBREMsZ0JBQUksQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBQyxDQUFDOztvQ0FDbEI7QUFOaEIsSUFBSTtJQUZULGlCQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQztHQUU5QixJQUFJLENBT1Q7QUFDWSxRQUFBLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRTtJQUN2RCxnQkFBZ0IsRUFBRSxRQUFRO0lBQzFCLGFBQWEsRUFBRSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUM7Q0FDdkMsQ0FBQyxDQUFDIn0=