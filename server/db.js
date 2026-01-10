const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'restaurant.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Orders
    db.run(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      name TEXT,
      subtitle TEXT,
      date TEXT,
      status TEXT,
      type TEXT,
      value REAL,
      items TEXT, -- JSON string
      progress INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Menu Items
    db.run(`CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT,
      category TEXT,
      price REAL,
      description TEXT,
      image TEXT
    )`);

    // Transactions
    db.run(`CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT,
      description TEXT,
      amount REAL,
      category TEXT,
      date TEXT
    )`);

    // Tables
    db.run(`CREATE TABLE IF NOT EXISTS tables (
      id TEXT PRIMARY KEY,
      name TEXT,
      seats INTEGER
    )`);

    // Staff
    db.run(`CREATE TABLE IF NOT EXISTS staff (
      id TEXT PRIMARY KEY,
      name TEXT,
      role TEXT,
      pin TEXT
    )`);

    // Settings (Key-Value store)
    db.run(`CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT -- JSON string
    )`, () => {
        seedData();
    });
  });
}

function seedData() {
    // Check if menu is empty
    db.get("SELECT count(*) as count FROM menu_items", (err, row) => {
        if (err) return;
        if (row.count === 0) {
            const items = [
                { id: '1', name: 'Hambúrguer Clássico', category: 'Pratos Principais', price: 25.00, description: 'Pão brioche, blend de carne 180g, queijo cheddar e salada.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
                { id: '2', name: 'Batata Frita Rústica', category: 'Entradas', price: 18.00, description: 'Batatas cortadas à mão com alecrim e alho.', image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd4058?w=500&auto=format&fit=crop&q=60' },
                { id: '3', name: 'Refrigerante Artesanal', category: 'Bebidas', price: 8.00, description: 'Cola ou Guaraná feito na casa.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60' },
                { id: '4', name: 'Pudim de Leite', category: 'Sobremesas', price: 12.00, description: 'Receita tradicional da avó.', image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=500&auto=format&fit=crop&q=60' }
            ];
            const stmt = db.prepare("INSERT INTO menu_items (id, name, category, price, description, image) VALUES (?, ?, ?, ?, ?, ?)");
            items.forEach(item => {
                stmt.run(item.id, item.name, item.category, item.price, item.description, item.image);
            });
            stmt.finalize();
            console.log("Seeded menu items");
        }
    });

    // Check if transactions are empty
    db.get("SELECT count(*) as count FROM transactions", (err, row) => {
        if (err) return;
        if (row.count === 0) {
            const items = [
                { id: '1', type: 'income', description: 'Vendas do Dia', amount: 1250.00, date: '2023-10-25', category: 'Vendas' },
                { id: '2', type: 'expense', description: 'Fornecedor de Bebidas', amount: 450.00, date: '2023-10-24', category: 'Fornecedores' },
                { id: '3', type: 'expense', description: 'Manutenção Fogão', amount: 120.00, date: '2023-10-23', category: 'Manutenção' }
            ];
            const stmt = db.prepare("INSERT INTO transactions (id, type, description, amount, category, date) VALUES (?, ?, ?, ?, ?, ?)");
            items.forEach(item => {
                stmt.run(item.id, item.type, item.description, item.amount, item.category, item.date);
            });
            stmt.finalize();
            console.log("Seeded transactions");
        }
    });

    // Check if orders are empty
    db.get("SELECT count(*) as count FROM orders", (err, row) => {
        if (err) return;
        if (row.count === 0) {
            const items = [
              {
                id: "p1",
                name: "Hambúrguer Artesanal",
                subtitle: "Mesa 05 - Sem cebola",
                date: "19:30",
                progress: 60,
                status: "inProgress",
                type: "mesa",
                value: 45.00,
                items: JSON.stringify([{name: "Hambúrguer Artesanal", price: 45.00}])
              },
              {
                id: "p2",
                name: "Pizza Marguerita",
                subtitle: "Pedido #124 - Entrega",
                date: "19:45",
                progress: 20,
                status: "upcoming",
                type: "delivery",
                value: 60.00,
                items: JSON.stringify([{name: "Pizza Marguerita", price: 60.00}])
              },
              {
                id: "p3",
                name: "Salada Caesar",
                subtitle: "Mesa 02",
                date: "19:15",
                progress: 100,
                status: "completed",
                type: "mesa",
                value: 35.00,
                items: JSON.stringify([{name: "Salada Caesar", price: 35.00}])
              }
            ];
            const stmt = db.prepare("INSERT INTO orders (id, name, subtitle, date, progress, status, type, value, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            items.forEach(item => {
                stmt.run(item.id, item.name, item.subtitle, item.date, item.progress, item.status, item.type, item.value, item.items);
            });
            stmt.finalize();
            console.log("Seeded orders");
        }
    });
}

module.exports = db;
