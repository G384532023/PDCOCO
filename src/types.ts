export interface Rule {
  id: string;
  title: string;
  category: string;
  content: string;
  editor: string;
  lastUpdated: string;
  tags?: string[];
  fine?: {
    withItems?: number;
    withoutItems?: number;
  };
  detentionTime?: number;
  wantedTime?: number;
  criminalCount?: number;
  pdCount?: number;
  details1?: string;
  details2?: string;
  details1Size?: string;
  details2Size?: string;
}

export const CATEGORIES = {
  ROBBERY: '強盗系',
  DRUGS: '麻薬系',
  MINOR: '軽犯罪系',
  MURDER: '殺人系',
  BASIC: '基本規則',
  BUSINESS: '業務規則'
} as const;

export const CATEGORY_COLORS = {
  [CATEGORIES.ROBBERY]: 'bg-red-100 text-red-800',
  [CATEGORIES.DRUGS]: 'bg-blue-100 text-blue-800',
  [CATEGORIES.MINOR]: 'bg-yellow-100 text-yellow-800',
  [CATEGORIES.MURDER]: 'bg-green-100 text-green-800',
  [CATEGORIES.BASIC]: 'bg-orange-100 text-orange-800',
  [CATEGORIES.BUSINESS]: 'bg-pink-100 text-pink-800'
} as const;