

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define upload directory
const uploadsDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

function setRelativePath(req, res, next) {
  if (req.file) {
    req.file.path = `/uploads/products/${req.file.filename}`;
  }
  next();
}

module.exports = { upload, setRelativePath };
