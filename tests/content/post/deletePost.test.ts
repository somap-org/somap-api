import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";
import {main as deletePost} from "../../../src/services/content/post/deletePost";
import {NewPost} from "../../../src/interfaces/models/newPost";
import {main as addPost} from "../../../src/services/content/post/addPost";
import {Post} from "../../../src/interfaces/models/post";
import {UserRepository} from "../../../src/repositories/UserRepository";

let response;
let event, expectedResponse;
let mariorossi, fabiobianchi, 
    postMariorossi: Post, //Post pubblicato da mariorossi sul suo profilo
    postFabiobianchi: Post, //Post pubblicato da fabiobianchi sul suo profilo con il post di mariorossi condiviso
    loggedPostOtherProfile: Post; //Post pubblicato da mariorossi sul profilo di fabiobianchi

describe('Delete post', async () => {

    before('Signing up mariorossi', async () => {
        event = {
            "userName": "mariorossi",
            "request": {
                "userAttributes": {
                    "email": "mariorossi@gmail.com",
                    "email_verified": true,
                    "name": "Mario Rossi",
                    "sub": "asdasd-1232132-asdasd",
                    "custom:userType": "CamUser"
                }
            }
        };
        mariorossi = await signUp(event);
        expect(mariorossi).to.not.be.null;
    });
    before('Signing up fabiobianchi', async () => {
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

    before('Add test post to logged user', async () => {
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
        postMariorossi = response.body;
    });
    before('Share logged user post to other user', async () => {
        let postBody:NewPost = {
            body: "Ho trovato questo fantastico post!",
            sharedPost: postMariorossi.postId
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
        response = await addPost(event);
        response.body = JSON.parse(response.body);
        postMariorossi.sharedCount++;
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
            sharedPost: postMariorossi
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
        postFabiobianchi = response.body;
    });
    before('Add logged post to other profile', async () => {
        let postBody:NewPost = {
            body: "Hey other! how are you?"
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
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
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
        loggedPostOtherProfile = response.body;
    });

    after('Delete test logged users', async () => {
        let delResponse = await deleteUser(mariorossi['_id']);
        expect(delResponse).to.be.true;
    });
    after('Delete test other users', async () => {
        let delResponse = await deleteUser(fabiobianchi['_id']);
        expect(delResponse).to.be.true;
    });


    it('Mariorossi delete his post', async () => {
        event = {
            "pathParameters": {
                "postId": postMariorossi.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await deletePost(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        postMariorossi = response.body;
        postFabiobianchi.sharedPost = null;
    });

    it('Fabiobianchi delete his post', async () => {
        event = {
            "pathParameters": {
                "postId": postFabiobianchi.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await deletePost(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        postFabiobianchi = response.body;
    });

    it('Fabiobianchi delete mariorossi post published in his profile', async () => {
        let postBody:NewPost = {
            body: "Hey my friend i want to hack ur post"
        };

        event = {
            "pathParameters": {
                "postId": loggedPostOtherProfile.postId
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
        response = await deletePost(event);
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

    it('Mariorossi delete his post on fabiobianchi profile', async () => {
        event = {
            "pathParameters": {
                "postId": loggedPostOtherProfile.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await deletePost(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
        loggedPostOtherProfile = response.body;
    });


});

