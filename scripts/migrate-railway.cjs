const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL environment variable is required.');
  process.exit(1);
}

async function main() {
  const client = new Client({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });
  await client.connect();
  console.log('Connected to PostgreSQL database successfully!');

  // Create role milet_app if not exists
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'milet_app') THEN
        CREATE ROLE milet_app LOGIN PASSWORD 'milet_app_secure_pwd';
      END IF;
    END
    $$;
  `);

  const currentDbRes = await client.query('SELECT current_database() as db;');
  const currentDb = currentDbRes.rows[0].db;
  await client.query(`GRANT CONNECT ON DATABASE "${currentDb}" TO milet_app;`);
  console.log(`milet_app role ensured and granted CONNECT on ${currentDb}.`);

  const migrations = [
    '001_transactional_foundation.sql',
    '002_deterministic_demo_fixture.sql',
    '003_outbox_worker.sql',
    '004_stage1_demo_outbox_fixture.sql',
    '005_tenant_relational_integrity.sql',
    '006_app_role_grants.sql',
    '007_portals_schema.sql',
    '008_portals_rls_grants.sql',
  ];

  for (const file of migrations) {
    const filePath = path.join(__dirname, '..', 'infra', 'postgres', 'migrations', file);
    const sql = fs.readFileSync(filePath, 'utf8');
    process.stdout.write('Applying ' + file + '... ');
    await client.query(sql);
    console.log('OK');
  }

  const res = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('Tables in public schema:');
  res.rows.forEach(r => console.log(' - ' + r.table_name));

  await client.end();
  console.log('PostgreSQL migrations completed successfully!');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
