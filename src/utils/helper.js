/**
 * Get real DateTime (Reusable)
 * @returns DateTime as string
 */
function getDateTimeNow() {
  return new Date().toISOString();
}

export default getDateTimeNow;
