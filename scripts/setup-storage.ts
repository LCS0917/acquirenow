import { supabaseAdmin } from '../src/lib/supabase-admin';

async function setupStorage() {
  console.log('Attempting to verify/create "blog-images" bucket...');
  
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }

  const exists = buckets.find(b => b.name === 'blog-images');

  if (!exists) {
    console.log('Bucket "blog-images" not found. Creating it now...');
    const { error: createError } = await supabaseAdmin.storage.createBucket('blog-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.error('Failed to create bucket:', createError);
    } else {
      console.log('Successfully created "blog-images" bucket.');
    }
  } else {
    console.log('Bucket "blog-images" already exists.');
  }
}

setupStorage();
