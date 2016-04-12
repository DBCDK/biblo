export default function TimeToString(past) {
  const delta = (Date.now() - Date.parse(past)) /1000;
  const days = Math.floor(delta / (24 * 3600));
  const hours = Math.floor(delta / (3600));
  const minutes = Math.floor(delta / (60));
  if (days) {
    if (days === 1) {
      return '1 dag siden';
    }
    return `${days} dage siden`;
  }
  if (hours) {
    if (hours === 1) {
      return '1 time siden';
    }
    return `${hours} timer siden`;
  }
  if (minutes) {
    if (minutes === 1) {
      return '1 minut siden';
    }
    return `${minutes} minutter siden`;
  }
  return 'Lige nu';
}
