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
exports.UserModel = exports.User = exports.UserSettings = exports.UserPublicProfile = exports.PrivacyTypes = exports.UserTypes = void 0;
const mongoose = require("mongoose");
const typegoose_1 = require("@hasezoey/typegoose");
var UserTypes;
(function (UserTypes) {
    UserTypes["CamUser"] = "camUser";
    UserTypes["ClassicUser"] = "classicUser";
})(UserTypes = exports.UserTypes || (exports.UserTypes = {}));
var PrivacyTypes;
(function (PrivacyTypes) {
    PrivacyTypes["public"] = "public";
    PrivacyTypes["private"] = "private";
})(PrivacyTypes = exports.PrivacyTypes || (exports.PrivacyTypes = {}));
class UserPublicProfile extends typegoose_1.Typegoose {
    constructor() {
        super(...arguments);
        this.followers = 0;
        this.following = 0;
    }
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], UserPublicProfile.prototype, "username", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], UserPublicProfile.prototype, "profileImage", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Number)
], UserPublicProfile.prototype, "followers", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Number)
], UserPublicProfile.prototype, "following", void 0);
exports.UserPublicProfile = UserPublicProfile;
class UserSettings {
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Boolean)
], UserSettings.prototype, "enableNotification", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Boolean)
], UserSettings.prototype, "appearInPeopleHere", void 0);
__decorate([
    typegoose_1.prop({ enum: PrivacyTypes, required: true }),
    __metadata("design:type", String)
], UserSettings.prototype, "profilePrivacy", void 0);
exports.UserSettings = UserSettings;
class User extends typegoose_1.Typegoose {
}
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], User.prototype, "cognitoId", void 0);
__decorate([
    typegoose_1.prop({ enum: UserTypes, required: true }),
    __metadata("design:type", String)
], User.prototype, "userType", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], User.prototype, "instagram", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], User.prototype, "facebook", void 0);
__decorate([
    typegoose_1.prop({ required: true, _id: false }),
    __metadata("design:type", UserPublicProfile)
], User.prototype, "publicProfile", void 0);
__decorate([
    typegoose_1.prop({ required: true, _id: false }),
    __metadata("design:type", UserSettings)
], User.prototype, "settings", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], User.prototype, "referralCode", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], User.prototype, "referralCodeUsed", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], User.prototype, "channel", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], User.prototype, "streamKey", void 0);
exports.User = User;
exports.UserModel = new User().getModelForClass(User, {
    existingMongoose: mongoose,
    schemaOptions: { collection: 'users' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHFDQUFxQztBQUNyQyxtREFBb0Q7QUFFcEQsSUFBWSxTQUdYO0FBSEQsV0FBWSxTQUFTO0lBQ2pCLGdDQUFtQixDQUFBO0lBQ25CLHdDQUEyQixDQUFBO0FBQy9CLENBQUMsRUFIVyxTQUFTLEdBQVQsaUJBQVMsS0FBVCxpQkFBUyxRQUdwQjtBQUVELElBQVksWUFHWDtBQUhELFdBQVksWUFBWTtJQUNwQixpQ0FBaUIsQ0FBQTtJQUNqQixtQ0FBbUIsQ0FBQTtBQUN2QixDQUFDLEVBSFcsWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUFHdkI7QUFFRCxNQUFhLGlCQUFrQixTQUFRLHFCQUFTO0lBQWhEOztRQU1JLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFFdEIsY0FBUyxHQUFXLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQUE7QUFQRztJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7O21EQUNSO0FBRWpCO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7dURBQ0o7QUFFckI7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztvREFDSDtBQUV0QjtJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7O29EQUNIO0FBUjFCLDhDQVNDO0FBRUQsTUFBYSxZQUFZO0NBT3hCO0FBTEc7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzt3REFDRztBQUU1QjtJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7O3dEQUNHO0FBRTVCO0lBREMsZ0JBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOztvREFDaEI7QUFOakMsb0NBT0M7QUFFRCxNQUFhLElBQUssU0FBUSxxQkFBUztDQXVCbEM7QUFyQkc7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzt1Q0FDUDtBQUVsQjtJQURDLGdCQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7c0NBQ3RCO0FBRXBCO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7bUNBQ1g7QUFFZDtJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7O3VDQUNSO0FBRWxCO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQzs7c0NBQ1Q7QUFFakI7SUFEQyxnQkFBSSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUM7OEJBQ3RCLGlCQUFpQjsyQ0FBQztBQUVqQztJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsQ0FBQzs4QkFDM0IsWUFBWTtzQ0FBQztBQUV2QjtJQURDLGdCQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7OzBDQUNMO0FBRXJCO0lBREMsZ0JBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQzs7OENBQ0Q7QUFFekI7SUFEQyxnQkFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDOztxQ0FDUjtBQUVoQjtJQURDLGdCQUFJLENBQUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7O3VDQUNOO0FBdEJ0QixvQkF1QkM7QUFFWSxRQUFBLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRTtJQUN2RCxnQkFBZ0IsRUFBRSxRQUFRO0lBSzFCLGFBQWEsRUFBRSxFQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUM7Q0FDdkMsQ0FBQyxDQUFDIn0=