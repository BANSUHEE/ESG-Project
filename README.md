1. mysql 모듈설치
   npm install mysql
2. mysql native_password 인증방식 변경
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';
   FLUSH PRIVILEGES;

3. emission table create
   CREATE TABLE emissions (
   username VARCHAR(50) PRIMARY KEY,
   year YEAR NOT NULL, -- 연도, YEAR 타입
   month TINYINT NOT NULL CHECK (month BETWEEN 1 AND 12), -- 월, 1-12 사이의 값으로 제한
   electricity_co2 DECIMAL(10,2) DEFAULT 0.00, -- 전기 CO2 배출량
   gas_co2 DECIMAL(10,2) DEFAULT 0.00, -- 가스 CO2 배출량
   water_co2 DECIMAL(10,2) DEFAULT 0.00, -- 수도 CO2 배출량
   transport_co2 DECIMAL(10,2) DEFAULT 0.00, -- 교통 CO2 배출량
   waste_co2 DECIMAL(10,2) DEFAULT 0.00, -- 폐기물 CO2 배출량
   total_co2 DECIMAL(10,2) DEFAULT 0.00, -- 총 CO2 배출량
   FOREIGN KEY (username) REFERENCES companies(username) ON DELETE CASCADE
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    ++ primary 키 수정
    ALTER TABLE emissions DROP PRIMARY KEY;
    ALTER TABLE emissions ADD PRIMARY KEY (year, month);

4. emission table 중복 불인정
   ALTER TABLE emissions ADD UNIQUE KEY unique_key (username, year, month);
