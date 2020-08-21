Object.defineProperty(exports, "__esModule", { value: true });
exports.isApiGatewayResponse = void 0;
exports.isApiGatewayResponse = response => {
    const { statusCode, headers, body } = response;
    if (!statusCode || !headers || !body)
        return false;
    if (typeof statusCode !== "number")
        return false;
    if (typeof body !== "string")
        return false;
    if (!isCorrectHeaders(headers))
        return false;
    return true;
};
const isCorrectHeaders = headers => {
    if (headers['Content-Type'] !== 'application/json')
        return false;
    if (headers['Access-Control-Allow-Methods'] !== '*')
        return false;
    if (headers['Access-Control-Allow-Origin'] !== '*')
        return false;
    return true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy90ZXN0VXRpbGVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBYSxRQUFBLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxFQUFFO0lBQzNDLE1BQU0sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQztJQUMvQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ25ELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ2pELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUTtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQzNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUM3QyxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRixNQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxFQUFFO0lBQy9CLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLGtCQUFrQjtRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ2pFLElBQUksT0FBTyxDQUFDLDhCQUE4QixDQUFDLEtBQUssR0FBRztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBQ2xFLElBQUksT0FBTyxDQUFDLDZCQUE2QixDQUFDLEtBQUssR0FBRztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBRWpFLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQyJ9