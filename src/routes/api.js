import express from 'express';
const router = express.Router();
import pool from '../config/db.js';

// 1. STATS (Yang udah bisa)
router.get('/reports/stats', async (req, res) => {
    try {
        const result = await pool.query('SELECT (SELECT COUNT(*) FROM books) AS total_books');
        res.json({ success: true, data: result.rows[0] });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. BOOKS (Yang tadi gabisa)
router.get('/books', async (req, res) => {
    const { title } = req.query;
    try {
        let query = 'SELECT * FROM books';
        let params = [];
        if (title) {
            query += ' WHERE title ILIKE $1';
            params.push(`%${title}%`);
        }
        const result = await pool.query(query, params);
        res.json({ success: true, data: result.rows });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
// Endpoint untuk mengambil semua kategori
router.get('/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories'); // Pastikan nama tabel di Neon 'categories'
        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});
// 3. RETURN LOGIC (Buat tugas)
router.post('/loans/return/:id', async (req, res) => {
    const { id } = req.params; // ID ini akan menangkap kode panjang tadi
    try {
        const result = await pool.query(
            'UPDATE loans SET return_date = NOW() WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Data peminjaman tidak ditemukan" });
        }

        res.json({ success: true, message: "Buku berhasil dikembalikan", data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});
export default router;