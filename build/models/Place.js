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
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Place.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Place.prototype, "description", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Place.prototype, "address", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGxhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWxzL1BsYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsbURBQWdFO0FBRWhFLHFDQUFxQztBQUlyQyxJQUFhLEtBQUssR0FBbEIsTUFBYSxLQUFNLFNBQVEscUJBQVM7Q0FvQm5DLENBQUE7QUFqQkc7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzttQ0FDWjtBQUViO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7MENBQ0w7QUFFcEI7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztzQ0FDVDtBQUVoQjtJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7O3VDQU92QjtBQUVGO0lBREMsZ0JBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDOzt5Q0FDZjtBQUV4QjtJQURDLGdCQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUM7O3NDQUNIO0FBbkJWLEtBQUs7SUFGakIsaUJBQUssQ0FBQyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsQ0FBQztHQUVuQixLQUFLLENBb0JqQjtBQXBCWSxzQkFBSztBQXNCTCxRQUFBLFVBQVUsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRTtJQUMxRCxnQkFBZ0IsRUFBRSxRQUFRO0lBQzFCLGFBQWEsRUFBRSxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUM7Q0FDeEMsQ0FBQyxDQUFDIn0=