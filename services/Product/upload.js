const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Use memory storage for processing in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
            return cb(new Error('Only JPG, JPEG, PNG, or WEBP files are allowed'), false);
        }
        cb(null, true);
    }
});

const fileUpload = (req, res, next) => {
    upload.any()(req, res, async (err) => {
        if (err) return next(err);
        try {
            const uploadDir = path.join(__dirname, '../../public/uploads/Product');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            // Process each uploaded file
            await Promise.all(
                req.files.map(async (file) => {
                    const targetDir = path.join(uploadDir, 'temp'); // Temporary directory before productId is generated
                    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

                    const fileName = `${Date.now()}-${file.fieldname}.jpeg`;
                    const filePath = path.join(targetDir, fileName);

                    await sharp(file.buffer)
                        .rotate()
                        .resize(1024)
                        .jpeg({ quality: 70 })
                        .toFile(filePath);

                    // Update file path for later processing
                    file.path = `/uploads/Product/temp/${fileName}`;
                })
            );
            next();
        } catch (compressionErr) {
            next(compressionErr);
        }
    });
};

module.exports = { fileUpload };
