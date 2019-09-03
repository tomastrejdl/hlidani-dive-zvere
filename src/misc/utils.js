/**
 * Return modulo of the two numbers
 * @param number n
 * @param number m
 */
export function mod(n, m) {
  return ((n % m) + m) % m
}

export function getLang() {
  if (navigator.languages != undefined) return navigator.languages[0]
  else return navigator.language
}
