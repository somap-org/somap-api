export const isApiGatewayResponse = response => {
    const { statusCode, headers, body } = response;
    if (!statusCode || !headers || !body) return false;
    if (typeof statusCode !== "number") return false;
    if (typeof body !== "string") return false;
    if (!isCorrectHeaders(headers)) return false;
    return true;
};

const isCorrectHeaders = headers => {
    if (headers['Content-Type'] !== 'application/json') return false;
    if (headers['Access-Control-Allow-Methods'] !== '*') return false;
    if (headers['Access-Control-Allow-Origin'] !== '*') return false;

    return true;
};
