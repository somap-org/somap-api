import {UserRepository} from "../repositories/UserRepository";
import {User, UserTypes} from "../models/User";
import {PlaceRepository} from "../repositories/PlaceRepository";
import * as jwt from "jsonwebtoken";
import * as jwkToPem from "jwk-to-pem";
const jwks = {"keys":[{"alg":"RS256","e":"AQAB","kid":"PyGd6vWQidw+AuTJeAPrRGmvKQ5JNCZyGceO4+wd2sM=","kty":"RSA","n":"vLdhFg0jhpePF_Hob9m8P9Llvr04-NkPEChuIzmQWVzw48at-uTj2gYzxanlG0LGMW9WMfvQP2lm6plRzvxUgqxKy2SOiFCUN01_QCkJ7cd6-L39NKhenx22MMxn1o3ePRpyZ2zTQ2_Y3E8kYy-YU8GNv0kNQCV7axcXQoNd6hRdyGQlTW1wTDIX-5kTUckyRmwuHp1XHO1lrV6qtHpVv5HkduN0TSO3WnFKUSo2ha2Fb2fBmg3Efg2lpUfoPMC3bLLB4CtyRdGWHfz-KK_ste71dAS5w4Z6ihApE0ITNvZiwzF46r-GopRiLjpmhcF7c3WzyCR_yu2SbDX7mQz-nw","use":"sig"},{"alg":"RS256","e":"AQAB","kid":"EuRNa5Y8MWJMo3jmPonklC9Qtz/eIp9b+Z9yoeb72K4=","kty":"RSA","n":"swCqN2UP582Q7TzIo-qJh9at4ToBuIpOKFcBCNwf9XSVgW6sCRQ71wKzE-aHqmMcxOKzdeq8AJ2bLCu7wwN4KQOVy-OTKpQKg6-eJte1MjfwLzSzZ0RTvwAhiLI560xCDC5FZYCzWcOCiCOIhl_ers6BNywaoULuquEONmZUNdf9gxJFTXTjwEkeWKY9cToJSmgEfkWWBm5VMCWeDx1fP8gVKdL0tSswTBUgeqy841ccn-5MUYgcRW4b3f_QE0P1PaqGoPX7L6OoL-ai7oPhKNGkxgNLaOwcpZ4cDzltVxL0M0lOS0JkwOalxtRVQBVHUCI8Z__XAt6mzNyf9DJVow","use":"sig"}]};


export class SecurityManager {
    repo: UserRepository;
    event: any;

    constructor(userRepository: UserRepository, event: any) {
        this.repo = userRepository;
        this.event = event;
    }

    async getCognitoId(): Promise<string> {
        let decodedToken = await this.validateToken(this.event.headers['Authorization']);
        console.log('cognitoId sub', decodedToken.sub);
        return decodedToken.sub;
    }

    async isUserIdLogged(): Promise<boolean> {
        let user = await this.repo.getUserByCognitoId(await this.getCognitoId());
        if (!user) {
            console.log("User not found");
            return false;
        }
        if (user['_id'].toString() == this.event.pathParameters?.userId.toString()) {
            console.log("Authorized");
            return true;
        }
        else {
            console.log("Not Authorized: "+user['_id']+"-"+this.event.pathParameters.userId);
            return false;
        }
        return false;
    }

    async isUserLogged(): Promise<boolean> {
        let user = await this.repo.getUserByCognitoId(await this.getCognitoId());
        if (!user) {
            console.log("User not found");
            return false;
        } else {
            console.log("isUserLogged ok");
            return true
        }
    }

    async isUserCam(): Promise<boolean> {
        let user = await this.repo.getUserByCognitoId(await this.getCognitoId());
        if (!user) {
            console.log("User not found");
            return false;
        } else {
            console.log("Authorized");
            if (user.userType == UserTypes.CamUser) {
                console.log("isUserCam ok");
                return true;
            } else
                return false;
        }
    }

    async isUserClassic(): Promise<boolean> {
        let user = await this.repo.getUserByCognitoId(await this.getCognitoId());
        if (!user) {
            console.log("User not found");
            return false;
        } else {
            console.log("Authorized");
            if (user.userType == UserTypes.ClassicUser)
                return true;
            else
                return false;
        }
    }

    async isUserCamPlaceOwner(): Promise<boolean> {
        let placeRepo = new PlaceRepository();
        if (
            typeof this.event.pathParameters?.placeId == "undefined"
        )
            return false;

        let user = await this.repo.getUserByCognitoId(await this.getCognitoId());
        let place = await placeRepo.getPlace(this.event.pathParameters?.placeId.toString());

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
            console.log("Not Authorized: "+user['_id']+"-"+place.camUser['_id'].toString());
            return false;
        }
        return false;
    }

    async getUserLogged(): Promise<User> {
        return await this.repo.getUserByCognitoId(await this.getCognitoId());
    }

    validateToken(token): Promise<any> {
        return new Promise((resolve, reject) => {
            const header = SecurityManager.decodeTokenHeader(token);  // {"kid":"XYZAAAAAAAAAAAAAAA/1A2B3CZ5x6y7MA56Cy+6abc=", "alg": "RS256"}
            const jsonWebKey = SecurityManager.getJsonWebKeyWithKID(header.kid);
            this.verifyJsonWebTokenSignature(token, jsonWebKey, (err, decodedToken) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log("decodedToken", decodedToken);
                    resolve(decodedToken);
                }
            })
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
        return null
    }

    verifyJsonWebTokenSignature(token, jsonWebKey, clbk) {
        const pem = jwkToPem(jsonWebKey);
        jwt.verify(token, pem, {algorithms: ['RS256']}, (err, decodedToken) => clbk(err, decodedToken))
    }
}
