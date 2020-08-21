var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getUserPublicProfile_1 = require("../../services/userGraph/getUserPublicProfile");
const event = {
    "pathParameters": {
        "userId": "5ed6d4f68f7e4d8d985033f9"
    },
    "requestContext": {
        "identity": {
            "cognitoIdentityId": "abcdevfefe-1232132-cofeve"
        }
    }
};
describe('Site Search', () => __awaiter(this, void 0, void 0, function* () {
    it('should query for the user entered term', () => __awaiter(this, void 0, void 0, function* () {
        let response = yield getUserPublicProfile_1.main(event);
        cy.log("" + response);
    }));
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VXNlclB1YmxpY1Byb2ZpbGUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy91c2VyR3JhcGgvZ2V0VXNlclB1YmxpY1Byb2ZpbGUuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsd0ZBQW1FO0FBRW5FLE1BQU0sS0FBSyxHQUFHO0lBQ1YsZ0JBQWdCLEVBQUU7UUFDZCxRQUFRLEVBQUUsMEJBQTBCO0tBQ3ZDO0lBQ0QsZ0JBQWdCLEVBQUU7UUFDZCxVQUFVLEVBQUU7WUFDUixtQkFBbUIsRUFBRSwyQkFBMkI7U0FDbkQ7S0FDSjtDQUNKLENBQUM7QUFDRixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQVMsRUFBRTtJQUMvQixFQUFFLENBQUUsd0NBQXdDLEVBQUUsR0FBUyxFQUFFO1FBRXJELElBQUksUUFBUSxHQUFHLE1BQU0sMkJBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBQyxRQUFRLENBQUMsQ0FBQztJQUV4QixDQUFDLENBQUEsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFBLENBQUMsQ0FBQyJ9