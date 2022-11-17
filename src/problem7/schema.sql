--- For testing purposes
CREATE TABLE balances (
  id INT,
  address VARCHAR,
  denom VARCHAR,
  amount BIGINT,
  block_height INT
);
INSERT INTO balances (id, address, denom, amount, block_height) VALUES
(1, '0xabab', 'usdc', 50000000000000, 73375),
(2, '0x99cc', 'swth', -20000000, 733757),
(3, '0xabab', 'usdc', -50000000000, 733855);

CREATE TABLE trades (
  id INT,
  address VARCHAR,
  denom VARCHAR,
  amount BIGINT,
  block_height INT
);
INSERT INTO trades (id, address, denom, amount, block_height) VALUES
(1, '0xabab', 'swth', 400000000000, 733756),
(2, '0x99cc', 'swth', 3500000000000, 733757),
(3, '0x67f3', 'swth', 72000000000000, 733758),
(4, '0xabab', 'swth', 450000000000, 733756);
