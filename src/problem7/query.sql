SELECT DISTINCT t.address
FROM trades t 
  JOIN (
    SELECT 
      b.address, 
      SUM(
        CASE
          WHEN denom = 'usdc' THEN 0.000001 * amount
          WHEN denom = 'swth' THEN 0.00000005 * amount
          WHEN denom = 'tmz' THEN 0.003 * amount
        END
      ) AS balance
    FROM balances b
    GROUP BY b.address
  ) bal
  ON t.address = bal.address
WHERE t.block_height >= 730000 AND bal.balance >= 500

