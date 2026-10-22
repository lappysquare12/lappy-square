import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'wypa20jz',
  api_key: '313843521994842',
  api_secret: 'Xp-UXGGTcHGSWl5BXLO00apURLQ',
});

async function testCloudinary() {
  console.log('Testing Cloudinary ping...');
  const result = await cloudinary.api.ping();
  console.log('✅ Cloudinary ping result:', result);
}

testCloudinary().catch((err) => {
  console.error('❌ Cloudinary test error:', err);
  process.exit(1);
});
