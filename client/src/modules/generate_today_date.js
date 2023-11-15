function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 月は0から始まるので1を足す
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

export default getTodayDateString;