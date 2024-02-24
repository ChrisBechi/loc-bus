export const convertSecondsToHour = (seconds): string => {
  const converted = parseInt(seconds);
  var hours = Math.floor(converted / 60);
  var minutes = converted % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return "--";
  }
};
