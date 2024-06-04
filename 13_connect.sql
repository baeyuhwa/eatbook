CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE fridge_lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    ingredient VARCHAR(100) NOT NULL,
    quantity VARCHAR(50),
    unit VARCHAR(20),
    expiration DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- 사용자 삽입
INSERT INTO users (username, email) VALUES ('john', 'john@example.com');

-- 냉장고 리스트 삽입
INSERT INTO fridge_lists (user_id, ingredient, quantity, unit, expiration) VALUES (1, '사과', '3', '개', '2024-06-30');

-- 레시피 삽입
INSERT INTO recipes (user_id, title, description) VALUES (1, '파스타', '맛있는 파스타 레시피 입니다.');
