// import { parseKakaoDate, parseKakaoTime } from '../date';
// import { isValidDateRange } from '../date/validator';
// import type { ParseState } from './types';

// export function parseDateLine(line: string): Date | null {
//   const regexDateLine = /\d{4}[년.]\s?\d{1,2}[월.]\s?\d{1,2}[일.]/;
//   const dateMatch = line.match(regexDateLine);
//   if (!dateMatch) return null;

//   return parseKakaoDate(dateMatch[0]);
// }

// export function parseMessageLine(
//   line: string,
//   currentDate: Date
// ): {
//   sender: string;
//   timestamp: Date;
//   content: string;
// } | null {
//   const firstFormatRegex =
//     /^\[(.*?)\]\s+\[(오전|오후)\s*(\d{1,2}):(\d{2})\]\s+(.*)/;
//   const firstMatch = line.match(firstFormatRegex);

//   if (firstMatch) {
//     const [_, sender, period, hour, minute, content] = firstMatch;
//     const timestamp = parseKakaoTime(
//       `${period} ${hour}:${minute}`,
//       currentDate
//     );
//     if (!timestamp) return null;

//     return { sender, timestamp, content };
//   }

//   return null;
// }
