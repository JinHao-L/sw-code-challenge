// Problem 1: Three ways to sum to n

var sum_to_n_a = function(n) {
  // loop
  let sum = 0
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function(n) {
  // math
  return (n + 1) * n / 2
};

var sum_to_n_c = function(n) {
  // recursion
  if (n == 1) return 1;
  return n + sum_to_n_c(n - 1); 
};

console.log("sum_to_n_a", sum_to_n_a(5))
console.log("sum_to_n_b", sum_to_n_b(5))
console.log("sum_to_n_c", sum_to_n_c(5))