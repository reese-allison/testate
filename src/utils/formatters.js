/**
 * Converts a number to Roman numerals.
 * Supports numbers 1-39 (sufficient for will article numbering).
 *
 * @param {number} num - The number to convert (must be positive integer)
 * @returns {string} The Roman numeral representation, or empty string for invalid input
 */
export function toRoman(num) {
  // Handle invalid input
  if (typeof num !== 'number' || !Number.isInteger(num) || num <= 0) {
    return ''
  }

  const romanNumerals = [
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ]
  let result = ''
  for (const [roman, value] of romanNumerals) {
    while (num >= value) {
      result += roman
      num -= value
    }
  }
  return result
}
