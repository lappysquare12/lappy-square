import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Lappy Square database seed...');

  // 1. Website Settings
  await prisma.websiteSetting.upsert({
    where: { id: 'default-setting' },
    update: {},
    create: {
      id: 'default-setting',
      siteName: 'Lappy Square',
      tagline: 'Certified Pre-Owned & Refurbished Laptops',
      brandAccent: '#0F172A',
      supportEmail: 'lappysquare12@gmail.com',
      supportPhone: '+91 93769 88788',
      supportAddress: 'Peris, Near, Vijay Path, Ward 27, Chauraha, Mansarover, Jaipur, Rajasthan 302020',
      announcementText: '⚡ Certified Refurbished Laptops with 45-Point Lab Quality Check • Up to 1-Year Warranty • Free Insured Pan-India Delivery',
      announcementActive: true,
      freeShippingThreshold: 0,
      defaultShippingCost: 0,
      taxPercentage: 18,
      returnWindowDays: 7,
      warrantyText: '1-Year Comprehensive Lappy Square Assured Warranty with nationwide doorstep pickup or 200+ partner service centers.',
      metaTitle: 'Lappy Square — Certified Refurbished & Second-Hand Laptops in India',
      metaDescription: 'Shop certified second-hand, open-box and refurbished laptops from Apple, Dell, HP, Lenovo & ASUS at Lappy Square. 45-point quality check, 1-year warranty, tested battery health.',
    },
  });

  // 2. WhatsApp Settings
  await prisma.whatsAppSetting.upsert({
    where: { id: 'default-whatsapp' },
    update: {},
    create: {
      id: 'default-whatsapp',
      enabled: true,
      businessNumber: '+919376988788',
      recipientNumber: '+919376988788',
      businessAccountId: 'WABA_LAPPY_SQUARE_01',
      phoneNumberId: 'PHONE_ID_9376988788',
      accessToken: 'MOCK_TOKEN_EAAK83724817264871264',
      notifyOnOrder: true,
      notifyOnPayment: true,
      notifyOnShipment: true,
      notifyOnDelivery: true,
      notifyOnCancel: true,
      templateOrderPlaced: 'order_notification_lappy_square',
      templatePaymentVerified: 'payment_verified_lappy_square',
    },
  });

  // 3. Admin & Demo Users
  const adminPassword = await bcrypt.hash('Admin@12345', 10);
  const managerPassword = await bcrypt.hash('Editor@12345', 10);
  const customerPassword = await bcrypt.hash('Customer@12345', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@lappysquare.com' },
    update: {},
    create: {
      email: 'admin@lappysquare.com',
      passwordHash: adminPassword,
      name: 'Lappy Square Administrator',
      phone: '+91 93769 88788',
      role: 'SUPER_ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'editor@lappysquare.com' },
    update: {},
    create: {
      email: 'editor@lappysquare.com',
      passwordHash: managerPassword,
      name: 'Content Manager',
      phone: '+91 98112 34568',
      role: 'CONTENT_MANAGER',
    },
  });

  const demoCustomer = await prisma.user.upsert({
    where: { email: 'rahul.sharma@example.com' },
    update: {},
    create: {
      email: 'rahul.sharma@example.com',
      passwordHash: customerPassword,
      name: 'Rahul Sharma',
      phone: '+91 98765 43210',
      role: 'CUSTOMER',
    },
  });

  await prisma.address.create({
    data: {
      userId: demoCustomer.id,
      fullName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Sunshine Heights, Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      postalCode: '201309',
      country: 'India',
      isDefault: true,
    },
  });

  // 4. Brands
  const brandsData = [
    { name: 'Apple', slug: 'apple', description: 'MacBook Pro, MacBook Air with Apple Silicon and Retina Displays' },
    { name: 'Dell', slug: 'dell', description: 'Latitude enterprise workhorses, XPS precision ultrabooks and Inspiron' },
    { name: 'HP', slug: 'hp', description: 'EliteBook military-spec durability, ProBook value and Pavilion' },
    { name: 'Lenovo', slug: 'lenovo', description: 'Legendary ThinkPad keyboards, ThinkBook productivity and IdeaPad' },
    { name: 'ASUS', slug: 'asus', description: 'ZenBook thin & light, ROG gaming machines and VivoBook' },
    { name: 'Acer', slug: 'acer', description: 'Swift ultrabooks, Aspire all-rounders and Predator performance' },
  ];

  const brandMap = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        name: b.name,
        slug: b.slug,
        description: b.description,
        featured: true,
        active: true,
      },
    });
    brandMap[b.slug] = brand.id;
  }

  // 5. Categories
  const categoriesData = [
    { name: 'Business & Office', slug: 'business-laptops', description: 'Rugged enterprise machines designed for long battery life and reliability' },
    { name: 'Programming & Tech', slug: 'programming-laptops', description: 'High RAM & multi-core processors for compiling, containers, and IDEs' },
    { name: 'Student & Everyday', slug: 'student-laptops', description: 'Budget-friendly, portable and dependable laptops for study and projects' },
    { name: 'Creators & Editing', slug: 'creator-laptops', description: 'High color-accuracy displays, dedicated GPUs and fast NVMe storage' },
    { name: 'Gaming Laptops', slug: 'gaming-laptops', description: 'High refresh-rate screens with dedicated NVIDIA graphics' },
  ];

  const categoryMap = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        active: true,
      },
    });
    categoryMap[c.slug] = cat.id;
  }

  // 6. Real Refurbished Laptop Catalogue
  const products = [
    {
      title: 'Apple MacBook Pro 16" (A2141) — Intel Core i9 / 32GB RAM / 1TB NVMe SSD',
      slug: 'apple-macbook-pro-16-a2141-i9-32gb-1tb',
      sku: 'LS-APL-MBP16-01',
      brandId: brandMap['apple'],
      categoryId: categoryMap['creator-laptops'],
      conditionGrade: 'LIKE_NEW',
      price: 54999,
      originalPrice: 239900,
      stock: 4,
      featured: true,
      bestSeller: true,
      isNewArrival: false,
      isDealOfTheDay: true,
      rating: 4.9,
      reviewCount: 38,
      processor: 'Intel Core i9',
      processorModel: '9880H 8-Core (Up to 4.8GHz)',
      processorGen: '9th Gen',
      ramGb: 32,
      ramType: 'DDR4',
      storageGb: 1024,
      storageType: 'Apple NVMe SSD',
      screenSize: '16.0 Inch Retina Display (3072 x 1920, True Tone)',
      displayResolution: '3072 x 1920',
      graphicsCard: 'AMD Radeon Pro 5500M 4GB + Intel UHD 630',
      graphicsType: 'Dedicated',
      os: 'macOS Sonoma',
      batteryHealth: '92% Certified Health (Under 180 Cycle Count)',
      batteryBackupHours: '7-9 Hours',
      warrantyMonths: 12,
      useCase: 'Video Editing, Coding, Music Production, Heavy Multitasking',
      description: 'Stunning 16-inch Retina MacBook Pro with flagship 8-core Core i9 processing, 32GB memory and 4GB dedicated Radeon GPU. Inspected through Lappy Square 45-point testing with pristine keyboard and studio-quality 6-speaker sound system.',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      title: 'Apple MacBook Air 13" (A2337) — Apple M1 Chip / 16GB Unified RAM / 256GB SSD',
      slug: 'apple-macbook-air-13-a2337-m1-16gb-256gb',
      sku: 'LS-APL-MBA13-02',
      brandId: brandMap['apple'],
      categoryId: categoryMap['student-laptops'],
      conditionGrade: 'LIKE_NEW',
      price: 49999,
      originalPrice: 119900,
      stock: 6,
      featured: true,
      bestSeller: true,
      isNewArrival: true,
      isDealOfTheDay: false,
      rating: 4.95,
      reviewCount: 54,
      processor: 'Apple M1',
      processorModel: '8-Core CPU with 4 performance cores & 4 efficiency cores',
      processorGen: 'Apple Silicon',
      ramGb: 16,
      ramType: 'Unified Memory',
      storageGb: 256,
      storageType: 'Fast PCIe SSD',
      screenSize: '13.3 Inch Retina Display (2560 x 1600)',
      displayResolution: '2560 x 1600',
      graphicsCard: 'Apple 7-Core GPU',
      graphicsType: 'Integrated',
      os: 'macOS Sequoia',
      batteryHealth: '94% Certified OEM Health (Under 120 Cycles)',
      batteryBackupHours: '12-15 Hours',
      warrantyMonths: 12,
      useCase: 'Students, College, Travel, Web Development, Office',
      description: 'The ultra-quiet silent fanless MacBook Air with upgraded 16GB memory. All-day battery endurance, flawless glass trackpad, Magic Keyboard with Touch ID, and crystal-clear Retina display.',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      title: 'Dell Latitude 7420 (2-in-1 Touch 360°) — Intel Core i7 11th Gen / 16GB RAM / 512GB NVMe SSD',
      slug: 'dell-latitude-7420-2in1-touch-i7-11th-16gb-512gb',
      sku: 'LS-DEL-LAT7420-03',
      brandId: brandMap['dell'],
      categoryId: categoryMap['business-laptops'],
      conditionGrade: 'LIKE_NEW',
      price: 29999,
      originalPrice: 145000,
      stock: 8,
      featured: true,
      bestSeller: true,
      isNewArrival: false,
      isDealOfTheDay: true,
      rating: 4.85,
      reviewCount: 42,
      processor: 'Intel Core i7',
      processorModel: 'Core i7-1185G7 vPro (Up to 4.8GHz)',
      processorGen: '11th Gen',
      ramGb: 16,
      ramType: 'LPDDR4x 4267MHz',
      storageGb: 512,
      storageType: 'M.2 NVMe Class 40 SSD',
      screenSize: '14.0 Inch FHD Touchscreen (1920 x 1080) 360-degree Yoga Hinge',
      displayResolution: '1920 x 1080',
      graphicsCard: 'Intel Iris Xe Graphics',
      graphicsType: 'Integrated',
      os: 'Windows 11 Pro Genuine',
      batteryHealth: '89% Certified Health (ExpressCharge)',
      batteryBackupHours: '6-8 Hours',
      warrantyMonths: 12,
      useCase: 'Corporate Executives, Business Presentations, Doctors, Consultants',
      description: 'Carbon fiber chassis with 360-degree convertible hinge. Flawless touch response, IR facial recognition webcam with privacy shutter, Thunderbolt 4 ports, and backlit keyboard.',
      images: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      title: 'Dell Latitude 5420 — Intel Core i5 11th Gen / 16GB RAM / 512GB SSD',
      slug: 'dell-latitude-5420-i5-11th-16gb-512gb',
      sku: 'LS-DEL-LAT5420-04',
      brandId: brandMap['dell'],
      categoryId: categoryMap['business-laptops'],
      conditionGrade: 'EXCELLENT',
      price: 23999,
      originalPrice: 89000,
      stock: 12,
      featured: false,
      bestSeller: true,
      isNewArrival: false,
      isDealOfTheDay: false,
      rating: 4.8,
      reviewCount: 61,
      processor: 'Intel Core i5',
      processorModel: 'Core i5-1145G7 vPro (Quad-Core 4.4GHz)',
      processorGen: '11th Gen',
      ramGb: 16,
      ramType: 'DDR4 3200MHz (Dual Channel)',
      storageGb: 512,
      storageType: 'High Speed NVMe SSD',
      screenSize: '14.0 Inch Anti-Glare FHD (1920 x 1080)',
      displayResolution: '1920 x 1080',
      graphicsCard: 'Intel Iris Xe Graphics',
      graphicsType: 'Integrated',
      os: 'Windows 11 Pro Genuine',
      batteryHealth: '91% Tested Health',
      batteryBackupHours: '5-7 Hours',
      warrantyMonths: 12,
      useCase: 'Office Work, Tally, Billing, Zoom, College Coding',
      description: 'The definitive office laptop. Military-tested durable chassis, dual-channel high-speed RAM, RJ45 Gigabit Ethernet, HDMI 2.0, USB-C Thunderbolt 4, and whisper-quiet cooling.',
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      title: 'HP EliteBook 840 G8 — Intel Core i5 11th Gen / 16GB RAM / 256GB NVMe SSD',
      slug: 'hp-elitebook-840-g8-i5-11th-16gb-256gb',
      sku: 'LS-HP-ELITE840G8-05',
      brandId: brandMap['hp'],
      categoryId: categoryMap['business-laptops'],
      conditionGrade: 'LIKE_NEW',
      price: 24999,
      originalPrice: 98000,
      stock: 9,
      featured: true,
      bestSeller: false,
      isNewArrival: true,
      isDealOfTheDay: false,
      rating: 4.82,
      reviewCount: 29,
      processor: 'Intel Core i5',
      processorModel: 'Core i5-1135G7 (Up to 4.2GHz)',
      processorGen: '11th Gen',
      ramGb: 16,
      ramType: 'DDR4 3200MHz',
      storageGb: 256,
      storageType: 'M.2 PCIe NVMe SSD',
      screenSize: '14.0 Inch IPS FHD Anti-Glare 400 nits',
      displayResolution: '1920 x 1080',
      graphicsCard: 'Intel Iris Xe Graphics',
      graphicsType: 'Integrated',
      os: 'Windows 11 Pro Genuine',
      batteryHealth: '90% Tested Health',
      batteryBackupHours: '6-8 Hours',
      warrantyMonths: 12,
      useCase: 'Work from Home, Corporate, Accounting, Students',
      description: 'All-aluminum sleek silver body with Bang & Olufsen tuned audio. Ultra-bright 400-nits anti-glare display for working outdoors and near bright windows. Spill-resistant backlit keyboard.',
      images: [
        'https://images.unsplash.com/photo-1544731612-de292439cc67?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      title: 'Lenovo ThinkPad T14 Gen 2 — AMD Ryzen 5 PRO / 16GB RAM / 512GB SSD',
      slug: 'lenovo-thinkpad-t14-gen2-ryzen5-16gb-512gb',
      sku: 'LS-LEN-TPT14G2-06',
      brandId: brandMap['lenovo'],
      categoryId: categoryMap['programming-laptops'],
      conditionGrade: 'LIKE_NEW',
      price: 27999,
      originalPrice: 112000,
      stock: 7,
      featured: true,
      bestSeller: true,
      isNewArrival: true,
      isDealOfTheDay: false,
      rating: 4.9,
      reviewCount: 37,
      processor: 'AMD Ryzen 5 PRO',
      processorModel: 'Ryzen 5 PRO 5650U (6-Core, 12-Threads up to 4.2GHz)',
      processorGen: 'Ryzen 5000 Series',
      ramGb: 16,
      ramType: 'DDR4 3200MHz',
      storageGb: 512,
      storageType: 'OPAL 2.0 PCIe Gen4 SSD',
      screenSize: '14.0 Inch FHD IPS Low Power (1920 x 1080)',
      displayResolution: '1920 x 1080',
      graphicsCard: 'AMD Radeon RX Vega 7 Graphics',
      graphicsType: 'Integrated',
      os: 'Windows 11 Pro Genuine (Linux Certified)',
      batteryHealth: '93% Certified Health',
      batteryBackupHours: '7-9 Hours',
      warrantyMonths: 12,
      useCase: 'Software Engineers, DevOps, Docker, Python, Full Stack Dev',
      description: 'The programmers favorite: 6-core 12-thread AMD beast paired with the world-famous ThinkPad tactile keyboard and TrackPoint. Military-spec MIL-STD 810H durability.',
      images: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      title: 'Lenovo ThinkPad X1 Carbon Gen 8 — Intel Core i7 10th Gen / 16GB RAM / 512GB SSD',
      slug: 'lenovo-thinkpad-x1-carbon-gen8-i7-16gb-512gb',
      sku: 'LS-LEN-X1CG8-07',
      brandId: brandMap['lenovo'],
      categoryId: categoryMap['business-laptops'],
      conditionGrade: 'LIKE_NEW',
      price: 34999,
      originalPrice: 178000,
      stock: 5,
      featured: true,
      bestSeller: false,
      isNewArrival: false,
      isDealOfTheDay: true,
      rating: 4.92,
      reviewCount: 24,
      processor: 'Intel Core i7',
      processorModel: 'Core i7-10610U vPro (Hexa-Core up to 4.9GHz)',
      processorGen: '10th Gen',
      ramGb: 16,
      ramType: 'LPDDR3 2133MHz',
      storageGb: 512,
      storageType: 'M.2 NVMe SSD',
      screenSize: '14.0 Inch FHD IPS 400 nits PrivacyGuard Display',
      displayResolution: '1920 x 1080',
      graphicsCard: 'Intel UHD Graphics 620',
      graphicsType: 'Integrated',
      os: 'Windows 11 Pro Genuine',
      batteryHealth: '90% Certified OEM Health',
      batteryBackupHours: '8-10 Hours',
      warrantyMonths: 12,
      useCase: 'C-Suite, Founders, Frequent Flyers, Consulting',
      description: 'Weighing only 1.09 kg, the X1 Carbon combines aerospace-grade carbon fiber and magnesium alloy with an unmatched typing experience and Dolby Atmos speaker system.',
      images: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      title: 'ASUS ROG Strix G15 — AMD Ryzen 7 4800H / 16GB RAM / 512GB SSD / GTX 1650 Ti 4GB',
      slug: 'asus-rog-strix-g15-ryzen7-16gb-512gb-gtx1650ti',
      sku: 'LS-ASU-ROGG15-08',
      brandId: brandMap['asus'],
      categoryId: categoryMap['gaming-laptops'],
      conditionGrade: 'EXCELLENT',
      price: 38999,
      originalPrice: 86990,
      stock: 4,
      featured: true,
      bestSeller: false,
      isNewArrival: true,
      isDealOfTheDay: false,
      rating: 4.78,
      reviewCount: 19,
      processor: 'AMD Ryzen 7',
      processorModel: 'Ryzen 7 4800H (8-Core 16-Thread up to 4.2GHz)',
      processorGen: 'Ryzen 4000 H-Series',
      ramGb: 16,
      ramType: 'DDR4 3200MHz Dual Channel',
      storageGb: 512,
      storageType: 'M.2 NVMe PCIe SSD',
      screenSize: '15.6 Inch 144Hz FHD IPS (1920 x 1080) Slim Bezel',
      displayResolution: '1920 x 1080',
      graphicsCard: 'NVIDIA GeForce GTX 1650 Ti 4GB GDDR6',
      graphicsType: 'Dedicated',
      os: 'Windows 11 Home',
      batteryHealth: '87% Tested Health',
      batteryBackupHours: '4-5 Hours',
      warrantyMonths: 12,
      useCase: 'Gaming (GTA V, Valorant, CS2), 3D Blender, Video Rendering',
      description: '8-core workstation power with 144Hz fluid gaming panel. Aura Sync RGB 4-zone keyboard, dual liquid-crystal polymer fans, and dedicated NVIDIA graphics.',
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      title: 'Acer Swift 3 — Intel Core i5 11th Gen / 8GB RAM / 512GB SSD / Ultra-Slim Aluminum',
      slug: 'acer-swift-3-i5-11th-8gb-512gb-silver',
      sku: 'LS-ACR-SWIFT3-09',
      brandId: brandMap['acer'],
      categoryId: categoryMap['student-laptops'],
      conditionGrade: 'EXCELLENT',
      price: 18999,
      originalPrice: 62999,
      stock: 10,
      featured: false,
      bestSeller: true,
      isNewArrival: false,
      isDealOfTheDay: false,
      rating: 4.7,
      reviewCount: 45,
      processor: 'Intel Core i5',
      processorModel: 'Core i5-1135G7 (4-Core 4.2GHz)',
      processorGen: '11th Gen',
      ramGb: 8,
      ramType: 'LPDDR4x',
      storageGb: 512,
      storageType: 'PCIe NVMe SSD',
      screenSize: '14.0 Inch Full HD IPS (1920 x 1080)',
      displayResolution: '1920 x 1080',
      graphicsCard: 'Intel Iris Xe Graphics',
      graphicsType: 'Integrated',
      os: 'Windows 11 Home Genuine',
      batteryHealth: '88% Tested Health',
      batteryBackupHours: '7-8 Hours',
      warrantyMonths: 12,
      useCase: 'Students, Online Classes, Remote Exams, Netflix, Browsing',
      description: 'Super value under ₹20,000! Lightweight aluminum-magnesium alloy body (1.2 kg), fingerprint reader, fast USB-C charging, and crystal-clear Full HD IPS panel.',
      images: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1544731612-de292439cc67?auto=format&fit=crop&w=1000&q=80',
      ],
    },
    {
      title: 'Dell Latitude 3400 — Intel Core i3 8th Gen / 8GB RAM / 256GB SSD',
      slug: 'dell-latitude-3400-i3-8th-8gb-256gb',
      sku: 'LS-DEL-LAT3400-10',
      brandId: brandMap['dell'],
      categoryId: categoryMap['student-laptops'],
      conditionGrade: 'GOOD',
      price: 13999,
      originalPrice: 42000,
      stock: 15,
      featured: false,
      bestSeller: true,
      isNewArrival: false,
      isDealOfTheDay: false,
      rating: 4.65,
      reviewCount: 52,
      processor: 'Intel Core i3',
      processorModel: 'Core i3-8145U (2.1GHz up to 3.9GHz)',
      processorGen: '8th Gen',
      ramGb: 8,
      ramType: 'DDR4',
      storageGb: 256,
      storageType: 'Fast SATA III / NVMe SSD',
      screenSize: '14.0 Inch HD Anti-Glare (1366 x 768)',
      displayResolution: '1366 x 768',
      graphicsCard: 'Intel UHD Graphics 620',
      graphicsType: 'Integrated',
      os: 'Windows 10 / 11 Compatible',
      batteryHealth: '85% Tested Health',
      batteryBackupHours: '4-5 Hours',
      warrantyMonths: 6,
      useCase: 'Budget Entry-Level, School Homework, Accounting, Basic Typing',
      description: 'The ultimate under-₹15,000 budget workhorse. Upgraded to fast SSD storage for instant booting in under 10 seconds. Robust Dell commercial build with full port selection.',
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
      ],
    },
  ];

  for (const prod of products) {
    const { images, ...prodData } = prod;
    const createdProduct = await prisma.product.upsert({
      where: { slug: prodData.slug },
      update: {},
      create: {
        ...prodData,
        images: {
          create: images.map((url, idx) => ({
            url,
            alt: `${prodData.title} view ${idx + 1}`,
            isPrimary: idx === 0,
            displayOrder: idx,
          })),
        },
        inventoryUnits: {
          create: [
            {
              serialNumber: `SN-${prodData.sku}-001`,
              conditionNotes: '45-Point Lab Verified. Battery tested at full cycle.',
              status: 'AVAILABLE',
            },
            {
              serialNumber: `SN-${prodData.sku}-002`,
              conditionNotes: 'Minor cosmetic hairline mark on base. Display 100% pristine.',
              status: 'AVAILABLE',
            },
          ],
        },
      },
    });

    // Add 2 authentic reviews per product
    await prisma.review.createMany({
      data: [
        {
          productId: createdProduct.id,
          userName: 'Vikram Sengupta',
          userEmail: 'vikram.s@gmail.com',
          rating: 5,
          title: 'Condition is truly like new! Battery backup is fantastic.',
          comment: `Received my ${createdProduct.title} within 48 hours in Delhi. The packaging was top-notch with bubble wrap and the original charger. Ran full diagnostic tests and battery health matches the listed specs. Very trustworthy service.`,
          isVerifiedPurchase: true,
          isApproved: true,
        },
        {
          productId: createdProduct.id,
          userName: 'Ananya Deshmukh',
          userEmail: 'ananya.d@yahoo.com',
          rating: 5,
          title: 'Best price in the market. Highly recommended for students & pros.',
          comment: 'Saved over 60% compared to brand new retail price. Boot time is super fast and 1-year warranty gives complete peace of mind. Thank you Lappy Square team!',
          isVerifiedPurchase: true,
          isApproved: true,
        },
      ],
    });

    // Add product specific FAQs
    await prisma.productFAQ.createMany({
      data: [
        {
          productId: createdProduct.id,
          question: `What comes inside the box with this ${prod.title.split('—')[0]}?`,
          answer: 'You receive the certified laptop, original OEM charger & power cord, Lappy Square premium padded laptop sleeve, warranty card, and our 45-point inspection certificate.',
          category: 'IN_THE_BOX',
        },
        {
          productId: createdProduct.id,
          question: 'Can I upgrade RAM or SSD storage later?',
          answer: 'Yes! Our customer support team can also customize RAM or SSD upgrades before dispatch, or you can upgrade easily via certified service centers without voiding your warranty.',
          category: 'HARDWARE',
        },
      ],
    });
  }

  // 7. General FAQs
  await prisma.productFAQ.createMany({
    data: [
      {
        question: 'What is the Lappy Square 45-Point Quality Inspection?',
        answer: 'Every pre-owned laptop undergoes rigorous hardware and software testing by certified hardware engineers. We test the motherboard, display dead pixels, battery degradation, thermal throttling, keyboard keys, trackpad gestures, Wi-Fi/Bluetooth, webcam, microphones, and all I/O ports before issuing a certification grade.',
        category: 'QUALITY',
        displayOrder: 1,
      },
      {
        question: 'What warranty is provided with Lappy Square refurbished laptops?',
        answer: 'We provide up to 1-Year Comprehensive Warranty covering motherboard, processor, display, keyboard, and charging circuits. In case of any technical issue, we arrange free doorstep pickup and repair across 19,000+ Indian PIN codes.',
        category: 'WARRANTY',
        displayOrder: 2,
      },
      {
        question: 'Can I return or exchange the laptop if I am not satisfied?',
        answer: 'Yes! We offer a 7-Day Replacement / Return Guarantee. If you notice any technical defect or mismatch from the described cosmetic condition, contact our support team within 7 days for an immediate replacement or full refund.',
        category: 'RETURNS',
        displayOrder: 3,
      },
      {
        question: 'Do you offer Cash on Delivery (COD) and Online Payments?',
        answer: 'Yes, we accept 100% secure online payments via Razorpay (UPI, Credit/Debit cards, Net Banking, EMI) and Cash on Delivery across supported PIN codes with a nominal verification deposit.',
        category: 'PAYMENTS',
        displayOrder: 4,
      },
      {
        question: 'How fast is delivery to my city?',
        answer: 'Orders in Delhi NCR are delivered within 24 to 48 hours. Metro cities (Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune) typically take 2-3 business days. All shipments are fully insured against transit damage.',
        category: 'SHIPPING',
        displayOrder: 5,
      },
    ],
  });

  // 8. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: '10% instant discount for new customers up to ₹2,500',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 15000,
        maxDiscount: 2500,
        validUntil: new Date(Date.now() + 365 * 24 * 3600 * 1000),
        active: true,
      },
      {
        code: 'LAPPY2000',
        description: 'Flat ₹2,000 OFF on orders above ₹30,000',
        discountType: 'FIXED',
        discountValue: 2000,
        minOrderValue: 30000,
        validUntil: new Date(Date.now() + 365 * 24 * 3600 * 1000),
        active: true,
      },
      {
        code: 'STUDENT5',
        description: 'Special 5% discount for students on all educational laptops',
        discountType: 'PERCENTAGE',
        discountValue: 5,
        minOrderValue: 12000,
        maxDiscount: 1500,
        validUntil: new Date(Date.now() + 365 * 24 * 3600 * 1000),
        active: true,
      },
    ],
  });

  // 9. Blog / Buying Guides
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'The Refurbished Laptop Checklist: 7 Things to Inspect Before Buying',
        slug: 'refurbished-laptop-checklist-india',
        excerpt: 'Buying a pre-owned laptop can save you 50% to 70%, but only if you check battery health, thermal paste, and display grade. Here is our lab guide.',
        content: `Refurbished laptops have become one of the smartest tech purchases for students, developers, and small businesses in India. In this comprehensive guide, our lead diagnostic engineer outlines the 7 non-negotiable checks to perform:

1. Battery Cycle Count & Health: Check wear level using BatteryInfoView or macOS System Report. Ensure health is above 80%.
2. Thermal Stress Testing: Run Cinebench or Prime95 for 10 minutes to verify fans and heatsinks.
3. Display Backlight & Dead Pixels: Run a full-screen white and black image test.
4. Keyboard & Key Travel: Test every function key and spacebar rebound.
5. All I/O Ports & Thunderbolt Charging.
6. Genuine Operating System License.
7. Written Warranty terms and GST Invoice.

At Lappy Square, all 7 checks (and 38 more) are performed before any laptop enters our catalogue!`,
        coverImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
        category: 'Buying Guide',
        published: true,
      },
      {
        title: 'MacBook Air M1 vs Dell Latitude 7420: Which is Better for Software Developers in 2025?',
        slug: 'macbook-m1-vs-dell-latitude-7420-coding',
        excerpt: 'Comparing Unix terminal friendliness, battery endurance, Docker container speeds, and keyboard ergonomics for programming.',
        content: `Both the MacBook Air M1 and Dell Latitude 7420 are among our top sellers for developers. Here is how they stack up side-by-side in real programming workloads:

- Battery Life: The MacBook Air M1 delivers an astonishing 12-14 hours on a single charge. The Dell Latitude 7420 averages 7-8 hours.
- Docker & Containers: Dell's Intel Core i7 with 16GB dual-channel RAM excels at x86 virtualization.
- Keyboard: Dell Latitude features deep 1.5mm travel keys, while MacBook features the crisp Magic Keyboard with Touch ID.
- Upgradability: Dell allows easy M.2 NVMe SSD upgrades, whereas MacBook storage is soldered.

Conclusion: If you prioritize macOS ecosystem and battery, choose the M1. If you need touchscreen flexibility, dual monitors and Windows/Linux dual boot, the Latitude 7420 is unbeatable.`,
        coverImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
        category: 'Comparison',
        published: true,
      },
      {
        title: 'Top 5 Refurbished Laptops Under ₹25,000 in India (2025 Edition)',
        slug: 'top-5-refurbished-laptops-under-25000',
        excerpt: 'Looking for a reliable laptop for college, Tally, coding, or office without breaking the bank? These are our top certified picks.',
        content: `In 2025, spending ₹25,000 on a brand-new laptop usually gets you a sluggish Celeron processor with flimsy plastic hinges. But in the certified refurbished market, ₹25,000 unlocks commercial military-grade machines:

1. Dell Latitude 5420 (Core i5 11th Gen, 16GB RAM)
2. HP EliteBook 840 G8 (Core i5 11th Gen, All-Aluminum)
3. Lenovo ThinkPad T490 / T14 (Legendary Ergonomics)
4. Acer Swift 3 (Thin & Light 1.2kg)
5. Dell Latitude 7400 Touch

All models include SSDs, Full HD IPS screens, and 1-Year Lappy Square warranty.`,
        coverImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
        category: 'Budget Guide',
        published: true,
      },
    ],
  });

  // 10. Sample Order to verify order workflow and WhatsApp notification log
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'LS-1001',
      userId: demoCustomer.id,
      guestName: 'Rahul Sharma',
      guestEmail: 'rahul.sharma@example.com',
      guestPhone: '+91 98765 43210',
      shippingAddress: 'Flat 402, Sunshine Heights, Sector 62, Noida, Uttar Pradesh, 201309',
      status: 'CONFIRMED',
      paymentStatus: 'VERIFIED_PAID',
      paymentMethod: 'RAZORPAY',
      razorpayOrderId: 'order_mock_ls_1001',
      razorpayPaymentId: 'pay_mock_ls_verified_123',
      subtotal: 29999,
      discountAmount: 2000,
      couponCode: 'LAPPY2000',
      shippingCharge: 0,
      totalAmount: 27999,
      customerNotes: 'Please deliver after 2 PM if possible.',
      items: {
        create: [
          {
            title: 'Dell Latitude 7420 (2-in-1 Touch 360°)',
            sku: 'LS-DEL-LAT7420-03',
            price: 29999,
            quantity: 1,
            brandName: 'Dell',
            conditionGrade: 'LIKE_NEW',
            specsSnapshot: 'Core i7 11th Gen, 16GB RAM, 512GB NVMe SSD, FHD Touch 360',
          },
        ],
      },
    },
  });

  // Create corresponding WhatsApp Log
  await prisma.whatsAppLog.create({
    data: {
      orderId: sampleOrder.id,
      recipient: '+919376988788',
      messageType: 'NEW_ORDER',
      status: 'SENT',
      providerMessageId: 'wamid.HBgMOTE5ODExMjM0NTY3FQIAERgSMDAxMTAwMTAx',
      payload: JSON.stringify({
        event: 'ORDER_PLACED',
        orderNumber: 'LS-1001',
        total: 27999,
        customer: 'Rahul Sharma',
      }),
    },
  });

  console.log('✅ Database seeded successfully with genuine Lappy Square products, brands, orders, and settings!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
