// types/company.ts — Company TypeScript Interface + Metadata

export interface Company {
  id: string;
  name: string;              // display name: 'Google India'
  slug: string;              // URL-safe: 'google'
  normalized_name: string;   // lowercase: 'google'
  industry: string | null;
  headquarters: string | null;
  founded_year: number | null;
  headcount_range: string | null;
  created_at: string;        // ISO 8601
  updated_at: string;        // ISO 8601
}

export interface CompanyWithStats extends Company {
  median_total_compensation: number;
  min_total_compensation: number;
  max_total_compensation: number;
  record_count: number;
  level_distribution: Record<string, number>;
}

/** Full company metadata for UI */
export interface CompanyInfo {
  name: string;
  industry: string;
  hq: string;
  founded: number;
  headcount: string;
  description: string;
  website: string;
  careersUrl: string;
  logoDomain: string;        // used for logo.clearbit.com
  valuation?: string;        // e.g. "$2T" or "₹8L Cr"
}

/** Lookup table: slug → display name + metadata for UI */
export const COMPANY_DISPLAY: Record<string, CompanyInfo> = {
  google: {
    name: 'Google',
    industry: 'Technology',
    hq: 'Mountain View, CA',
    founded: 1998,
    headcount: '180,000+',
    description: 'Google is a multinational technology company specializing in search, cloud computing, advertising, and AI. A subsidiary of Alphabet Inc., Google is one of the most valuable companies globally and a top employer for engineers worldwide.',
    website: 'https://google.com',
    careersUrl: 'https://careers.google.com',
    logoDomain: 'google.com',
    valuation: '$2.0T',
  },
  amazon: {
    name: 'Amazon',
    industry: 'E-Commerce / Cloud',
    hq: 'Seattle, WA',
    founded: 1994,
    headcount: '1,500,000+',
    description: 'Amazon is the world\'s largest e-commerce and cloud computing company. Through AWS, it powers a significant portion of the internet. Amazon is known for its competitive RSU-heavy compensation packages and bar-raiser interview process.',
    website: 'https://amazon.com',
    careersUrl: 'https://www.amazon.jobs',
    logoDomain: 'amazon.com',
    valuation: '$2.1T',
  },
  meta: {
    name: 'Meta',
    industry: 'Technology',
    hq: 'Menlo Park, CA',
    founded: 2004,
    headcount: '60,000+',
    description: 'Meta Platforms (formerly Facebook) builds technologies that help people connect. The company owns Facebook, Instagram, WhatsApp, and is investing heavily in AR/VR through Reality Labs. Known for some of the highest TC packages in tech.',
    website: 'https://meta.com',
    careersUrl: 'https://www.metacareers.com',
    logoDomain: 'meta.com',
    valuation: '$1.6T',
  },
  microsoft: {
    name: 'Microsoft',
    industry: 'Technology',
    hq: 'Redmond, WA',
    founded: 1975,
    headcount: '220,000+',
    description: 'Microsoft is a global leader in software, cloud computing (Azure), and AI. It produces Windows, Office 365, Azure, LinkedIn, and GitHub. Microsoft is the world\'s most valuable company and a top employer in India with major offices in Hyderabad and Bengaluru.',
    website: 'https://microsoft.com',
    careersUrl: 'https://careers.microsoft.com',
    logoDomain: 'microsoft.com',
    valuation: '$3.1T',
  },
  flipkart: {
    name: 'Flipkart',
    industry: 'E-Commerce',
    hq: 'Bengaluru, India',
    founded: 2007,
    headcount: '30,000+',
    description: 'Flipkart is India\'s largest e-commerce platform, founded by former Amazon employees Sachin and Binny Bansal. Acquired by Walmart in 2018 for $16B, Flipkart dominates Indian online retail and offers competitive engineering salaries with strong stock grants.',
    website: 'https://flipkart.com',
    careersUrl: 'https://www.flipkartcareers.com',
    logoDomain: 'flipkart.com',
    valuation: '$35B',
  },
  meesho: {
    name: 'Meesho',
    industry: 'E-Commerce',
    hq: 'Bengaluru, India',
    founded: 2015,
    headcount: '2,000+',
    description: 'Meesho is India\'s fastest-growing social commerce platform, enabling small businesses and individuals to sell products online. Backed by SoftBank, Meesho has disrupted tier-2 and tier-3 city commerce with zero-commission selling.',
    website: 'https://meesho.com',
    careersUrl: 'https://careers.meesho.com',
    logoDomain: 'meesho.com',
    valuation: '$5B',
  },
  nvidia: {
    name: 'NVIDIA',
    industry: 'Semiconductors',
    hq: 'Santa Clara, CA',
    founded: 1993,
    headcount: '30,000+',
    description: 'NVIDIA is the world\'s leading designer of GPUs and AI accelerators. Its chips power everything from gaming to data centers to autonomous vehicles. NVIDIA\'s market cap has surged past $3T, making it one of the most valuable companies ever, with extremely competitive compensation.',
    website: 'https://nvidia.com',
    careersUrl: 'https://www.nvidia.com/en-us/about-nvidia/careers/',
    logoDomain: 'nvidia.com',
    valuation: '$3.4T',
  },
  tcs: {
    name: 'Tata Consultancy Services',
    industry: 'IT Services',
    hq: 'Mumbai, India',
    founded: 1968,
    headcount: '600,000+',
    description: 'TCS is India\'s largest IT services company and a subsidiary of the Tata Group. It provides consulting, technology, and outsourcing services globally. TCS is the most valuable IT services company in the world by market cap.',
    website: 'https://tcs.com',
    careersUrl: 'https://www.tcs.com/careers',
    logoDomain: 'tcs.com',
    valuation: '$160B',
  },
  infosys: {
    name: 'Infosys',
    industry: 'IT Services',
    hq: 'Bengaluru, India',
    founded: 1981,
    headcount: '340,000+',
    description: 'Infosys is a global IT services and consulting powerhouse, co-founded by N. R. Narayana Murthy. It pioneered the Global Delivery Model and is known for its strong training programs (Infosys Mysore campus) and consistent hiring of fresh graduates.',
    website: 'https://infosys.com',
    careersUrl: 'https://www.infosys.com/careers/',
    logoDomain: 'infosys.com',
    valuation: '$75B',
  },
  wipro: {
    name: 'Wipro',
    industry: 'IT Services',
    hq: 'Bengaluru, India',
    founded: 1945,
    headcount: '250,000+',
    description: 'Wipro is one of India\'s big three IT services companies, originally founded as Western India Palm Refined Oils. Under Azim Premji\'s leadership, it transformed into a global IT powerhouse serving Fortune 500 clients across 66 countries.',
    website: 'https://wipro.com',
    careersUrl: 'https://careers.wipro.com',
    logoDomain: 'wipro.com',
    valuation: '$25B',
  },
  razorpay: {
    name: 'Razorpay',
    industry: 'Fintech',
    hq: 'Bengaluru, India',
    founded: 2014,
    headcount: '3,000+',
    description: 'Razorpay is India\'s leading payments platform, processing billions of dollars in transactions for businesses. Founded by IIT Roorkee alumni, it offers payment gateway, banking, lending, and payroll products. Known for competitive startup-tier compensation with generous ESOPs.',
    website: 'https://razorpay.com',
    careersUrl: 'https://razorpay.com/jobs/',
    logoDomain: 'razorpay.com',
    valuation: '$7.5B',
  },
  zepto: {
    name: 'Zepto',
    industry: 'Quick Commerce',
    hq: 'Mumbai, India',
    founded: 2021,
    headcount: '3,500+',
    description: 'Zepto is India\'s fastest quick-commerce startup, delivering groceries in 10 minutes. Founded by Stanford dropouts Aadit Palicha and Kaivalya Vohra at age 19, Zepto has raised over $1.3B and is one of the highest-valued Indian startups.',
    website: 'https://zepto.co',
    careersUrl: 'https://www.zepto.co/careers',
    logoDomain: 'zepto.co',
    valuation: '$5B',
  },
};

/** Get logo URL for a company using Google Favicons (more reliable than Clearbit) */
export function getCompanyLogoUrl(slug: string, size: number = 128): string {
  const info = COMPANY_DISPLAY[slug];
  if (info?.logoDomain) {
    return `https://www.google.com/s2/favicons?domain=${info.logoDomain}&sz=${size}`;
  }
  return '';
}
