import express from 'express'
import { clerkMiddleware } from '@clerk/express'
import { createInvoice, deleteInvoice, getInvoiceById, getInvoices, updateInvoice } from '../controllers/invoiceController.js'

const InvoiceRoute = express.Router();
InvoiceRoute.use(clerkMiddleware());
InvoiceRoute.get('/',getInvoices);
InvoiceRoute.get('/:id', getInvoiceById);
InvoiceRoute.post('/',createInvoice)
InvoiceRoute.put('/:id',updateInvoice)
InvoiceRoute.delete('/:id', deleteInvoice)

export default InvoiceRoute;