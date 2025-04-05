import express from 'express'
import { generatePreSignedURL, generatePreSignedURLForProductSheet } from '../controllers/uploadController.js';

const router = express.Router();


router.post("/get-presignedurl", generatePreSignedURL);  

router.post('/upload-productSheet',generatePreSignedURLForProductSheet);
export default router;