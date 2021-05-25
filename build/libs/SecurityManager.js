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
            let decodedToken = yield this.validateToken(this.event.headers['Authorization']);
            console.log('cognitoId sub', decodedToken.sub);
            return decodedToken.sub;
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
    isUserCamPlaceOwner(placeId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let placeRepo = new PlaceRepository_1.PlaceRepository();
            if (typeof ((_a = this.event.pathParameters) === null || _a === void 0 ? void 0 : _a.placeId) == "undefined")
                return false;
            let user = yield this.repo.getUserByCognitoId(yield this.getCognitoId());
            let place = yield placeRepo.getPlace(placeId ? placeId : (_b = this.event.pathParameters) === null || _b === void 0 ? void 0 : _b.placeId.toString());
            if (!user || !place) {
                console.log("User or place not found");
                return false;
            }
            if (user['_id'].toString() == place.camUser['_id'].toString()) {
                console.log("Authorized");
                console.log("isUserCamPlaceOwner ok");
                return true;
            }
            else {
                console.log("Not Authorized: " + user['_id'] + "-" + place.camUser['_id'].toString());
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
                    console.log("decodedToken", decodedToken);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VjdXJpdHlNYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYnMvU2VjdXJpdHlNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EseUNBQStDO0FBQy9DLHFFQUFnRTtBQUNoRSxvQ0FBb0M7QUFDcEMsdUNBQXVDO0FBQ3ZDLE1BQU0sSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFDLENBQUMsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsS0FBSyxFQUFDLDhDQUE4QyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsR0FBRyxFQUFDLHdWQUF3VixFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsRUFBQyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUMsOENBQThDLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsd1ZBQXdWLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxDQUFDLEVBQUMsQ0FBQztBQUdsNkIsTUFBYSxlQUFlO0lBSXhCLFlBQVksY0FBOEIsRUFBRSxLQUFVO1FBQ2xELElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDO1FBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFSyxZQUFZOztZQUNkLElBQUksWUFBWSxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ2pGLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQyxPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUM7UUFDNUIsQ0FBQztLQUFBO0lBRUssY0FBYzs7O1lBQ2hCLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElB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