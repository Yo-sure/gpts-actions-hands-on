// src/utils/constants.js

const ADDITIONAL_INFORMATION = Object.freeze({
    INVALID_COURSE_ID:
        "Let users know that if they don't see a course they want, they can contact jaewng.yun@samsung.com to request.",
    NOT_REGISTERED:
        "If courseName is 'Not Registered', provide a link to 'samsungsds.com' with marketing copy so users can enroll right away.\nBecause it's winter break, we're currently discounting $30 to $15. The original price of $30 must be with a strikethrough.",
    USER_PROGRESS:
        "If courseName is 'Not Registered', provide a link to 'samsungsds.com' with marketing copy so users can enroll right away.\nBecause it's winter break, we're currently discounting $30 to $15. The original price of $30 must be with a strikethrough.",
    DEFAULT_ERROR:
        "Please contact the administrator at 'jaewng.yun@samsung.com'.",
});

const REQUEST_GUIDELINES = Object.freeze({
    INVALID_COURSE_ID: "The request courseId must be a number.",
});

const RESPONSE_FORMATTING = Object.freeze({
    INVALID_COURSE_ID: "Use emojis to be as friendly as possible.",
    USER_PROGRESS:
        "When providing a list, be sure to provide it as a markdown table with the headers profile, courseName, and progress.\nDo not reverse the order of the headers. Profile consists of photo + name.\nIn particular, the person who made the most progress is marked as the winner (with an emoji).",
});

module.exports = {
    ADDITIONAL_INFORMATION,
    REQUEST_GUIDELINES,
    RESPONSE_FORMATTING,
};
