import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function getDb() {
  if (db) return db;
  
  db = await open({
    filename: './restaurant.db',
    driver: sqlite3.Database
  });

  await initDb(db);
  
  return db;
}

async function initDb(db: Database) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      name TEXT,
      subtitle TEXT,
      date TEXT,
      status TEXT,
      type TEXT,
      value REAL,
      items TEXT, -- JSON string
      progress INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      table_number INTEGER,
      payment_method TEXT,
      waiter_name TEXT
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT,
      category TEXT,
      price REAL,
      description TEXT,
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT,
      description TEXT,
      amount REAL,
      category TEXT,
      date TEXT
    );

    CREATE TABLE IF NOT EXISTS tables (
      id TEXT PRIMARY KEY,
      name TEXT,
      seats INTEGER
    );

    CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT,
      pin TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Migrations: Ensure columns exist for older databases
  try {
    await db.exec('ALTER TABLE orders ADD COLUMN table_number INTEGER');
  } catch (e) {
    // Column likely exists, ignore
  }

  try {
    await db.exec('ALTER TABLE orders ADD COLUMN payment_method TEXT');
  } catch (e) {
    // Column likely exists, ignore
  }

  try {
    await db.exec('ALTER TABLE orders ADD COLUMN waiter_name TEXT');
  } catch (e) {
    // Column likely exists, ignore
  }

  // Seed Menu if empty
  const menuCount = await db.get('SELECT count(*) as count FROM menu_items');
  if (menuCount.count === 0) {
    const items = [
        { id: '1', name: 'Hambúrguer Clássico', category: 'Pratos Principais', price: 25.00, description: 'Pão brioche, blend de carne 180g, queijo cheddar e salada.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
        { id: '2', name: 'Batata Frita Rústica', category: 'Entradas', price: 18.00, description: 'Batatas cortadas à mão com alecrim e alho.', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd4058?w=500&auto=format&fit=crop&q=60' },
        { id: '3', name: 'Refrigerante Artesanal', category: 'Bebidas', price: 8.00, description: 'Cola ou Guaraná feito na casa.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60' },
        { id: '4', name: 'Pudim de Leite', category: 'Sobremesas', price: 12.00, description: 'Receita tradicional da avó.', image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=500&auto=format&fit=crop&q=60' }
    ];
    for (const item of items) {
        await db.run(
            "INSERT INTO menu_items (id, name, category, price, description, image) VALUES (?, ?, ?, ?, ?, ?)",
            [item.id, item.name, item.category, item.price, item.description, item.image]
        );
    }
  }

  // Seed Tables if empty
  const tablesCount = await db.get('SELECT count(*) as count FROM tables');
  if (tablesCount.count === 0) {
    const tables = [
        { id: '1', name: 'Mesa 1', seats: 4 },
        { id: '2', name: 'Mesa 2', seats: 2 },
        { id: '3', name: 'Mesa 3', seats: 6 },
        { id: '4', name: 'Mesa 4', seats: 4 },
    ];
    for (const t of tables) {
        await db.run("INSERT INTO tables (id, name, seats) VALUES (?, ?, ?)", [t.id, t.name, t.seats]);
    }
  }
}
