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

export interface Activity { 
    activityId?: ObjectId;
    placeId?: ObjectId;
    name: string;
    date: string;
    description: string;
    thumbnail: string;
}
