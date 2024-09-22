// src/getUserProgress.js

const axios = require('axios');
const { CustomError } = require('./utils/errors');
const { responseWithPromptWrapper } = require('./utils/responseWithPromptWrapper');

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
const getUsersProgress = async (event) => {
    const courseId = event.queryStringParameters?.courseId;
    const courseName = courseId ? COURSES[courseId] : null;

    // 존재하지 않는 강의 ID인 경우 사용 가능한 강의 ID 목록을 반환
    if (courseId && !courseName) {
        throw new CustomError('Invalid Course ID', 400, 'INVALID_COURSE_ID', {
            availableCourseIds: Object.entries(COURSES).map(([id, name]) => ({ id, name }))
        });
    }

    // 외부 API에서 사용자 목록을 가져옴
    const response = await axios.get('https://reqres.in/api/users');

    // 강의 진행 상황을 시뮬레이션하기 위한 임시 데이터
    const COURSE_PROGRESS = {
        '1': { courseName: 'LLM Application', progress: 'Chapter 1' },
        '2': { courseName: 'ChatGPT 활용하기', progress: 'Chapter 2' },
        '3': { courseName: 'LLM Application', progress: 'Chapter 4' },
        // 추가 사용자에 대한 진행 상황
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
        body: { usersWithProgress },
        infoType: 'USER_PROGRESS'
    };
};

module.exports = {
    getUsersProgress: responseWithPromptWrapper(getUsersProgress)
};