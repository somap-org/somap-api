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
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            if (!user) {
                console.log("User not found");
                return false;
            }
            if (user['_id'].toString() == ((_a = this.event.pathParameters) === null || _a === void 0 ? void 0 : _a.userId.toString())) {
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
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            if (!user) {
                console.log("User not found");
                return false;
            }
            else {
                console.log("isUserLogged ok");
                return true;
            }
        });
    }
    isUserCam() {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            if (!user) {
                console.log("User not found");
                return false;
            }
            else {
                console.log("Authorized");
                if (user.userType == User_1.UserTypes.CamUser) {
                    console.log("isUserCam ok");
                    return true;
                }
                else
                    return false;
            }
        });
    }
    isUserClassic() {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            if (!user) {
                console.log("User not found");
                return false;
            }
            else {
                console.log("Authorized");
                if (user.userType == User_1.UserTypes.ClassicUser)
                    return true;
                else
                    return false;
            }
        });
    }
    isUserCamPlaceOwner() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let placeRepo = new PlaceRepository_1.PlaceRepository();
            if (typeof ((_a = this.event.pathParameters) === null || _a === void 0 ? void 0 : _a.placeId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            let place = yield placeRepo.getPlace((_b = this.event.pathParameters) === null || _b === void 0 ? void 0 : _b.placeId.toString());
            if (!user || !place) {
                console.log("User or place not found");
                return false;
            }
            if (user['_id'].toString() == place.camUser.toString()) {
                console.log("Authorized");
                console.log("isUserCamPlaceOwner ok");
                return true;
            }
            else {
                console.log("Not Authorized: " + user['_id'] + "-" + place.camUser.toString());
                return false;
            }
            return false;
        });
    }
    getUserLogged() {
        return __awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VjdXJpdHlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYnMvU2VjdXJpdHlNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EseUNBQStDO0FBQy9DLHFFQUFnRTtBQUNoRSxvQ0FBb0M7QUFDcEMsdUNBQXVDO0FBQ3ZDLE1BQU0sSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLDhDQUE4QyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLHdWQUF3VixFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsOENBQThDLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsd1ZBQXdWLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQztBQUdsNkIsTUFBYSxlQUFlO0lBSXhCLFlBQVksY0FBOEIsRUFBRSxLQUFVO1FBQ2xELElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFSyxZQUFZOztZQUNkLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xGLENBQUM7S0FBQTtJQUVLLGNBQWM7OztZQUNoQixJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztZQUN6RSxJQUFJLENBQUMsSUFBSSxF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