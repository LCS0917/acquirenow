import { supabaseAdmin } from './src/lib/supabase-admin
async function checkSchema() {
  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching from blog_posts:', error)
  } else {
    console.log('Sample record from blog_posts:', data[0])
    console.log('Available columns:', Object.keys(data[0] || {}))
  }
}

checkSchema()
