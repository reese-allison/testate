/**
 * Converts a number to its word representation.
 * Supports integers 0-100 (sufficient for percentages and days).
 *
 * @param {number} num - The number to convert (must be integer 0-100)
 * @returns {string} The word representation, or the number as string for unsupported values
 */
export function toWords(num) {
  if (typeof num !== 'number' || !Number.isInteger(num)) {
    return String(num)
  }

  const ones = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ]

  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ]

  if (num >= 0 && num < 20) {
    return ones[num]
  }

  if (num >= 20 && num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return one === 0 ? tens[ten] : `${tens[ten]}-${ones[one]}`
  }

  if (num === 100) {
    return 'one hundred'
  }

  // For numbers outside 0-100, return as string
  return String(num)
}

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
