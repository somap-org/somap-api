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
exports.ActivityModel = void 0;
const typegoose_1 = require("@hasezoey/typegoose");
const mongoose = require("mongoose");
class Activity extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop({ required: true, ref: 'Place' }),
    __metadata("design:type", Object)
], Activity.prototype, "place", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Activity.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Date)
], Activity.prototype, "date", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Activity.prototype, "description", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], Activity.prototype, "thumbnail", void 0);
exports.ActivityModel = new Activity().getModelForClass(Activity, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'activities' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aXZpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL0FjdGl2aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbURBQXlEO0FBRXpELHFDQUFxQztBQUdyQyxNQUFNLFFBQVMsU0FBUSxxQkFBUztDQVcvQjtBQVRDO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxDQUFDOzt1Q0FDckI7QUFFbEI7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztzQ0FDWjtBQUViO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs4QkFDbkIsSUFBSTtzQ0FBQztBQUVYO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7NkNBQ0w7QUFFcEI7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDOzsyQ0FDUDtBQUVSLFFBQUEsYUFBYSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFO0lBQ3JFLGdCQUFnQixFQUFFLFFBQVE7SUFDMUIsYUFBYSxFQUFFLEVBQUMsVUFBVSxFQUFFLFlBQVksRUFBQztDQUMxQyxDQUFDLENBQUMifQ==