require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('Setting up database schema...');

  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync('/Users/edwelton/Documents/Welto Digital/sauna-directory/scripts/setup-database.sql', 'utf8');

    // Split SQL commands by semicolon and filter out empty ones
    const sqlCommands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`Executing ${sqlCommands.length} SQL commands...`);

    // Execute each command separately
    for (let i = 0; i < sqlCommands.length; i++) {
      const command = sqlCommands[i];
      if (command) {
        try {
          console.log(`Executing command ${i + 1}/${sqlCommands.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql_query: command });

          if (error) {
            console.error(`Error executing command ${i + 1}:`, error);
            // Continue with other commands
          } else {
            console.log(`Command ${i + 1} executed successfully`);
          }
        } catch (cmdError) {
          console.error(`Exception executing command ${i + 1}:`, cmdError);
          // Continue with other commands
        }
      }
    }

    console.log('Database setup completed!');

  } catch (error) {
    console.error('Database setup failed:', error);

    // Try alternative approach - execute raw SQL
    console.log('Trying alternative approach...');

    try {
      const sqlContent = fs.readFileSync('/Users/edwelton/Documents/Welto Digital/sauna-directory/scripts/setup-database.sql', 'utf8');

      // Try to execute the entire SQL as one query
      const { error } = await supabase.rpc('exec_sql', { sql_query: sqlContent });

      if (error) {
        console.error('Alternative approach also failed:', error);
      } else {
        console.log('Alternative approach succeeded!');
      }
    } catch (altError) {
      console.error('Alternative approach failed with exception:', altError);
    }
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };