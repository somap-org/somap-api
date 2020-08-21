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
exports.FollowingModel = void 0;
const typegoose_1 = require("@hasezoey/typegoose");
const mongoose = require("mongoose");
class Following extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop({ required: true, ref: 'User' }),
    __metadata("design:type", Object)
], Following.prototype, "_f", void 0);
__decorate([
    typegoose_1.prop({ required: true, ref: 'User' }),
    __metadata("design:type", Object)
], Following.prototype, "_t", void 0);
exports.FollowingModel = new Following().getModelForClass(Following, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'following' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRm9sbG93aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21vZGVscy9Gb2xsb3dpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxtREFBeUQ7QUFHekQscUNBQXFDO0FBR3JDLE1BQU0sU0FBVSxTQUFRLHFCQUFTO0NBS2hDO0FBSEM7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUM7O3FDQUN2QjtBQUVmO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDOztxQ0FDdkI7QUFFSixRQUFBLGNBQWMsR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRTtJQUN4RSxnQkFBZ0IsRUFBRSxRQUFRO0lBQzFCLGFBQWEsRUFBRSxFQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUM7Q0FDekMsQ0FBQyxDQUFDIn0=