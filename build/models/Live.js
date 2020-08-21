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
exports.LiveModel = exports.Live = void 0;
const typegoose_1 = require("@hasezoey/typegoose");
const mongoose = require("mongoose");
class Live extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop({ required: true, ref: 'Place' }),
    __metadata("design:type", Object)
], Live.prototype, "place", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Live.prototype, "createdAt", void 0);
exports.Live = Live;
exports.LiveModel = new Live().getModelForClass(Live, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'lives' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvTGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1EQUF5RDtBQUV6RCxxQ0FBcUM7QUFFckMsTUFBYSxJQUFLLFNBQVEscUJBQVM7Q0FLbEM7QUFIQztJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQzs7bUNBQ3JCO0FBRWxCO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7dUNBQ1A7QUFKcEIsb0JBS0M7QUFHWSxRQUFBLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRTtJQUN6RCxnQkFBZ0IsRUFBRSxRQUFRO0lBQzFCLGFBQWEsRUFBRSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUM7Q0FDckMsQ0FBQyxDQUFDIn0=