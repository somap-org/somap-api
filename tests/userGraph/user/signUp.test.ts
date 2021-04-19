import {main, deleteUser} from '../../../src/services/userGraph/user/signUp';
import {expect} from 'chai';

let event;
let user;
describe('signUp Classic User', async () => {

    afterEach('Delete signed up user', async () => {
        if (user) {
            let delResponse = await deleteUser(user['_id']);
            expect(delResponse).to.be.true;
        }
    });

    it ('Signing up request correct', async () => {
        event = {
            "userName": "lucapirrone",
            "request": {
                "userAttributes": {
                    "email": "exampleuser@example.com",
                    "email_verified": true,
                    "name": "Luca Pirrone",
                    "sub": "abcdevfefe-1232132-cofeve",
                    "custom:userType": "camUser"
                }
            }
        };
        user = await main(event);
        expect(user).to.not.be.null;
    });
    it ('Signing up request missing custom:userType', async () => {
        event = {
            "userName": "lucapirrone",
            "request": {
                "userAttributes": {
                    "email": "exampleuser@example.com",
                    "email_verified": true,
                    "name": "Luca Pirrone",
                    "sub": "abcdevfefe-1232132-cofeve"
                }
            }
        };
        user = await main(event);
        expect(user).to.be.null;
    });
    it ('Signing up request wrong user type', async () => {
        event = {
            "userName": "lucapirrone",
            "request": {
                "userAttributes": {
                    "email": "exampleuser@example.com",
                    "email_verified": true,
                    "name": "Luca Pirrone",
                    "sub": "abcdevfefe-1232132-cofeve",
                    "custom:userType": "WrongUserType"
                }
            }
        };
        user = await main(event);
        expect(user).to.be.null;
    });
});
