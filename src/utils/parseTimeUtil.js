export const parseTime = (formattedTime) => {
  // Parse the provided ISO string into a Date object
  const date = new Date(formattedTime);
  if (isNaN(date)) {
    console.error('Invalid formattedTime:', formattedTime);
    return null; // Return null or handle invalid input
  }


  // Convert to IST timezone offset (Asia/Kolkata is UTC+5:30)
  const istOffset = 5 * 60 + 30; // 5 hours 30 minutes in minutes
  const utcOffset = date.getTimezoneOffset(); // Get current UTC offset in minutes
  const istDate = new Date(
    date.getTime() + (istOffset - utcOffset) * 60 * 1000,
  );

  // Extract hours, minutes, and format (AM/PM)
  let hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 or 12 hours to 12-hour format

  // Format the time as "hh:mm AM/PM"
  const formattedISTTime = `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  console.log('ccc', formattedISTTime);
  return formattedISTTime;
};
// utils / parseTime.js
