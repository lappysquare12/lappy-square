import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Populating dynamic database records for Lappy Square...');

  // 1. DYNAMIC HERO SLIDERS / BANNERS
  console.log('📸 Seeding Hero Banners Slider into database...');
  const banners = [
    {
      title: 'Certified Second-Hand & Open-Box MacBooks',
      subtitle: 'Apple MacBook Pro & MacBook Air with M-Series & Intel Chips. 45-Point Tested, OEM Battery, 1-Year Warranty.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=2000&q=85',
      linkUrl: '/collection/macbook',
      badgeText: 'Flat 35% to 50% OFF Today',
      ctaText: "Get Today's Best Price",
      sectionKey: 'HERO',
      active: true,
      displayOrder: 1,
    },
    {
      title: 'Top Brand Enterprise Windows Laptops',
      subtitle: 'Dell Latitude, Lenovo ThinkPad & HP EliteBook. Ultra-durable business grade laptops ready for heavy programming & office use.',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=2000&q=85',
      linkUrl: '/collection/windows',
      badgeText: 'Deal of the Day',
      ctaText: "Get Today's Best Price",
      sectionKey: 'HERO',
      active: true,
      displayOrder: 2,
    },
    {
      title: 'High Performance Gaming & Student Laptops',
      subtitle: 'NVIDIA RTX Graphics, Core i7/Ryzen Processors, 16GB/32GB RAM & NVMe SSDs at unbeatable budget prices.',
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=2000&q=85',
      linkUrl: '/collection/gaming',
      badgeText: 'Best for Gaming & Coding',
      ctaText: "Get Today's Best Price",
      sectionKey: 'HERO',
      active: true,
      displayOrder: 3,
    },
  ];

  for (const b of banners) {
    const existing = await prisma.banner.findFirst({ where: { title: b.title } });
    if (existing) {
      await prisma.banner.update({
        where: { id: existing.id },
        data: b,
      });
    } else {
      await prisma.banner.create({ data: b });
    }
  }

  // 2. DYNAMIC CUSTOMER VIDEO REVIEWS
  console.log('🎥 Seeding Customer Video Reviews into database...');
  const videoReviews = [
    {
      title: 'Apple MacBook Air M1 Honest Unboxing & Battery Health Check',
      customerName: 'Aman Verma',
      laptopModel: 'Apple MacBook Air M1 (Space Grey)',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      rating: 5,
      featured: true,
      displayOrder: 1,
    },
    {
      title: 'Lenovo ThinkPad T14 Corporate Testing - Incredible Value for Coding',
      customerName: 'Pooja Khandelwal',
      laptopModel: 'Lenovo ThinkPad T14 Gen 2 i7',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      rating: 5,
      featured: true,
      displayOrder: 2,
    },
    {
      title: 'HP EliteBook 840 G7 - 1 Year Warranty & Packaging Experience',
      customerName: 'Vikram Rajput',
      laptopModel: 'HP EliteBook 840 G7',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
      rating: 5,
      featured: true,
      displayOrder: 3,
    },
    {
      title: 'Dell Latitude 7420 2-in-1 Touchscreen Display & Hinge Quality',
      customerName: 'Siddharth Mehra',
      laptopModel: 'Dell Latitude 7420 Touch',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
      rating: 5,
      featured: true,
      displayOrder: 4,
    },
    {
      title: 'ASUS ROG Strix Gaming Laptop - 60 FPS Performance on Budget',
      customerName: 'Kunal Singh',
      laptopModel: 'ASUS ROG Strix G15',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      rating: 5,
      featured: true,
      displayOrder: 5,
    },
  ];

  for (const vr of videoReviews) {
    const existing = await prisma.videoReview.findFirst({ where: { title: vr.title } });
    if (existing) {
      await prisma.videoReview.update({
        where: { id: existing.id },
        data: vr,
      });
    } else {
      await prisma.videoReview.create({ data: vr });
    }
  }

  // 3. SEED DYNAMIC REVIEWS ON ALL ACTIVE PRODUCTS
  console.log('💬 Seeding Dynamic Customer Reviews on Products...');
  const products = await prisma.product.findMany({ where: { active: true } });

  const sampleReviews = [
    {
      authorName: 'Rohan Mehra',
      authorEmail: 'rohan.mehra@gmail.com',
      rating: 5,
      title: 'Flawless condition, feels like brand new!',
      comment: 'Received the laptop within 3 business days in heavy double-box packaging. Battery health is 93% and screen has zero scratches. Best deal compared to buying a new one.',
      verifiedPurchase: true,
      status: 'APPROVED',
      helpfulCount: 14,
    },
    {
      authorName: 'Sneha Patel',
      authorEmail: 'sneha.patel@gmail.com',
      rating: 5,
      title: 'Genuine original charger and official 45-point test card included',
      comment: 'Was skeptical about refurbished, but Lappy Square sent a signed testing checklist with the laptop. Everything works super fast, keyboard is crisp, 10/10 recommendation.',
      verifiedPurchase: true,
      status: 'APPROVED',
      helpfulCount: 9,
    },
    {
      authorName: 'Abhishek Roy',
      authorEmail: 'abhishek.roy@outlook.com',
      rating: 5,
      title: 'Excellent customer support on WhatsApp',
      comment: 'Reached out to their support team on WhatsApp before ordering to check actual photos. They shared HD photos and dispatch video within 15 minutes. Great experience!',
      verifiedPurchase: true,
      status: 'APPROVED',
      helpfulCount: 7,
    },
    {
      authorName: 'Divya Nair',
      authorEmail: 'divya.nair@yahoo.com',
      rating: 4,
      title: 'Value for money, great performance',
      comment: 'Very minor faint mark on bottom lid as stated in honest grade description, but the screen and performance are 100% flawless. Battery easily gives 5-6 hours of coding backup.',
      verifiedPurchase: true,
      status: 'APPROVED',
      helpfulCount: 4,
    },
  ];

  for (const prod of products) {
    const existingReviews = await prisma.review.findMany({ where: { productId: prod.id } });
    if (existingReviews.length < 3) {
      for (const rev of sampleReviews) {
        const alreadyHas = existingReviews.some((r) => r.userName === rev.authorName);
        if (!alreadyHas) {
          await prisma.review.create({
            data: {
              productId: prod.id,
              userName: rev.authorName,
              userEmail: rev.authorEmail,
              rating: rev.rating,
              title: rev.title,
              comment: rev.comment,
              isVerifiedPurchase: true,
              isApproved: true,
            },
          });
        }
      }
    }

    const totalRev = await prisma.review.count({ where: { productId: prod.id, isApproved: true } });
    await prisma.product.update({
      where: { id: prod.id },
      data: {
        rating: 4.9,
        reviewCount: totalRev,
      },
    });
  }

  // 4. WEBSITE SETTINGS: ONLY YOUTUBE, INSTAGRAM, FACEBOOK
  console.log('⚙️ Updating Website Settings (YouTube, Instagram, Facebook only)...');
  await prisma.websiteSetting.upsert({
    where: { id: 'default-setting' },
    update: {
      youtubeUrl: 'https://youtube.com/@lappysquare',
      instagramUrl: 'https://www.instagram.com/lappy_square/',
      facebookUrl: 'https://www.facebook.com/61593042681135/',
      supportPhone: '+91 93769 88788',
      whatsappNumber: '+91 93769 88788',
      supportAddress: 'Peris, Near, Vijay Path, Ward 27, Chauraha, Mansarover, Jaipur, Rajasthan 302020',
      linkedinUrl: '',
      twitterUrl: '',
    },
    create: {
      id: 'default-setting',
      siteName: 'Lappy Square',
      tagline: 'Certified Pre-Owned & Refurbished Laptops',
      youtubeUrl: 'https://youtube.com/@lappysquare',
      instagramUrl: 'https://www.instagram.com/lappy_square/',
      facebookUrl: 'https://www.facebook.com/61593042681135/',
      supportPhone: '+91 93769 88788',
      whatsappNumber: '+91 93769 88788',
      supportAddress: 'Peris, Near, Vijay Path, Ward 27, Chauraha, Mansarover, Jaipur, Rajasthan 302020',
      linkedinUrl: '',
      twitterUrl: '',
    },
  });

  const bannerCount = await prisma.banner.count();
  const videoReviewCount = await prisma.videoReview.count();
  const reviewCount = await prisma.review.count();
  const productCount = await prisma.product.count();

  console.log(`\n🎉 Database population complete!`);
  console.log(`✅ Hero Banners in DB: ${bannerCount}`);
  console.log(`✅ Video Reviews in DB: ${videoReviewCount}`);
  console.log(`✅ Customer Reviews in DB: ${reviewCount}`);
  console.log(`✅ Total Products in DB: ${productCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding dynamic data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
