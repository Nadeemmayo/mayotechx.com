-- MayoTechX planned schema (MySQL/MariaDB, Hostinger-compatible). Not deployed yet.
CREATE TABLE roles (id TINYINT PRIMARY KEY, name VARCHAR(30) UNIQUE NOT NULL);
CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(190) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL,
  role_id TINYINT NOT NULL REFERENCES roles(id), name VARCHAR(120), created_at DATETIME DEFAULT CURRENT_TIMESTAMP, last_login DATETIME);
CREATE TABLE niches (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) UNIQUE NOT NULL);
CREATE TABLE publishers (id INT AUTO_INCREMENT PRIMARY KEY, public_id VARCHAR(12) UNIQUE NOT NULL, domain VARCHAR(190) UNIQUE NOT NULL,
  display_name VARCHAR(190), primary_niche_id INT REFERENCES niches(id), country VARCHAR(80), language VARCHAR(40),
  guest_post BOOL, niche_edit BOOL, digital_pr BOOL, turnaround VARCHAR(60), link_attribute VARCHAR(30), sponsored_policy VARCHAR(190),
  requirements TEXT, public_notes TEXT, status ENUM('active','paused','removed') DEFAULT 'active', last_verified DATE,
  INDEX(country), INDEX(language), INDEX(status));
CREATE TABLE publisher_niches (publisher_id INT REFERENCES publishers(id), niche_id INT REFERENCES niches(id), PRIMARY KEY(publisher_id,niche_id));
CREATE TABLE publisher_metrics (id INT AUTO_INCREMENT PRIMARY KEY, publisher_id INT NOT NULL REFERENCES publishers(id),
  da TINYINT, pa TINYINT, dr TINYINT, traffic INT, traffic_country VARCHAR(80), source VARCHAR(60), checked_on DATE NOT NULL, INDEX(publisher_id,checked_on));
CREATE TABLE publisher_prices (id INT AUTO_INCREMENT PRIMARY KEY, publisher_id INT NOT NULL REFERENCES publishers(id), service ENUM('guest_post','niche_edit','digital_pr'),
  client_price DECIMAL(10,2), currency CHAR(3) DEFAULT 'USD', valid_from DATE);
-- PRIVATE: never exposed by public endpoints
CREATE TABLE publisher_private (publisher_id INT PRIMARY KEY REFERENCES publishers(id), contact_name VARCHAR(120), contact_email VARCHAR(190),
  internal_cost DECIMAL(10,2), margin DECIMAL(10,2), negotiation_notes TEXT, agreement TEXT, supplier_status VARCHAR(40));
CREATE TABLE directories (id INT AUTO_INCREMENT PRIMARY KEY, public_id VARCHAR(12) UNIQUE, name VARCHAR(190), website VARCHAR(190) UNIQUE,
  country VARCHAR(80), region VARCHAR(80), city_coverage VARCHAR(120), industry VARCHAR(120), category VARCHAR(80), language VARCHAR(40),
  listing_type VARCHAR(60), submission_fee DECIMAL(10,2), client_price DECIMAL(10,2), currency CHAR(3), da TINYINT, pa TINYINT, dr TINYINT,
  traffic INT, metric_source VARCHAR(60), requirements TEXT, approval_process TEXT, review_time VARCHAR(60), status VARCHAR(20), last_verified DATE, INDEX(country));
CREATE TABLE leads (id INT AUTO_INCREMENT PRIMARY KEY, funnel VARCHAR(40), name VARCHAR(120), company VARCHAR(120), email VARCHAR(190), whatsapp VARCHAR(40),
  website VARCHAR(190), language VARCHAR(10), payload JSON, consent_at DATETIME NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, INDEX(funnel), INDEX(created_at));
CREATE TABLE quote_requests (id INT AUTO_INCREMENT PRIMARY KEY, lead_id INT REFERENCES leads(id), kind ENUM('publisher','directory'), service VARCHAR(60),
  target_url VARCHAR(255), notes TEXT, status ENUM('new','quoted','approved','in_progress','delivered','closed') DEFAULT 'new');
CREATE TABLE quote_items (quote_id INT REFERENCES quote_requests(id), item_type ENUM('publisher','directory'), item_id INT, price DECIMAL(10,2), PRIMARY KEY(quote_id,item_type,item_id));
CREATE TABLE orders (id INT AUTO_INCREMENT PRIMARY KEY, quote_id INT REFERENCES quote_requests(id), client_user_id INT REFERENCES users(id), total DECIMAL(10,2), currency CHAR(3), status VARCHAR(30), created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT REFERENCES orders(id), item_type VARCHAR(20), item_id INT, live_url VARCHAR(255), published_on DATE);
CREATE TABLE audit_log (id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id INT REFERENCES users(id), action VARCHAR(60), entity VARCHAR(40), entity_id INT, diff JSON, ip VARBINARY(16), at DATETIME DEFAULT CURRENT_TIMESTAMP);
