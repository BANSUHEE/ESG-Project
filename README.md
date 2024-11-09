1. mysql 모듈설치
   npm install mysql
3. mysql native_password 인증방식 변경
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
  FLUSH PRIVILEGES;
