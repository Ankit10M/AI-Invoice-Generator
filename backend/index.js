import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import { clerkMiddleware } from '@clerk/express'
import { connectdb } from './config/db.js'
import InvoiceRoute from './routes/invoiceRoute.js'
import businessRoute from './routes/businessRoute.js'
import aiInvoiceRoute from './routes/aiInvoiceRoute.js'

const app = express()
const port = 4002

// Middleware
app.use(cors({
    origin: 'https://ai-invoice-generator-252g.onrender.com',
    credentials: true
}))
app.use(express.json({ limit: '20mb' }))
app.use(clerkMiddleware())
app.use(express.urlencoded({ limit: '20mb', extended: true }))

// DB
connectdb()

// routes
app.use('/uploads', express.static(path.join(process.cwd(), "uploads")))
app.use('/api/invoice', InvoiceRoute)
app.use('/api/businessProfile', businessRoute)
app.use('/api/ai', aiInvoiceRoute)

app.get('/', (req, res) => {
    res.send('API Working')
})
app.listen(port, () => {
    console.log('server running')
})