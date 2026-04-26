import express from 'express';
const router = express.Router();
import pool from '../config/db.js'; // Pastikan nama filenya db.js atau database.js

// ==========================================
// 1. ENDPOINT REPORTS (STATISTIK)
// ==========================================
router.get('/reports/stats', async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM books) AS total_books,
                (SELECT COUNT(*) FROM authors) AS total_authors,
                (SELECT COUNT(*) FROM categories) AS total_categories,
                (SELECT COUNT(*) FROM loans WHERE status = 'BORROWED') AS total_borrowed
        `;
        
        const result = await pool.query(query);
        
        // Mengirim respon dalam bentuk JSON
        res.json({
            success: true,
            message: "Statistik perpustakaan berhasil diambil",
            data: {
                total_books: parseInt(result.rows[0].total_books),
                total_authors: parseInt(result.rows[0].total_authors),
                total_categories: parseInt(result.rows[0].total_categories),
                total_borrowed: parseInt(result.rows[0].total_borrowed)
            }
        });
    } catch (err) {
        console.error("Error di Stats:", err.message);
        res.status(500).json({ 
            success: false, 
            error: "Gagal mengambil statistik: " + err.message 
        });
    }
});

// ==========================================
// 2. ENDPOINT AUTHORS (Contoh tambahan)
// ==========================================
router.get('/authors', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM authors ORDER BY id ASC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// BARIS PALING PENTING: Cuma boleh ada SATU export default di sini!
export default router;