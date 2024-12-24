import { isWithinInterval } from 'date-fns';

let foundSeptember2024 = false;

export const parseKakaoDate = (line: string): Date | null => {
  try {
    // Match Korean date format: "YYYY년 M월 D일 요일"
    const match = line.match(
      /(\d{4})[년.\s]\s*(\d{1,2})[월.\s]\s*(\d{1,2})[일.]?/
    );
    if (!match) return null;

    const [_, year, month, day] = match;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // Months are 0-based in JavaScript
      parseInt(day)
    );

    // 2024년 9월을 찾으면 플래그 설정
    if (year === '2024' && month === '10') {
      foundSeptember2024 = true;
    }

    // Validate the date
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};
export const shouldSkipDate = (date: Date): boolean => {
  // 2024년 9월 이전 데이터는 건너뛰기
  if (!foundSeptember2024) {
    return false;
  }

  const startDate = new Date(2024, 10, 1); // 2024년 9월 1일
  return date < startDate;
};

export const parseKakaoTime = (
  line: string,
  currentDate: Date
): Date | null => {
  try {
    // Match Korean time format: "오전/오후 H:MM"
    const match = line.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
    if (!match) return null;

    const [_, period, hour, minute] = match;
    let hours = parseInt(hour);

    // Convert to 24-hour format
    if (period === '오후' && hours !== 12) {
      hours += 12;
    } else if (period === '오전' && hours === 12) {
      hours = 0;
    }

    const date = new Date(currentDate);
    date.setHours(hours, parseInt(minute), 0, 0);

    // Validate the time
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

export const isValidDateRange = (date: Date): boolean => {
  const startDate = new Date(2024, 10, 1); // 2024년 9월 1일
  const endDate = new Date(2024, 12, 31); // 2024년 12월 31일

  return isWithinInterval(date, { start: startDate, end: endDate });
};
