// src/utils/responseWithPromptWrapper.js

const {
    ADDITIONAL_INFORMATION,
    REQUEST_GUIDELINES,
    RESPONSE_FORMATTING,
} = require("./constants");
const { CustomError } = require("./errors");

/**
 * 핸들러 함수에 프롬프트 관련 정보를 추가하는 래퍼 함수
 * @param {Function} handler - 래핑할 핸들러 함수
 * @returns {Function} 새로운 핸들러 함수
 */
const responseWithPromptWrapper = (handler) => async (event) => {
    try {
        const result = await handler(event);
        return {
            statusCode: result.statusCode || 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...result.body,
                ADDITIONAL_INFORMATION_FOR_ASSISTANT:
                    ADDITIONAL_INFORMATION[result.infoType],
                RESPONSE_FORMATTING_GUIDELINES_FOR_ASSISTANT:
                    RESPONSE_FORMATTING[result.infoType],
            }),
        };
    } catch (error) {
        if (error instanceof CustomError) {
            return {
                statusCode: error.statusCode || 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    error: error.message,
                    ...error.additionalInfo,
                    ADDITIONAL_INFORMATION_FOR_ASSISTANT:
                        ADDITIONAL_INFORMATION[error.infoType],
                    REQUEST_GUIDELINES_FOR_ASSISTANT:
                        REQUEST_GUIDELINES[error.infoType],
                    RESPONSE_FORMATTING_GUIDELINES_FOR_ASSISTANT:
                        RESPONSE_FORMATTING[error.infoType],
                }),
            };
        }
        console.error("Unhandled error:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                error: "Internal Server Error",
                ADDITIONAL_INFORMATION_FOR_ASSISTANT:
                    ADDITIONAL_INFORMATION.DEFAULT_ERROR,
            }),
        };
    }
};

module.exports = {
    responseWithPromptWrapper,
};
