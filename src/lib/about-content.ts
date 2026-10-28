export interface AboutContentData {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  founderName: string;
  founderRole: string;
  founderImage: string;
  founderQuote: string;
  founderBio1: string;
  founderBio2: string;
  stats: {
    label: string;
    value: string;
    desc: string;
  }[];
  storeAddress: string;
  storePhone: string;
  storeEmail: string;
}

export const DEFAULT_ABOUT_CONTENT: AboutContentData = {
  heroBadge: 'Our Heritage & Mission',
  heroTitle: 'Democratizing Flagship Laptops Through Certified Refurbishing',
  heroSubtitle:
    'Founded with a mission to make enterprise-grade computing accessible to every student, software engineer, creator, and growing business in India. At Lappy Square, we bridge the gap between premium computing and sensible budgets.',
  founderName: 'Pankaj Jain',
  founderRole: 'Founder & CEO',
  founderImage: '/images/pankaj-jain-founder.jpg',
  founderQuote:
    'Quality is not an accident; it is always the result of intelligent hardware diagnostics, certified engineering standards, and sincere customer care.',
  founderBio1:
    'With over a decade of hands-on expertise in the IT hardware lifecycle, Pankaj Jain established Lappy Square in Jaipur to solve a fundamental dilemma: Why should students, programmers, and small businesses settle for low-end plastic laptops when enterprise-grade ThinkPads, MacBooks, and Latitudes could be sustainably revitalized?',
  founderBio2:
    'Under his leadership, Lappy Square has evolved into Jaipur’s premier destination for certified pre-owned computing — transitioning the second-hand market into a laboratory-grade, transparent, and customer-first retail experience.',
  stats: [
    { label: 'Refurbished Laptops Delivered', value: '12,500+', desc: 'Across 19,000+ PIN codes in India' },
    { label: 'Hardware Diagnostic Checkpoints', value: '45 Points', desc: 'Tested by certified hardware engineers' },
    { label: 'Customer Satisfaction Score', value: '99.4%', desc: 'Verified 5-star Google & website ratings' },
    { label: 'E-Waste Prevented in Landfills', value: '18+ Tons', desc: 'Enterprise aluminum & silicon revived' },
  ],
  storeAddress: 'Paris Tower, Near Vijay Path, Ward 27, Chauraha, Mansarovar, Jaipur, Rajasthan 302020',
  storePhone: '+91 93769 88788',
  storeEmail: 'lappysquare@gmail.com',
};
