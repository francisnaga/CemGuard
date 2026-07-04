import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedAdmin() {
  console.log("Seeding admin user...");
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@cemguard.demo',
    password: '32888012Ba#',
    email_confirm: true,
    user_metadata: {
      full_name: 'System Admin'
    }
  });

  if (error) {
    console.error("Failed to create admin:", error.message);
  } else {
    console.log("Admin user created successfully:", data.user.email);
  }
}

seedAdmin();
