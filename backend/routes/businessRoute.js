import express from 'express'
import multer from 'multer'
import { clerkMiddleware } from '@clerk/express'
import path from 'path'
import { createBusinessProfile, getMyBusinessProfile, updatebusinessProfile } from '../controllers/businessController.js'

const businessRoute = express.Router()
businessRoute.use(clerkMiddleware())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'uploads'))
    }, filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, `business-${unique}${ext}`)
    }
})

const upload = multer({ storage })

businessRoute.post('/', upload.fields([
    { name: 'logoName', maxCount: 1 },
    { name: 'stampName', maxCount: 1 },
    { name: 'signatureNameMeta', maxCount: 1 },
]),
    createBusinessProfile);

businessRoute.put('/:id', upload.fields([
    { name: 'logoName', maxCount: 1 },
    { name: 'stampName', maxCount: 1 },
    { name: 'signatureNameMeta', maxCount: 1 },
]), updatebusinessProfile)

businessRoute.get('/me', getMyBusinessProfile)

export default businessRoute;