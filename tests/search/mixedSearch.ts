import {main as signUp} from "../../src/services/userGraph/user/signUp";
import {expect} from "chai";
import {Place} from "../../src/interfaces/models/place";
import {main as addPlace} from "../../src/services/userGraph/place/addPlace";
import {Activities} from "../../src/interfaces/models/activities";
import {main as addActivity} from "../../src/services/content/activity/addActivity";
import {main as search} from "../../src/services/search/mixedSearch";

let response;
let event, expectedResponse;
let firstuser, seconduser, redmambauser, redstyleuser,
  firstplace, firstPlaceActivities = [],
  secondplace, secondPlaceActivities = [];
describe('Mixed Search', async () => {

  it('Signing up test firstuser and their location', async () => {
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
    firstuser = await signUp(event);
    expect(firstuser).to.not.be.null;
  });
  it('Signing up test seconduser and their location', async () => {
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
    seconduser = await signUp(event);
    expect(seconduser).to.not.be.null;
  });

  it('Signing up test redmambauser', async () => {
    event = {
      "userName": "redmamba",
      "request": {
        "userAttributes": {
          "email": "redmamba@gmail.com",
          "email_verified": true,
          "name": "Red Mamba User",
          "sub": "abcdevfefe-1232132-cofeve",
          "custom:userType": "classicUser"
        }
      }
    };
    redmambauser = await signUp(event);
    redmambauser = redmambauser.toJSON();
    redmambauser.publicProfile.userType = redmambauser.userType;

    expect(seconduser).to.not.be.null;
  });

  it('Signing up test redstyleuser', async () => {
    event = {
      "userName": "redstyleuser",
      "request": {
        "userAttributes": {
          "email": "redstyleuser@gmail.com",
          "email_verified": true,
          "name": "Red Style",
          "sub": "abcdevfefe-1232132-cofeve",
          "custom:userType": "classicUser"
        }
      }
    };
    redstyleuser = await signUp(event);
    redstyleuser = redstyleuser.toJSON();
    redstyleuser.publicProfile.userType = redstyleuser.userType;
    expect(seconduser).to.not.be.null;
  });


  it('Add test place to firstuser', async () => {
    let placeBody: Place = {
      name: "ORION",
      description: "Locale con capacità di 1.200 persone che propone diverse serate con band dal vivo, discoteca e feste.",
      address: "Viale J. F. Kennedy, 52, 00043 Ciampino RM",
      coordinates: {
        latitude: 41.8099168,
        longitude: 12.5969897
      }
    };
    event = {
      "pathParameters": {
        "userId": firstuser['_id']
      },
      "body": {
        ...placeBody
      },
      "requestContext": {
        "identity": {
          "cognitoAuthenticationProvider": ':' + firstuser.cognitoId
        }
      }
    };
    event.body = JSON.stringify(event.body);
    response = await addPlace(event);
    response.body = JSON.parse(response.body);

    expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        ...placeBody,
        placeId: response.body.placeId
      },
    };
    expect(response).to.deep.equal(expectedResponse);
    firstplace = response.body;
  });
  it('Add test place to seconduser', async () => {
    let placeBody: Place = {
      name: "Red 747",
      description: "Discoteca pomeridiana di ciampino.",
      address: "Viale J. F. Kennedy, 42, 00043 Ciampino RM",
      coordinates: {
        latitude: 41.8099168,
        longitude: 12.5969897
      }
    };
    event = {
      "pathParameters": {
        "userId": seconduser['_id']
      },
      "body": {
        ...placeBody
      },
      "requestContext": {
        "identity": {
          "cognitoAuthenticationProvider": ':' + seconduser.cognitoId
        }
      }
    };
    event.body = JSON.stringify(event.body);
    response = await addPlace(event);
    response.body = JSON.parse(response.body);

    expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        ...placeBody,
        placeId: response.body.placeId
      },
    };
    expect(response).to.deep.equal(expectedResponse);
    secondplace = response.body;
  });

  it('Add test activities to firstuser', async () => {
    let activitiesBody: Activities = [
      {
        name: "Red Party",
        description: "Red clothes party",
        date: "19/06/2020",
        thumbnail: "https://www.photo.it"
      },
      {
        name: "Green Party",
        description: "Green clothes party",
        date: "19/06/2020",
        thumbnail: "https://www.photo.it"
      },
      {
        name: "Yellow Party",
        description: "Yellow clothes party",
        date: "19/06/2020",
        thumbnail: "https://www.photo.it"
      }
    ];
    for (const activityBody of activitiesBody) {
      event = {
        "pathParameters": {
          "placeId": firstplace.placeId
        },
        "body": {
          ...activityBody
        },
        "requestContext": {
          "identity": {
            "cognitoAuthenticationProvider": ':' + firstuser.cognitoId
          }
        }
      };
      event.body = JSON.stringify(event.body);
      response = await addActivity(event);
      response.body = JSON.parse(response.body);
      expectedResponse = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        body: {
          ...activityBody,
          activityId: response.body.activityId
        },
      };
      expect(response).to.deep.equal(expectedResponse);
      firstPlaceActivities.push(response.body);
    }

  });
  it('Add test activities to seconduser', async () => {
    let activitiesBody: Activities = [
      {
        name: "Red music party",
        description: "Red music party",
        date: "19/06/2020",
        thumbnail: "https://www.photo.it"
      },
      {
        name: "Green Future house party",
        description: "Green clothes party",
        date: "19/06/2020",
        thumbnail: "https://www.photo.it"
      },
      {
        name: "Raggie party",
        description: "Yellow clothes party",
        date: "19/06/2020",
        thumbnail: "https://www.photo.it"
      }
    ];
    for (const activityBody of activitiesBody) {
      event = {
        "pathParameters": {
          "placeId": secondplace.placeId
        },
        "body": {
          ...activityBody
        },
        "requestContext": {
          "identity": {
            "cognitoAuthenticationProvider": ':' + seconduser.cognitoId
          }
        }
      };
      event.body = JSON.stringify(event.body);
      response = await addActivity(event);
      response.body = JSON.parse(response.body);
      expectedResponse = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*'
        },
        body: {
          ...activityBody,
          activityId: response.body.activityId
        },
      };
      expect(response).to.deep.equal(expectedResponse);
      secondPlaceActivities.push(response.body);
    }
  });

  it('Search for red', async () => {
    event = {
      "queryStringParameters": {
        "query": 'red'
      },
      "requestContext": {
        "identity": {
          "cognitoAuthenticationProvider": ':' + firstuser.cognitoId
        }
      }
    };
    expectedResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
      },
      body: {
        activities: [
          firstPlaceActivities[0],
          secondPlaceActivities[0]
        ],
        places: [
          secondplace
        ],
        users: [
          {
            ...redmambauser.publicProfile,
            userId: redmambauser['_id'].toString()
          },
          {
            ...redstyleuser.publicProfile,
            userId: redstyleuser['_id'].toString()
          }
        ]
      }
    };
    let response = await search(event);
    response.body = JSON.parse(response.body);
    expect(response).to.deep.equal(expectedResponse);
  });
});
