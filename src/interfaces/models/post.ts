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
import { UserPublicProfile } from './userPublicProfile';

export interface Post { 
    postId: ObjectId;
    author: UserPublicProfile;
    postedAt: string;
    body: string;
    medias?: string[];
    sharedCount: number;
    likesCount: number;
    commentsCount: number;
    sharedPost?: Post;
}

