import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";
import {main as addPost} from "../../../src/services/content/post/addPost"
import {Post} from "../../../src/interfaces/models/post";
import {PostRepository} from "../../../src/repositories/PostRepository";
import {NewPost} from "../../../src/interfaces/models/newPost";
import {UserRepository} from "../../../src/repositories/UserRepository";

let response;
let event, expectedResponse;
let mariorossi, fabiobianchi,
    postLogged: Post, //Post pubblicato da mariorossi sul suo profilp
    postOther: Post,  //Post pubblicato da fabiobianchi sul suo profilo
    mariorossiPostOnFabioProfile: Post; //Post pubblicato da mariorossi sul profilo di fabio contenente il suo post (di mariorossi) condiviso

describe('Add post', async () => {

    before('Signing up test logged user', async () => {
        event = {
            "userName": "mariorossi",
            "request": {
                "userAttributes": {
                    "email": "mariorossi@gmail.com",
                    "email_verified": true,
                    "name": "Mario Rossi",
                    "sub": "asdasd-1232132-asdasd",
                    "custom:userType": "ClassicUser"
                }
            }
        };
        mariorossi = await signUp(event);
        expect(mariorossi).to.not.be.null;
    });
    before('Signing up test other user', async () => {
        event = {
            "userName": "fabiobianchi",
            "request": {
                "userAttributes": {
                    "email": "fabiobianchi@gmail.com",
                    "email_verified": true,
                    "name": "Fabio Bianchi",
                    "sub": "abcdevfefe-1232132-cofeve",
                    "custom:userType": "CamUser"
                }
            }
        };
        fabiobianchi = await signUp(event);
        expect(fabiobianchi).to.not.be.null;
    });

    after('Delete mariorossi user', async () => {
        let delResponse = await deleteUser(mariorossi['_id']);
        expect(delResponse).to.be.true;
    });
    after('Delete fabiobianchi user', async () => {
        let delResponse = await deleteUser(fabiobianchi['_id']);
        expect(delResponse).to.be.true;
    });

    after('Delete mariorossi post on fabio profile', async () => {
        let repo = new PostRepository();
        let delResponse = await repo.deletePost(mariorossiPostOnFabioProfile.postId);
        expect(delResponse).to.be.true;
    });
    after('Delete post logged', async () => {
        let repo = new PostRepository();
        let delResponse = await repo.deletePost(postLogged.postId);
        expect(delResponse).to.be.true;
    });
    after('Delete post other', async () => {
        let repo = new PostRepository();
        let delResponse = await repo.deletePost(postOther.postId);
        expect(delResponse).to.be.true;
    });

    it('Add test post to logged user', async () => {
        let postBody:NewPost = {
            body: "Questo è un nuovo post"
        };

        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await addPost(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Post = {
            postId: response.body.postId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(mariorossi['_id'])
            },
            postedAt: response.body.postedAt,
            medias: postBody.medias || [],
            sharedCount: 0,
            likesCount: 0,
            commentsCount: 0,
            sharedPost: null
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                ...expectedBody
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        postLogged = response.body;
    });

    it('Share logged user post to other user', async () => {
        let postBody:NewPost = {
            body: "Ho trovato questo fantastico post!",
            sharedPost: postLogged.postId
        };

        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id']
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await addPost(event);
        response.body = JSON.parse(response.body);
        postLogged.sharedCount++;
        let expectedBody:Post = {
            postId: response.body.postId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(fabiobianchi['_id'])
            },
            postedAt: response.body.postedAt,
            medias: postBody.medias || [],
            sharedCount: 0,
            likesCount: 0,
            commentsCount: 0,
            sharedPost: postLogged
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                ...expectedBody
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        postOther = response.body;
    });

    it('Logged user share itself post on other user profile', async () => {
        let postBody:NewPost = {
            body: "Other user rembember this post!",
            sharedPost: postLogged.postId
        };

        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id'],
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await addPost(event);
        response.body = JSON.parse(response.body);
        postLogged.sharedCount++;
        let expectedBody:Post = {
            postId: response.body.postId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(mariorossi['_id'])
            },
            postedAt: response.body.postedAt,
            medias: postBody.medias || [],
            sharedCount: 0,
            likesCount: 0,
            commentsCount: 0,
            sharedPost: postLogged
        };
        expectedResponse = {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "*",
                "Access-Control-Allow-Origin": "*"
            },
            "body": {
                ...expectedBody
            }
        };
        expect(response).to.deep.equal(expectedResponse);
        mariorossiPostOnFabioProfile = response.body;
    });

    it('User not logged', async () => {
        let postBody:NewPost = {
            body: "Questo è un nuovo post"
        };

        event = {
            "pathParameters": {
                "userId": mariorossi['_id']
            },
            "body": {
                ...postBody
            }
        };
        event.body = JSON.stringify(event.body);
        response = await addPost(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });

});

