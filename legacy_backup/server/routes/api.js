const express = require('express');
const router = express.Router();
const db = require('../db');

// --- ORDERS ---
router.get('/orders', (req, res) => {
    db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const orders = rows.map(row => ({
            ...row,
            items: JSON.parse(row.items || '[]')
        }));
        res.json(orders);
    });
});

router.post('/orders', (req, res) => {
    const { id, name, subtitle, date, status, type, value, items, progress } = req.body;
    const sql = `INSERT INTO orders (id, name, subtitle, date, status, type, value, items, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [id, name, subtitle, date, status, type, value, JSON.stringify(items), progress];
    
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id, ...req.body });
    });
});

router.put('/orders/:id', (req, res) => {
    const { status, progress, items, name, subtitle, value, type, date } = req.body;
    // Build dynamic update query
    let updates = [];
    let params = [];
    if (status !== undefined) { updates.push("status = ?"); params.push(status); }
    if (progress !== undefined) { updates.push("progress = ?"); params.push(progress); }
    if (items !== undefined) { updates.push("items = ?"); params.push(JSON.stringify(items)); }
    if (name !== undefined) { updates.push("name = ?"); params.push(name); }
    if (subtitle !== undefined) { updates.push("subtitle = ?"); params.push(subtitle); }
    if (value !== undefined) { updates.push("value = ?"); params.push(value); }
    if (type !== undefined) { updates.push("type = ?"); params.push(type); }
    if (date !== undefined) { updates.push("date = ?"); params.push(date); }
    
    if (updates.length === 0) return res.json({ message: "No changes" });
    
    params.push(req.params.id);
    const sql = `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`;
    
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Updated" });
    });
});

router.delete('/orders/:id', (req, res) => {
    db.run("DELETE FROM orders WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted" });
    });
});

// --- MENU ---
router.get('/menu', (req, res) => {
    db.all("SELECT * FROM menu_items", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/menu', (req, res) => {
    const { id, name, category, price, description, image } = req.body;
    const sql = "INSERT INTO menu_items (id, name, category, price, description, image) VALUES (?, ?, ?, ?, ?, ?)";
    db.run(sql, [id, name, category, price, description, image], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(req.body);
    });
});

router.put('/menu/:id', (req, res) => {
    const { name, category, price, description, image } = req.body;
    const sql = "UPDATE menu_items SET name = ?, category = ?, price = ?, description = ?, image = ? WHERE id = ?";
    db.run(sql, [name, category, price, description, image, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(req.body);
    });
});

router.delete('/menu/:id', (req, res) => {
    db.run("DELETE FROM menu_items WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted" });
    });
});

// --- TRANSACTIONS ---
router.get('/transactions', (req, res) => {
    db.all("SELECT * FROM transactions ORDER BY date DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/transactions', (req, res) => {
    const { id, type, description, amount, category, date } = req.body;
    const sql = "INSERT INTO transactions (id, type, description, amount, category, date) VALUES (?, ?, ?, ?, ?, ?)";
    db.run(sql, [id, type, description, amount, category, date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(req.body);
    });
});

router.delete('/transactions/:id', (req, res) => {
    db.run("DELETE FROM transactions WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted" });
    });
});

// --- STAFF ---
router.get('/staff', (req, res) => {
    db.all("SELECT * FROM staff", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/staff', (req, res) => {
    const { id, name, role, pin } = req.body;
    const sql = "INSERT INTO staff (id, name, role, pin) VALUES (?, ?, ?, ?)";
    db.run(sql, [id, name, role, pin], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(req.body);
    });
});

router.delete('/staff/:id', (req, res) => {
    db.run("DELETE FROM staff WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted" });
    });
});

// --- TABLES ---
router.get('/tables', (req, res) => {
    db.all("SELECT * FROM tables", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.post('/tables', (req, res) => {
    const { id, name, seats } = req.body;
    const sql = "INSERT INTO tables (id, name, seats) VALUES (?, ?, ?)";
    db.run(sql, [id, name, seats], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(req.body);
    });
});

router.delete('/tables/:id', (req, res) => {
    db.run("DELETE FROM tables WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Deleted" });
    });
});

// --- SETTINGS (Key-Value) ---
router.get('/settings/:key', (req, res) => {
    db.get("SELECT value FROM settings WHERE key = ?", [req.params.key], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ value: row ? JSON.parse(row.value) : null });
    });
});

router.post('/settings/:key', (req, res) => {
    const { value } = req.body; // Expecting { value: ... }
    const sql = "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)";
    db.run(sql, [req.params.key, JSON.stringify(value)], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ key: req.params.key, value });
    });
});

module.exports = router;
