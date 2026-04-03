const multer = require('multer');
const path   = require('path');
const { MAX_FILE_SIZE } = require('../config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext) ? cb(null, true) : cb(new Error('Only PDF and DOCX files are allowed'));
};

module.exports = multer({ storage, limits: { fileSize: MAX_FILE_SIZE }, fileFilter });
