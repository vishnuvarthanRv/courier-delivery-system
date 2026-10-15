-- ============================================
--  Courier & Delivery Management System DB
-- ============================================

CREATE DATABASE IF NOT EXISTS courier_db;
USE courier_db;

-- Admin Users Table (Practical 02 - Auth)
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delivery Staff Table
CREATE TABLE IF NOT EXISTS delivery_staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  vehicle_type ENUM('Bike', 'Van', 'Truck') DEFAULT 'Bike',
  license_number VARCHAR(50),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parcels Table
CREATE TABLE IF NOT EXISTS parcels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(20) NOT NULL UNIQUE,
  sender_id INT NOT NULL,
  recipient_name VARCHAR(100) NOT NULL,
  recipient_phone VARCHAR(20) NOT NULL,
  recipient_address TEXT NOT NULL,
  recipient_city VARCHAR(50),
  weight DECIMAL(8,2) NOT NULL,
  parcel_type ENUM('Document', 'Package', 'Fragile', 'Perishable') DEFAULT 'Package',
  description TEXT,
  status ENUM('Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed', 'Returned') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parcel_id INT NOT NULL,
  staff_id INT NOT NULL,
  assigned_date DATE NOT NULL,
  delivery_date DATE,
  notes TEXT,
  status ENUM('Assigned', 'Picked Up', 'In Transit', 'Delivered', 'Failed') DEFAULT 'Assigned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES delivery_staff(id) ON DELETE CASCADE
);

-- Payments Table (Practical 02)
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parcel_id INT NOT NULL,
  customer_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('Cash', 'Card', 'Online') DEFAULT 'Cash',
  payment_status ENUM('Pending', 'Paid', 'Refunded') DEFAULT 'Pending',
  transaction_id VARCHAR(50),
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Tracking History Table
CREATE TABLE IF NOT EXISTS tracking_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  parcel_id INT NOT NULL,
  status VARCHAR(100) NOT NULL,
  location VARCHAR(150),
  notes TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parcel_id) REFERENCES parcels(id) ON DELETE CASCADE
);

-- ============================================
-- Sample Data
-- ============================================

-- Default Admin (password: password)
-- bcrypt hash of 'password' with salt rounds 10
INSERT INTO admins (username, email, password, role) VALUES
('admin', 'admin@courier.com', 'admin123', 'admin');

-- Sample Customers
INSERT INTO customers (name, email, phone, address, city) VALUES
('Arun Kumar', 'arun@gmail.com', '0771234567', '12 Main St, Colombo 03', 'Colombo'),
('Priya Nair', 'priya@gmail.com', '0779876543', '45 Temple Rd, Kandy', 'Kandy'),
('Ravi Shankar', 'ravi@gmail.com', '0762345678', '78 Beach Rd, Galle', 'Galle'),
('Meena Devi', 'meena@gmail.com', '0753456789', '23 Hill St, Nuwara Eliya', 'Nuwara Eliya');

-- Sample Delivery Staff
INSERT INTO delivery_staff (name, email, phone, vehicle_type, license_number, status) VALUES
('Kumar Perera', 'kumar@courier.com', '0701234567', 'Bike', 'B1234567', 'Active'),
('Saman Silva', 'saman@courier.com', '0702345678', 'Van', 'V2345678', 'Active'),
('Nimal Fernando', 'nimal@courier.com', '0703456789', 'Truck', 'T3456789', 'Active');

-- Sample Parcels
INSERT INTO parcels (tracking_number, sender_id, recipient_name, recipient_phone, recipient_address, recipient_city, weight, parcel_type, description, status) VALUES
('CDS-001-2024', 1, 'Suresh Babu', '0711111111', '10 Park Rd, Colombo 05', 'Colombo', 2.50, 'Package', 'Electronics - Handle with care', 'In Transit'),
('CDS-002-2024', 2, 'Chaminda Weerasekara', '0722222222', '55 Lake View, Kandy', 'Kandy', 0.50, 'Document', 'Legal documents', 'Delivered'),
('CDS-003-2024', 3, 'Lasith Malinga', '0733333333', '88 Ocean Ave, Galle', 'Galle', 5.00, 'Fragile', 'Glassware - Fragile', 'Pending'),
('CDS-004-2024', 4, 'Dilshan Perera', '0744444444', '15 Mountain Rd, Nuwara Eliya', 'Nuwara Eliya', 1.20, 'Package', 'Clothing items', 'Pending');

-- Sample Tracking History
INSERT INTO tracking_history (parcel_id, status, location, notes) VALUES
(1, 'Pending', 'Colombo Warehouse', 'Parcel registered in system'),
(1, 'Picked Up', 'Colombo Hub', 'Picked up by delivery staff'),
(1, 'In Transit', 'Highway Checkpoint', 'En route to destination'),
(2, 'Pending', 'Kandy Warehouse', 'Parcel registered in system'),
(2, 'Picked Up', 'Kandy Hub', 'Picked up by delivery staff'),
(2, 'In Transit', 'Central Hub', 'En route to destination'),
(2, 'Delivered', 'Destination', 'Successfully delivered'),
(3, 'Pending', 'Galle Warehouse', 'Parcel registered in system'),
(4, 'Pending', 'Nuwara Eliya Warehouse', 'Parcel registered in system');

-- Sample Deliveries
INSERT INTO deliveries (parcel_id, staff_id, assigned_date, delivery_date, status, notes) VALUES
(1, 1, '2024-01-10', NULL, 'In Transit', 'Express delivery'),
(2, 2, '2024-01-08', '2024-01-09', 'Delivered', 'Delivered on time');

-- Sample Payments
INSERT INTO payments (parcel_id, customer_id, amount, payment_method, payment_status, transaction_id, paid_at) VALUES
(1, 1, 375.00, 'Cash', 'Paid', 'TXN-1704700001-123', '2024-01-10 10:30:00'),
(2, 2, 275.00, 'Card', 'Paid', 'TXN-1704600002-456', '2024-01-08 09:15:00'),
(3, 3, 650.00, 'Online', 'Pending', 'TXN-1704500003-789', NULL);
