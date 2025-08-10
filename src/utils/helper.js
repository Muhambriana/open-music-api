import { nanoid } from 'nanoid';

const isBlankString = (str) => str.trim() === '';

/**
 * Get real DateTime (Reusable)
 * @returns DateTime as string
 */
function getDateTimeNow() {
  return new Date().toISOString();
}

function generateNanoid(prefix) {
  if (!prefix) {
    throw new Error('Prefix can not be null');
  }
  return `${prefix}-${nanoid(12)}`;
}

export {
  getDateTimeNow,
  generateNanoid,
  isBlankString,
};
