/**
 * Backend RESTful API Interface
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ObjectId } from './objectId';

export interface UserPublicProfile { 
    userId: ObjectId;
    userType: UserPublicProfile.UserTypeEnum;
    username: string;
    profileImage: string;
}
export namespace UserPublicProfile {
    export type UserTypeEnum = 'camUser' | 'classicUser';
    export const UserTypeEnum = {
        CamUser: 'camUser' as UserTypeEnum,
        ClassicUser: 'classicUser' as UserTypeEnum
    };
}
