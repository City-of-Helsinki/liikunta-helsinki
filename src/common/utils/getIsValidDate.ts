export default function getIsDateValid(date: Date): boolean {
  return !isNaN(date.getTime());
}
