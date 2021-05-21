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
exports.SecurityManager = void 0;
const User_1 = require("../models/User");
const PlaceRepository_1 = require("../repositories/PlaceRepository");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const jwks = { "keys": [{ "alg": "RS256", "e": "AQAB", "kid": "PyGd6vWQidw+AuTJeAPrRGmvKQ5JNCZyGceO4+wd2sM=", "kty": "RSA", "n": "vLdhFg0jhpePF_Hob9m8P9Llvr04-NkPEChuIzmQWVzw48at-uTj2gYzxanlG0LGMW9WMfvQP2lm6plRzvxUgqxKy2SOiFCUN01_QCkJ7cd6-L39NKhenx22MMxn1o3ePRpyZ2zTQ2_Y3E8kYy-YU8GNv0kNQCV7axcXQoNd6hRdyGQlTW1wTDIX-5kTUckyRmwuHp1XHO1lrV6qtHpVv5HkduN0TSO3WnFKUSo2ha2Fb2fBmg3Efg2lpUfoPMC3bLLB4CtyRdGWHfz-KK_ste71dAS5w4Z6ihApE0ITNvZiwzF46r-GopRiLjpmhcF7c3WzyCR_yu2SbDX7mQz-nw", "use": "sig" }, { "alg": "RS256", "e": "AQAB", "kid": "EuRNa5Y8MWJMo3jmPonklC9Qtz/eIp9b+Z9yoeb72K4=", "kty": "RSA", "n": "swCqN2UP582Q7TzIo-qJh9at4ToBuIpOKFcBCNwf9XSVgW6sCRQ71wKzE-aHqmMcxOKzdeq8AJ2bLCu7wwN4KQOVy-OTKpQKg6-eJte1MjfwLzSzZ0RTvwAhiLI560xCDC5FZYCzWcOCiCOIhl_ers6BNywaoULuquEONmZUNdf9gxJFTXTjwEkeWKY9cToJSmgEfkWWBm5VMCWeDx1fP8gVKdL0tSswTBUgeqy841ccn-5MUYgcRW4b3f_QE0P1PaqGoPX7L6OoL-ai7oPhKNGkxgNLaOwcpZ4cDzltVxL0M0lOS0JkwOalxtRVQBVHUCI8Z__XAt6mzNyf9DJVow", "use": "sig" }] };
class SecurityManager {
    constructor(userRepository, event) {
        this.repo = userRepository;
        this.event = event;
    }
    getCognitoId() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.validateToken(this.event.headers['Authorization']))['sub'];
        });
    }
    isUserIdLogged() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            if (!user) {
                console.log("User not found");
                return false;
            }
            if (user['_id'].toString() == ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.userId.toString())) {
                console.log("Authorized");
                return true;
            }
            else {
                console.log("Not Authorized: " + user['_id'] + "-" + this.event.pathParameters.userId);
                return false;
            }
            return false;
        });
    }
    isUserLogged() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == undefined)
                return false;
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            if (!user) {
                return false;
            }
            else {
                return true;
            }
        });
    }
    isUserCam() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == undefined)
                return false;
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            if (!user) {
                return false;
            }
            else {
                if (user.userType == User_1.UserTypes.CamUser) {
                    return true;
                }
                else
                    return false;
            }
        });
    }
    isUserClassic() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == undefined)
                return false;
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            if (!user) {
                return false;
            }
            else {
                if (user.userType == User_1.UserTypes.ClassicUser)
                    return true;
                else
                    return false;
            }
        });
    }
    isUserCamPlaceOwner() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            let placeRepo = new PlaceRepository_1.PlaceRepository();
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == "undefined" ||
                typeof ((_c = this.event.pathParameters) === null || _c === void 0 ? void 0 : _c.placeId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            let place = yield placeRepo.getPlace((_d = this.event.pathParameters) === null || _d === void 0 ? void 0 : _d.placeId.toString());
            if (!user || !place) {
                return false;
            }
            if (user['_id'].toString() == place.camUser.toString()) {
                return true;
            }
            else {
                return false;
            }
            return false;
        });
    }
    getUserLogged() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof ((_b = (_a = this.event.requestContext) === null || _a === void 0 ? void 0 : _a.identity) === null || _b === void 0 ? void 0 : _b.cognitoAuthenticationProvider) == "undefined")
                return null;
            return yield this.repo.getUserByCognitoId(yield this.getCognitoId());
        });
    }
    validateToken(token) {
        return new Promise((resolve, reject) => {
            const header = SecurityManager.decodeTokenHeader(token);
            const jsonWebKey = SecurityManager.getJsonWebKeyWithKID(header.kid);
            this.verifyJsonWebTokenSignature(token, jsonWebKey, (err, decodedToken) => {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log(decodedToken);
                    resolve(decodedToken);
                }
            });
        });
    }
    static decodeTokenHeader(token) {
        const [headerEncoded] = token.split('.');
        const buff = new Buffer(headerEncoded, 'base64');
        const text = buff.toString('ascii');
        return JSON.parse(text);
    }
    static getJsonWebKeyWithKID(kid) {
        for (let jwk of jwks.keys) {
            if (jwk.kid === kid) {
                return jwk;
            }
        }
        return null;
    }
    verifyJsonWebTokenSignature(token, jsonWebKey, clbk) {
        const pem = jwkToPem(jsonWebKey);
        jwt.verify(token, pem, { algorithms: ['RS256'] }, (err, decodedToken) => clbk(err, decodedToken));
    }
}
exports.SecurityManager = SecurityManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VjdXJpdHlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYnMvU2VjdXJpdHlNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EseUNBQStDO0FBQy9DLHFFQUFnRTtBQUNoRSxvQ0FBb0M7QUFDcEMsdUNBQXVDO0FBQ3ZDLE1BQU0sSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLDhDQUE4QyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLHdWQUF3VixFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsOENBQThDLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsd1ZBQXdWLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQztBQUdsNkIsTUFBYSxlQUFlO0lBSXhCLFlBQVksY0FBOEIsRUFBRSxLQUFVO1FBQ2xELElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFSyxZQUFZOztZQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xGLENBQUM7S0FBQTtJQUVLLGNBQWM7OztZQUNoQixJQUFJLG9CQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYywwQ0FBRSxRQUFRLDBDQUFFLDZCQUE2QixDQUFBLElBQUksV0FBVztnQkFDeEYsT0FBTyxLQUFLLENBQUM7WUFFakIsSUFBSSxJ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