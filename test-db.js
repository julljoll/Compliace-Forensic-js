const { initDatabase, getDb } = require('./electron/database');

async function testConnection() {
  console.log('⏳ Inicializando base de datos Neon DB...');
  try {
    const sql = await initDatabase();
    if (!sql) throw new Error('No se pudo inicializar la base de datos');
    
    const res = await sql`SELECT version()`;
    console.log('✅ Conexión exitosa a Neon:', res[0].version);
    
    // Check tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('📋 Tablas existentes:', tables.map(t => t.table_name).join(', '));
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testConnection();
