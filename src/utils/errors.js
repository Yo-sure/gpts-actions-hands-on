// src/utils/errors.js

/**
 * 커스텀 에러 클래스를 정의합니다.
 * @extends Error
 */
class CustomError extends Error {
    /**
     * 커스텀 에러 생성자
     * @param {string} message - 에러 메시지
     * @param {number} statusCode - HTTP 상태 코드
     * @param {string} infoType - 에러 타입
     * @param {Object} [additionalInfo={}] - 추가 정보
     */
    constructor(message, statusCode, infoType, additionalInfo = {}) {
        super(message);
        this.statusCode = statusCode;
        this.infoType = infoType;
        this.additionalInfo = additionalInfo;
    }
}

module.exports = {
    CustomError,
};
