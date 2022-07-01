export function to2Digits(num: number) {
  const numStr = num.toString();
  return numStr.length === 1 ? `0${numStr}` : numStr;
}

export default function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const minutesLeft = minutes % 60;
  return `${to2Digits(hours)}:${to2Digits(minutesLeft)}`;
}
