import {main as signUp} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';
import {deleteUser} from "../../../src/services/userGraph/user/signUp";
import {NewPost} from "../../../src/interfaces/models/newPost";
import {main as addPost} from "../../../src/services/content/post/addPost";
import {main as editPost} from "../../../src/services/content/post/editPost";
import {Post} from "../../../src/interfaces/models/post";
import {UserRepository} from "../../../src/repositories/UserRepository";
import {PostRepository} from "../../../src/repositories/PostRepository";

let response;
let event, expectedResponse;
let loggedUser, otherUser, postLogged: Post, postOther: Post, loggedPostOtherProfile: Post;
describe('Edit activity', async () => {

    before('Signing up test logged users', async () => {
        event = {
            "userName": "mariorossi",
            "request": {
                "userAttributes": {
                    "email": "mariorossi@gmail.com",
                    "email_verified": true,
                    "name": "Mario Rossi",
                    "sub": "asdasd-1232132-asdasd",
                    "custom:userType": "camUser"
                }
            }
        };
        loggedUser = await signUp(event);
        expect(loggedUser).to.not.be.null;
    });
    before('Signing up test other users', async () => {
        event = {
            "userName": "fabiobianchi",
            "request": {
                "userAttributes": {
                    "email": "fabiobianchi@gmail.com",
                    "email_verified": true,
                    "name": "Fabio Bianchi",
                    "sub": "abcdevfefe-1232132-cofeve",
                    "custom:userType": "camUser"
                }
            }
        };
        otherUser = await signUp(event);
        expect(otherUser).to.not.be.null;
    });

    before('Add test post to logged user', async () => {
        let postBody:NewPost = {
            body: "Questo è un nuovo post"
        };

        event = {
            "pathParameters": {
                "userId": loggedUser['_id']
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + loggedUser.cognitoId
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
                ...await new UserRepository().getUserPublicProfile(loggedUser['_id'])
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
    before('Share logged user post to other user', async () => {
        let postBody:NewPost = {
            body: "Ho trovato questo fantastico post!",
            sharedPost: postLogged.postId
        };

        event = {
            "pathParameters": {
                "userId": otherUser['_id']
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + otherUser.cognitoId
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
                ...await new UserRepository().getUserPublicProfile(otherUser['_id'])
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
    before('Add logged post to other profile', async () => {
        let postBody:NewPost = {
            body: "Hey other! how are you?"
        };

        event = {
            "pathParameters": {
                "userId": otherUser['_id']
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + loggedUser.cognitoId
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
                ...await new UserRepository().getUserPublicProfile(loggedUser['_id'])
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
        let delResponse = await deleteUser(loggedUser['_id']);
        expect(delResponse).to.be.true;
    });
    after('Delete test other users', async () => {
        let delResponse = await deleteUser(otherUser['_id']);
        expect(delResponse).to.be.true;
    });

    after('Delete post logged', async () => {
        let repo = new PostRepository();
        let delResponse = await repo.deletePost(postLogged.postId);
        expect(delResponse).to.be.true;
    });
    after('Delete loggedPostOtherProfile', async () => {
        let repo = new PostRepository();
        let delResponse = await repo.deletePost(loggedPostOtherProfile.postId);
        expect(delResponse).to.be.true;
    });
    after('Delete post other', async () => {
        let repo = new PostRepository();
        let delResponse = await repo.deletePost(postOther.postId);
        expect(delResponse).to.be.true;
    });

    it('User logged edit his post', async () => {
        let postBody:NewPost = {
            body: "Nuovo testo del post"
        };

        event = {
            "pathParameters": {
                "postId": postLogged.postId
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + loggedUser.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await editPost(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Post = {
            ...postLogged,
            body: postBody.body
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
        postOther.sharedPost = postLogged;
    });

    it('Other user edit shared logged user post', async () => {
        let postBody:NewPost = {
            body: "Post condiviso modificato!"
        };

        event = {
            "pathParameters": {
                "postId": postOther.postId
            },
            "body": {
                ...postBody
            },
            "requestContext": {
                "identity": {
                    "cognitoAuthenticationProvider": ':' + otherUser.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await editPost(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Post = {
            ...postOther,
            body: postBody.body
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

    it('User logged edit his post to other user profile', async () => {
        let postBody:NewPost = {
            body: "Hey my friend how are you?"
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
                    "cognitoAuthenticationProvider": ':' + loggedUser.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await editPost(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Post = {
            ...loggedPostOtherProfile,
            body: postBody.body
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

    it('Other user logged edit his post to other user profile', async () => {
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
                    "cognitoAuthenticationProvider": ':' + otherUser.cognitoId
                }
            }
        };
        event.body = JSON.stringify(event.body);
        response = await editPost(event);
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

