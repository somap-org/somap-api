

//Aggiungi mariorossi
//Aggiungi fabiobianchi

//post1 = mariorossi pubblica post1
//post2 = fabiobianchi condivide post1 sul suo profilo

//--- ADD COMMENT
//comment1 = mariorossi pubblica commento sul post2 di fabio
//comment2 = fabiobianchi pubblica commento sul post2 di fabio
//comment3 = mario rossi pubblica commento sul post2 di fabio
//reply1comment3 = mario risponde al commento 3
//comment4 = fabiobianchi pubblica commento sul post1 di mario
//reply1comment4 = mario risponde al commento 4
//reply2comment4 = fabio risponde al commento 4

//ERROR: fabio prova a rispondere ad un post sbagliando il parametro userId
//ERROR: fabio prova a rispondere ad un commento sbagliando il parametro postId
//ERROR: utente non loggato pubblica commento sul post di fabio



//--- GET COMMENT
//get comment 1
//get reply1comment4
//ERROR: utente non loggato

//--- EDIT COMMENT
//comment2 = fabiobianchi modifica il suo commento
//reply1comment4 = mario modifica la sua risposta al commento 4
//ERROR: fabiobianchi modifica il comment3 non autorizzato

//--- GET COMMENTS
//fabio get commenti post1
//mario get commenti post2
//fabio get comment4 replies

//--- DELETE COMMENT
//ERROR: mariorossi elimina il commento 4 non autorizzato
//fabio elimina il commento 4
//fabio get comment4 replies restituisce insieme vuoto

//Elimina reply1comment4
//Controlla che comment4 ha replyCount = 1
//Controlla che get risposte comment4 ha solo reply2comment4
//Elimina comment3
//Controlla che post2 ha commentsCount = 2
//Controlla che get commenti post2 ha solo comment1 e comment2

//Elimina post1
//Controlla che comment4 da 404
//Elimina post2


import {deleteUser, main as signUp} from "../../../src/services/userGraph/user/signUp";
import {expect} from "chai";
import {NewPost} from "../../../src/interfaces/models/newPost";
import {main as addPost} from "../../../src/services/content/post/addPost";
import {main as getPost} from "../../../src/services/content/post/getPost";
import {main as getComment} from "../../../src/services/content/comment/getComment";
import {main as getComments} from "../../../src/services/content/comment/getComments";
import {main as getCommentReplies} from "../../../src/services/content/comment/getCommentReplies";
import {main as editComment} from "../../../src/services/content/comment/editComment";
import {main as deleteComment} from "../../../src/services/content/comment/deleteComment";
import {main as addComment} from "../../../src/services/content/comment/addComment";
import {Post} from "../../../src/interfaces/models/post";
import {Comment} from "../../../src/interfaces/models/comment";
import {UserRepository} from "../../../src/repositories/UserRepository";
import {NewComment} from "../../../src/interfaces/models/newComment";
import {PostRepository} from "../../../src/repositories/PostRepository";
import {main as deletePost} from "../../../src/services/content/post/deletePost";

let response, expectedResponse, event;
let mariorossi, fabiobianchi;
let
    post1,  //post pubblicato da mariorossi sul suo profilo
    post2,  //post pubblicato da fabiobianchi condividendo il post1 sul suo profilo
    comment1,   //mariorossi pubblica commento sul post2 di fabio
    comment2,   //fabiobianchi pubblica commento sul post2 di fabio
    comment3,   //mariorossi pubblica commento sul post2 di fabio
    comment4,   //fabiobianchi pubblica commento sul post1 di mario
    reply1comment3, //mariorossi risponde al commento 3
    reply1comment4, //mariorossi risponde al commento 4
    reply2comment4; //fabiobianchi risponde al commento 4

