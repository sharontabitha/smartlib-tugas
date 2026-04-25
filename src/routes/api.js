import express from 'express';
const router = express.Router();

// CUKUP PAKAI INI (Pastikan nama filenya database.js dan ada di folder config)
import pool from '../config/db.js'; 

// Rute untuk mendapatkan semua kategori (GET)
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rute untuk menambah kategori (POST)
router.post('/categories', async (req, res) => {
    console.log("Cek data dari Postman:", req.body); 
    
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ 
            success: false, 
            message: "Mana namanya? Datanya kosong nih!" 
        });
    }

    try {
        const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
        res.status(201).json({
            success: true,
            message: "Kategori berhasil ditambahkan!",
            data: result.rows[0]
        });
    } catch (err) {
        console.error("Error pas input:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;