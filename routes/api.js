const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/call', async (req, res) => {
  try {
      console.log('요청 본문:', req.body); // 요청 본문 로깅

      const apiURL = 'https://www.bigdata-environment.kr/user/openapi/api.call.do';

      const response = await axios.post(apiURL, req.body, {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          responseType: 'text' // 응답을 텍스트로 받기
      });

      console.log('API 응답:', response.data);
      res.send(response.data);
  } catch (error) {
      console.error('API 호출 중 오류:', error.response ? error.response.data : error.message);
      res.status(500).send(error.message);
  }
});

/* api호출 page. */ 
router.get('/', function(req, res) {
    res.render('api', {title: 'API 호출', pageName:'api.ejs'});
});

module.exports = router;