describe('comment', async function () {
    //Aggiungi/elimina mariorossi
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
    after('Delete mariorossi user', async () => {
        let delResponse = await deleteUser(mariorossi['_id']);
        expect(delResponse).to.be.true;
    });
    //Aggiungi/elimina fabiobianchi
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
    after('Delete fabiobianchi user', async () => {
        let delResponse = await deleteUser(fabiobianchi['_id']);
        expect(delResponse).to.be.true;
    });


    after('delete posts', async () => {
        let postRepo = new PostRepository();
        await postRepo.deletePost(post1.postId);
        await postRepo.deletePost(post2.postId);
    });


    it('Mariorossi publish post on his profile', async () => {
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
        post1 = response.body;
    });
    it('Fabiobianchi share mariorossi post on his (fabiobianchi) profile', async () => {
        let postBody:NewPost = {
            body: "Guarda questo post!",
            sharedPost: post1.postId
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
        post1.sharedCount++;
        response.body = JSON.parse(response.body);
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
            sharedPost: post1
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
        post2 = response.body;
    });

    it('Mariorossi comment1 fabio post2', async () => {
        let postBody:NewComment = {
            body: "Bel post! complimenti!"
        };

        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id'],
                "postId": post2.postId
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
        response = await addComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Comment = {
            commentId: response.body.commentId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(mariorossi['_id'])
            },
            postedAt: response.body.postedAt,
            likesCount: 0,
            repliesCount: 0,
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
        comment1 = response.body;
        post2.commentsCount++;
    });
    it('Fabiobianchi comment2 fabio post2', async () => {
        let postBody:NewComment = {
            body: "Grazie mille!!"
        };

        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id'],
                "postId": post2.postId
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
        response = await addComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Comment = {
            commentId: response.body.commentId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(fabiobianchi['_id'])
            },
            postedAt: response.body.postedAt,
            likesCount: 0,
            repliesCount: 0,
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
        comment2 = response.body;
        post2.commentsCount++;
    });
    it('Mariorossi comment3 fabio post2', async () => {
        let postBody:NewComment = {
            body: "Di niente!!!"
        };

        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id'],
                "postId": post2.postId
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
        response = await addComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Comment = {
            commentId: response.body.commentId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(mariorossi['_id'])
            },
            postedAt: response.body.postedAt,
            likesCount: 0,
            repliesCount: 0,
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
        comment3 = response.body;
        post2.commentsCount++;
    });
    it('Fabiobianchi comment4 mario post1', async () => {
        let postBody:NewComment = {
            body: "Grazie per la condivisione!"
        };

        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "postId": post1.postId
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
        response = await addComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Comment = {
            commentId: response.body.commentId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(fabiobianchi['_id'])
            },
            postedAt: response.body.postedAt,
            likesCount: 0,
            repliesCount: 0,
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
        comment4 = response.body;
        post1.commentsCount++;
    });

    it('Mariorossi replies to his comment3', async () => {
        let postBody:NewComment = {
            body: "E' un piacere!"
        };

        event = {
            "pathParameters": {
                "commentId": comment3.commentId
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
        response = await addComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Comment = {
            commentId: response.body.commentId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(fabiobianchi['_id'])
            },
            postedAt: response.body.postedAt,
            likesCount: 0,
            repliesCount: 0,
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                commentId: response.body.commentId,
                ...expectedBody
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        reply1comment3 = response.body;
        comment3.repliesCount++;
    });
    it('Mariorossi replies to fabio comment4', async () => {
        let postBody:NewComment = {
            body: "Prego!"
        };

        event = {
            "pathParameters": {
                "commentId": comment4.commentId
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
        response = await addComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Comment = {
            commentId: response.body.commentId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(mariorossi['_id'])
            },
            postedAt: response.body.postedAt,
            likesCount: 0,
            repliesCount: 0,
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                commentId: response.body.commentId,
                ...expectedBody
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        reply1comment4 = response.body;
        comment4.repliesCount++;
    });
    it('Fabiobianchi replies to fabio comment4', async () => {
        let postBody:NewComment = {
            body: ":)"
        };

        event = {
            "pathParameters": {
                "commentId": comment4.commentId
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
        response = await addComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Comment = {
            commentId: response.body.commentId,
            body: postBody.body,
            author: {
                ...await new UserRepository().getUserPublicProfile(fabiobianchi['_id'])
            },
            postedAt: response.body.postedAt,
            likesCount: 0,
            repliesCount: 0,
        };
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                commentId: response.body.commentId,
                ...expectedBody
            },
        };
        expect(response).to.deep.equal(expectedResponse);
        reply2comment4 = response.body;
        comment4.repliesCount++;
    });

    it('User not logged try to comment a post', async () => {
        let postBody:NewComment = {
            body: "test anonimo"
        };

        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "postId": post1.postId
            },
            "body": {
                ...postBody
            }
        };
        response = await addComment(event);
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

    it('Check post2 commentsCount = 3', async () => {
        event = {
            "pathParameters": {
                "postId": post2.postId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getPost(event);
        response.body = JSON.parse(response.body);
        post2.commentsCount = 3;
        post2.sharedPost = post1;
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: post2,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('Check comment4 repliesCount = 2', async () => {
        event = {
            "pathParameters": {
                "commentId": comment4.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: comment4,
        };
        expect(response).to.deep.equal(expectedResponse);
    });

    it('mariorossi get comment1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment1.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: comment1,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get post2 comments', async () => {
        event = {
            "pathParameters": {
                "postId": post2.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComments(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                comment1,
                comment2,
                comment3
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi get comment4 replies', async () => {
        event = {
            "pathParameters": {
                "commentId": comment4.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getCommentReplies(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                reply1comment4,
                reply2comment4
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('user not logged get comment4 replies', async () => {
        event = {
            "pathParameters": {
                "commentId": comment4.commentId
            }
        };
        response = await getCommentReplies(event);
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

    it('fabiobianchi edit his comment2', async () => {
        let postBody:NewComment = {
            body: "Nuovo testo del post"
        };

        event = {
            "pathParameters": {
                "commentId": comment2.commentId
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
        response = await editComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Post = {
            ...comment2,
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
        comment2 = response.body;
    });
    it('mariorossi edit his reply to comment4', async () => {
        let postBody:NewComment = {
            body: "Nuovo testo del post"
        };

        event = {
            "pathParameters": {
                "commentId": reply1comment4.commentId
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
        response = await editComment(event);
        response.body = JSON.parse(response.body);
        let expectedBody:Post = {
            ...reply1comment4,
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
        reply1comment4 = response.body;
    });
    it('user not logged edit reply2comment4', async () => {
        let postBody:NewComment = {
            body: "Nuovo testo del post"
        };

        event = {
            "pathParameters": {
                "commentId": reply2comment4.commentId
            },
            "body": {
                ...postBody
            }
        };
        response = await editComment(event);
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

    it('Delete reply1comment4 unauthorized', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment4.commentId
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

    it('Delete reply1comment4', async () => {
        event = {
            "pathParameters": {
                "commentId": reply1comment4.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await deleteComment(event);
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
    });
    it('Check comment4 repliesCount = 1', async () => {
        event = {
            "pathParameters": {
                "commentId": comment4.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        comment4.repliesCount = 1;
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: comment4,
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('check comment4 replies have only reply2comment4', async () => {
        event = {
            "pathParameters": {
                "commentId": comment4.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getCommentReplies(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                reply2comment4
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });

    it('Delete comment3', async () => {
        event = {
            "pathParameters": {
                "commentId": comment3.commentId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await deleteComment(event);
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
    });
    it('check post2 commentsCount = 2', async () => {
        event = {
            "pathParameters": {
                "postId": post2.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await getPost(event);
        response.body = JSON.parse(response.body);
        post2.commentsCount = 2;
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {
                ...post2
            },
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('check post2 comments have comment1 and comment2', async () => {
        event = {
            "pathParameters": {
                "postId": post2.postId
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": fabiobianchi.cognitoId
                }
            }
        };
        response = await getComments(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: [
                comment1,
                comment2
            ],
        };
        expect(response).to.deep.equal(expectedResponse);
    });

    it('mariorossi delete post1', async () => {
        event = {
            "pathParameters": {
                "userId": mariorossi['_id'],
                "postId": post1.postId
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
    });
    it('mariorossi get comment4 return 404', async () => {
        event = {
            "pathParameters": {
                "commentId": comment4.commentId,
            },
            "requestContext": {
                "identity": {
                    "cognitoIdentityId": mariorossi.cognitoId
                }
            }
        };
        response = await getComment(event);
        response.body = JSON.parse(response.body);
        expectedResponse = {
            statusCode: 404,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*'
            },
            body: {},
        };
        expect(response).to.deep.equal(expectedResponse);
    });
    it('mariorossi delete post2', async () => {
        event = {
            "pathParameters": {
                "userId": fabiobianchi['_id'],
                "postId": post2.postId
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
    });
});
