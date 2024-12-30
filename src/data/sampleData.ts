import { ChatMessage } from '../types';

export const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'link',
    content:
      '지식정원 WON 사용 방법법 https://20231.notion.site/WON-1457651dac93806cb94eea75ea618122?pvs=4',
    createdAt: new Date('2024-12-01T09:15:00'),
    tags: ['콘텐츠툴', '테크', '서비스', '스타트업업'],
    title: 'AI-powered contents management / 지식정원 WON 사용 방법',
    url: 'https://20231.notion.site/WON-1457651dac93806cb94eea75ea618122?pvs=4',
    source: 'notion',
    thumbnail:
      'https://images.unsplash.com/photo-1598285721150-ba05782126c3?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=2400',
    description:
      '안녕하세요. “지식 콘텐츠를 가치있게 만드는 지식정원 WON” 입니다.',
  },
  {
    id: '2',
    type: 'link',
    content:
      '이 기사 정말 흥미롭네요 https://www.linkedin.com/posts/yrebryk_planning-a-startup-my-top-10-must-watch-activity-7231948777215938561-bDHi/',
    createdAt: new Date('2024-11-15T10:00:00'),
    url: 'https://www.linkedin.com/posts/yrebryk_planning-a-startup-my-top-10-must-watch-activity-7231948777215938561-bDHi/',
    source: 'LinkedIn',
    thumbnail:
      'https://media.licdn.com/dms/image/v2/D4D22AQG2wbOrTDylbQ/feedshare-shrink_800/feedshare-shrink_800/0/1724230949266?e=2147483647&v=beta&t=9sxSLVrhWz42-qP19OBm5XoRcYQgbsA0WZgK17ntFfs',
    tags: ['뉴스', '테크'],
    title:
      'Planning a startup? My top 10 must-watch videos for early stage founders',
    description:
      'These videos helped me a lot with building Fluently, getting into Y Combinator and… | 30 comments on LinkedIn 🚀',
  },
  {
    id: '3',
    type: 'link',
    content:
      '엔비디아 CEO! https://www.youtube.com/shorts/tRy1kIEAD0E?feature=share',
    createdAt: new Date('2024-11-20T15:30:00'),
    url: 'https://www.youtube.com/shorts/tRy1kIEAD0E?feature=share',
    source: 'Youtube',
    thumbnail:
      'https://yt3.ggpht.com/wLC8dRXmM2hQmzASYlTXjBQkf7dUqZy-Kkc66_iInWwyvfQkoICRDlPfpqKQGhGFKoMtd-MSW4k=s48-c-k-c0x00ffffff-no-rj',
    tags: ['동기부여', '스타트업'],
    title: 'Inside Jensen Huang Mindset',
    description: 'Working nonstop to imagine the future',
  },
];
