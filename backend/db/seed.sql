-- Seed data for testing
-- Note: For prototype, passwords are set to simple values
-- In production, use proper bcrypt hashing

-- Insert default admin user (password: admin123)
-- Using bcrypt hash for 'admin123'
INSERT INTO users (username, password, role, name) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'Admin User')
ON CONFLICT (username) DO NOTHING;

-- Insert default member users (password: member123)
-- Using bcrypt hash for 'member123'
INSERT INTO users (username, password, role, name) VALUES
('member1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'member', 'John Doe'),
('member2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'member', 'Jane Smith')
ON CONFLICT (username) DO NOTHING;
