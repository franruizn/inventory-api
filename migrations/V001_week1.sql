CREATE TABLE items (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  sku         VARCHAR(50) NOT NULL UNIQUE,
  quantity    INT UNSIGNED NOT NULL DEFAULT 0,
  price       DECIMAL(10,2) NOT NULL,
  category    ENUM('electronics','clothing','food','other') NOT NULL,
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP NULL DEFAULT NULL   -- soft delete
);

CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_deleted  ON items(deleted_at);