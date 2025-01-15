// Format recording time with hours:minutes:seconds and optionally milliseconds
export function formatRecordingTime(timeInSeconds, showMilliseconds = false) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  // Build time string
  let timeStr = '';
  if (hours > 0) {
    timeStr += `${hours.toString().padStart(2, '0')}:`;
  }
  timeStr += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (showMilliseconds) {
    const ms = Math.floor((timeInSeconds % 1) * 1000);
    timeStr += `.${ms.toString().padStart(3, '0')}`;
  }

  return timeStr;
}

// Format full timestamp with date and time
export function formatTimestamp(date = new Date()) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}