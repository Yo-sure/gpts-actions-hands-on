// src/getUsersProgress.js
const axios = require('axios');

// 코스 매핑 정보
const COURSES = {
    101: 'LLM Application',
    102: 'ChatGPT 활용하기'
};

/**
 * 사용자들의 수강 진행률을 가져오는 함수
 * @param {Object} event - AWS Lambda 이벤트 객체
 * @returns {Object} API 응답
 */
module.exports.getUsersProgress = async (event) => {
    try {
        // API Gateway를 통해 전달된 쿼리스트링 파라미터에서 courseId를 가져옴
        const courseId = event.queryStringParameters?.courseId;
        const courseName = courseId ? COURSES[courseId] : null;

        // 존재하지 않는 강의 ID인 경우 사용 가능한 강의 ID 목록을 반환
        if (courseId && !courseName) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    error: "Invalid Course ID",
                    availableCourseIds: Object.entries(COURSES).map(([id, name]) => ({ id, name })),
                    ADDITIONAL_INFORMATION_FOR_ASSISTANT: 'Let users know that if they don\'t see a course they want, they can contact jaewng.yun@samsung.com to request.',
                    REQUEST_GUIDELINES_FOR_ASSISTANT: 'The request courseId must be a number.',
                    RESPONSE_FORMATTING_GUIDELINES_FOR_ASSISTANT: "Use emojis to be as friendly as possible."
                })
            };
        }

        // reqres.in에서 사용자 목록을 가져옴
        const response = await axios.get('https://reqres.in/api/users');

        // 강의 진행 상황을 시뮬레이션하기 위한 임시 데이터
        const COURSE_PROGRESS = {
            '1': { courseName: 'LLM Application', progress: 'Chapter 1' },
            '2': { courseName: 'ChatGPT 활용하기', progress: 'Chapter 2' },
            '3': { courseName: 'LLM Application', progress: 'Chapter 4' },
            // 나머지 사용자에 대한 진행 상황
        };

        // 사용자 정보와 함께 강의 진행 상황을 매핑
        const usersWithProgress = response.data.data
            .map(user => ({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
                avatar: user.avatar,
                progress: COURSE_PROGRESS[user.id]?.progress || 'Not started',
                courseName: COURSE_PROGRESS[user.id]?.courseName || 'Not Registered'
            }))
            .filter(user => !courseName || user.courseName === courseName);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usersWithProgress,
                ADDITIONAL_INFORMATION_FOR_ASSISTANT: 'If courseName is \'Not Registered\' provide a link to "samsungsds.com" with marketing copy so users can enroll right away.\nBecause it\'s winter break, we\'re currently discounting $30 to $15. The original price of $30 must be with a strikethrough.',  
                RESPONSE_FORMATTING_GUIDELINES_FOR_ASSISTANT: 'When providing a list, be sure to provide it as a markdown table with the headers profile, courseName, and progress.\nDo not reverse the order of the headers. Profile consists of photo + name.\nIn particular, the person who made the most progress is marked as the winner (with an emoji).'
            })
        };
    } catch (error) {
        console.error('Error fetching user list:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};