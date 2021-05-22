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
exports.PlaceModel = exports.Place = void 0;
const typegoose_1 = require("@hasezoey/typegoose");
const mongoose = require("mongoose");
let Place = class Place extends typegoose_1.Typegoose {
};
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], Place.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], Place.prototype, "description", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], Place.prototype, "address", void 0);
__decorate([
    typegoose_1.prop({ required: false, default: null }),
    __metadata("design:type", String)
], Place.prototype, "currentLiveUrl", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", Object)
], Place.prototype, "location", void 0);
__decorate([
    typegoose_1.prop({ ref: 'User', required: false }),
    __metadata("design:type", Array)
], Place.prototype, "peapleHere", void 0);
__decorate([
    typegoose_1.prop({ ref: 'User' }),
    __metadata("design:type", Object)
], Place.prototype, "camUser", void 0);
Place = __decorate([
    typegoose_1.index({ location: '2dsphere' })
], Place);
exports.Place = Place;
exports.PlaceModel = new Place().getModelForClass(Place, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'places' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL1BsYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbURBQWdFO0FBRWhFLHFDQUFxQztBQUlyQyxJQUFhLEtBQUssR0FBbEIsTUFBYSxLQUFNLFNBQVEscUJBQVM7Q0FzQm5DLENBQUE7QUFuQkc7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDOzttQ0FDYjtBQUViO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQzs7MENBQ047QUFFcEI7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDOztzQ0FDVjtBQUVoQjtJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQzs7NkNBQ2pCO0FBRXhCO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQzs7dUNBT3hCO0FBRUY7SUFEQyxnQkFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7O3lDQUNmO0FBRXhCO0lBREMsZ0JBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQzs7c0NBQ0g7QUFyQlYsS0FBSztJQUZqQixpQkFBSyxDQUFDLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDO0dBRW5CLEtBQUssQ0FzQmpCO0FBdEJZLHNCQUFLO0FBd0JMLFFBQUEsVUFBVSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFO0lBQzFELGdCQUFnQixFQUFFLFFBQVE7SUFDMUIsYUFBYSxFQUFFLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBQztDQUN4QyxDQUFDLENBQUMifQ==