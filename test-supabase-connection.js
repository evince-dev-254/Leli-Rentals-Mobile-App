// Test Supabase connection and user management
import { supabase } from './lib/supabase.web.js';

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if we can connect
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Connection failed:', error);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test 2: Test user registration
    console.log('\nTesting user registration...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
      options: {
        data: {
          full_name: 'Test User',
          username: 'testuser'
        }
      }
    });
    
    if (authError) {
      console.error('Registration failed:', authError);
    } else {
      console.log('✅ User registration successful!');
      console.log('User ID:', authData.user?.id);
    }
    
    // Test 3: Query profiles
    console.log('\nTesting profile query...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (profileError) {
      console.error('Profile query failed:', profileError);
    } else {
      console.log('✅ Profile query successful!');
      console.log('Profiles found:', profiles.length);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testSupabaseConnection();
