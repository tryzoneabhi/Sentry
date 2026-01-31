
import { Teacher } from './types';

export const TEACHERS: Teacher[] = [
  {
    id: 'shobhit',
    name: 'Maths By Shobhit Nirwan',
    channelId: 'UC14XvS97_L6qS-O9z5c1m7Q',
    subject: 'Mathematics',
    color: 'bg-blue-500'
  },
  {
    id: 'exphub',
    name: 'EXPHUB 9th & 10th',
    channelId: 'UC_u62-2G6q7B-4mE_sN_8mA',
    subject: 'Science & Core',
    color: 'bg-emerald-500'
  },
  {
    id: 'nexttoppers',
    name: 'Next Toppers',
    channelId: 'UCtJ9I6p1xS7t9f-o_xK3q2A',
    subject: 'All Subjects',
    color: 'bg-indigo-500'
  },
  {
    id: 'digraj',
    name: 'Digraj Singh Rajput',
    channelId: 'UC-O3A8Hj-fK0x4l_l-x4Tvw',
    subject: 'Social Science',
    color: 'bg-amber-500'
  }
];

export const SUBJECT_TOPICS: Record<string, string[]> = {
  'Mathematics': [
    'Real Numbers', 'Polynomials', 'Quadratic Equations', 'Arithmetic Progression', 
    'Triangles', 'Trigonometry', 'Circles', 'Surface Areas', 'Statistics', 'Probability'
  ],
  'Science & Core': [
    'Chemical Reactions', 'Acids Bases Salts', 'Metals Non-metals', 'Carbon Compounds', 
    'Life Processes', 'Control Coordination', 'Reproduction', 'Heredity', 'Light', 'Electricity', 'Magnetic Effects'
  ],
  'Social Science': [
    'Nationalism in Europe', 'Nationalism in India', 'Resources Development', 'Agriculture', 
    'Manufacturing Industries', 'Power Sharing', 'Federalism', 'Political Parties', 'Outcomes of Democracy'
  ],
  'English': [
    'Tenses', 'Modals', 'Letter Writing', 'Analytical Paragraph', 'Literature Revision', 'Grammar One Shot'
  ],
  'All Subjects': [
    'One Shot Revision', 'Blueprint 2025', 'Previous Year Questions', 'Top 100 Questions', 'Exam Strategy', 'Paper Presentation'
  ]
};

export const MOCK_VIDEOS = [
  {
    id: 'v1',
    title: 'Complete Mathematics Revision Class 10 Boards 2024-25',
    description: 'One shot revision for all chapters including arithmetic progression, trigonometry, and more.',
    thumbnail: 'https://picsum.photos/seed/math1/640/360',
    publishedAt: '2024-10-15T10:00:00Z',
    channelTitle: 'Maths By Shobhit Nirwan',
    duration: '02:45:10'
  },
  {
    id: 'v2',
    title: 'Most Important PYQs of Science | Physics & Chemistry',
    description: 'Previous year questions that are most likely to repeat in the upcoming board exams.',
    thumbnail: 'https://picsum.photos/seed/sci1/640/360',
    publishedAt: '2024-10-12T08:30:00Z',
    channelTitle: 'EXPHUB 9th & 10th',
    duration: '01:15:20'
  },
  {
    id: 'v3',
    title: 'Full Social Science Blueprint | Strategy for 100/100',
    description: 'Detailed strategy on how to approach history, geography, and civics.',
    thumbnail: 'https://picsum.photos/seed/ss1/640/360',
    publishedAt: '2024-10-10T14:20:00Z',
    channelTitle: 'Digraj Singh Rajput',
    duration: '45:30'
  }
];
