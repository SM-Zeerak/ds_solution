// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Define the base upload directory
// const uploadsDir = path.join(__dirname, '../uploads');

// // Ensure the base upload directory exists
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         setImmediate(() => {
//             const cnic = req.body.cnic ? req.body.cnic.replace(/\D/g, '') : null; // Sanitize CNIC

//             if (!cnic) {
//                 return cb(new Error('CNIC number is required'), null);
//             }

//             // Define the target directory based on the CNIC number and file type
//             let targetDir;
//             if (file.fieldname === 'profileImage') {
//                 targetDir = path.join(uploadsDir, cnic);
//             } else if (file.fieldname === 'cnicImage') {
//                 targetDir = path.join(uploadsDir, cnic);
//             } else {
//                 return cb(new Error('Invalid file field name'), null);
//             }

//             // Ensure the target directory exists
//             if (!fs.existsSync(targetDir)) {
//                 fs.mkdirSync(targetDir, { recursive: true });
//             }

//             cb(null, targetDir);
//         });
//     },
//     filename: (req, file, cb) => {
//         setImmediate(() => {
//             const cnic = req.body.cnic ? req.body.cnic.replace(/\D/g, '') : null; // Sanitize CNIC

//             if (!cnic) {
//                 return cb(new Error('CNIC number is required'), null);
//             }

//             // Use the same filename for overwriting (no timestamp needed)
//             let fileName;
//             if (file.fieldname === 'profileImage') {
//                 fileName = 'profile.jpg';
//             } else if (file.fieldname === 'cnicImage') {
//                 fileName = 'cnic.jpg';
//             }

//             const targetPath = path.join(uploadsDir, cnic, file.fieldname, fileName);

//             // Ensure that if the file already exists, it will be overwritten
//             // No need to delete manually, Multer will automatically overwrite
//             cb(null, fileName);
//         });
//     },
// });

// // Multer middleware
// const upload = multer({
//     storage,
//     // fileFilter: (req, file, cb) => {
//     //     const ext = path.extname(file.originalname).toLowerCase();
//     //     if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
//     //         return cb(new Error('Only JPG, JPEG, or PNG files are allowed'), false);
//     //     }
//     //     cb(null, true);
//     // },
    
//     filename: (req, file, cb) => {
//         setImmediate(() => {
//             const cnic = req.body.cnic ? req.body.cnic.replace(/\D/g, '') : null; // Sanitize CNIC
    
//             if (!cnic) {
//                 return cb(new Error('CNIC number is required'), null);
//             }
    
//             let fileName;
//             if (file.fieldname === 'profileImage') {
//                 fileName = 'profile.jpg';
//             } else if (file.fieldname === 'cnicImage') {
//                 fileName = 'cnic.jpg';
//             }
    
//             // Construct the relative path to save in the database
//             const relativePath = path.join('uploads', cnic, fileName);
    
//             cb(null, fileName);
//         });
//     }
// });

// module.exports = upload;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the base upload directory explicitly
const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads', 'Vendor');

// Ensure the base upload directory exists
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const cnic = req.body.cnic ? req.body.cnic.replace(/\D/g, '') : null; // Sanitize CNIC

        if (!cnic) {
            return cb(new Error('CNIC number is required'), null);
        }

        // Create target directory using CNIC under 'uploads/Vendor'
        const targetDir = path.join(uploadsDir, cnic);

        // Ensure the target directory exists
        fs.mkdirSync(targetDir, { recursive: true });

        cb(null, targetDir);
    },
    filename: (req, file, cb) => {
        const fileName = file.fieldname === 'profileImage' ? 'profile.jpg' : 'cnic.jpg';
        cb(null, fileName); // Save as profile.jpg or cnic.jpg
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
            return cb(new Error('Only JPG, JPEG, or PNG files are allowed'), false);
        }
        cb(null, true);
    }
});

module.exports = upload;
