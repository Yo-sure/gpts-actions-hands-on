// src/getUsersProgress.js
const axios = require('axios');

/**
 * 사용자들의 수강 진행률을 가져오는 함수
 * @param {Object} event - AWS Lambda 이벤트 객체
 * @returns {Object} API 응답
 */
module.exports.getUsersProgress = async (event) => {
  try {
    const response = await axios.get('https://reqres.in/api/users');

    const COURSE_PROGRESS = {
      '1': 'Chapter 1',
      '2': 'Chapter 2',
      '3': 'Chapter 4',
      // 추가 사용자에 대한 진행 상황
    };

    const usersWithProgress = response.data.data.map(user => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      progress: COURSE_PROGRESS[user.id] || 'Not started'
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usersWithProgress)
    };
  } catch (error) {
    console.error('Error fetching user list:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
