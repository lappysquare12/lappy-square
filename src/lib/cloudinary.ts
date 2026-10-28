import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary SDK with provided credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export default cloudinary;

/**
 * Upload a buffer or base64 data string to Cloudinary
 */
export async function uploadImageToCloudinary(
  fileBufferOrBase64: Buffer | string,
  folder: string = 'lappy-square/products',
  resourceType: 'auto' | 'image' | 'video' = 'auto',
  options?: { whiteBackground?: boolean }
): Promise<{ url: string; public_id: string; resource_type?: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: resourceType,
    };
    if (resourceType === 'image') {
      uploadOptions.transformation = [{ quality: 'auto', fetch_format: 'auto' }];
    }

    const finalizeUrl = (secureUrl: string) => {
      if (options?.whiteBackground && resourceType === 'image' && secureUrl.includes('/image/upload/')) {
        // Cloudinary AI background removal + pure crisp studio white background
        return secureUrl.replace('/image/upload/', '/image/upload/e_background_removal,b_white/');
      }
      return secureUrl;
    };

    if (typeof fileBufferOrBase64 === 'string' && fileBufferOrBase64.startsWith('data:')) {
      // Base64 upload
      cloudinary.uploader.upload(
        fileBufferOrBase64,
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload to Cloudinary failed'));
          }
          resolve({
            url: finalizeUrl(result.secure_url),
            public_id: result.public_id,
            resource_type: result.resource_type,
          });
        }
      );
    } else {
      // Buffer stream upload
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error('Upload to Cloudinary failed'));
          }
          resolve({
            url: finalizeUrl(result.secure_url),
            public_id: result.public_id,
            resource_type: result.resource_type,
          });
        }
      );

      const buffer = Buffer.isBuffer(fileBufferOrBase64)
        ? fileBufferOrBase64
        : Buffer.from(fileBufferOrBase64);

      uploadStream.end(buffer);
    }
  });
}
