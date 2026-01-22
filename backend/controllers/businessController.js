import { getAuth } from "@clerk/express"
import BusinessProfile from '../models/businessModel.js'



const API_BASE = 'https://ai-invoice-generator-backend-e1zk.onrender.com'

// file to url

function uploadedFilesToUrls(req) {
    const urls = {};
    if (!req.files) return urls;

    const logoArr = req.files.logoName || req.files.logo || [];
    const stampArr = req.files.stampName || req.files.stamp || [];
    const sigArr = req.files.signatureNameMeta || req.files.signature || [];

    if (logoArr[0]) urls.logoUrl = `${API_BASE}/uploads/${logoArr[0].filename}`;
    if (stampArr[0]) urls.stampUrl = `${API_BASE}/uploads/${stampArr[0].filename}`;
    if (sigArr[0]) urls.signatureUrl = `${API_BASE}/uploads/${sigArr[0].filename}`;

    return urls;
}
//  create a business profile 
export async function createBusinessProfile(req, res) {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authenication Required' })
        }
        const body = req.body || {}
        const fileUrls = uploadedFilesToUrls(req);
        const profile = new BusinessProfile({
            owner: userId,
            businessName: body.businessName || "ABC Solutions",
            email: body.email || "",
            address: body.address || "",
            phone: body.phone || "",
            gst: body.gst || "",
            logoUrl: fileUrls.logoUrl || body.logoUrl || null,
            stampUrl: fileUrls.stampUrl || body.stampUrl || null,
            signatureUrl: fileUrls.signatureUrl || body.signatureUrl || null,
            signatureOwnerName: body.signatureOwnerName || "",
            signatureOwnerTitle: body.signatureOwnerTitle || "",
            defaultTaxPercent:
                body.defaultTaxPercent !== undefined ? Number(body.defaultTaxPercent) : 18,
        });
        const saved = await profile.save()
        return res.status(200).json({ message: 'Business Profile Created', data: saved })
    } catch (error) {
        console.error('Business Profile Creation error');
        return res.status(500).json({ success: false, message: 'server error' })
    }
}
//   update business profile

export async function updatebusinessProfile(req, res) {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authenication Required' })
        }
        const { id } = req.params;
        const body = req.body || {}
        const fileUrls = uploadedFilesToUrls(req)
        const existing = await BusinessProfile.findById(id)
        if (!existing) return res.status(404).json({ message: 'Business Profile Not found', success: false })
        if (existing.owner.toString() !== userId) {
            return res.status(403).json({ message: 'You are not the Owner of this Profile', success: false })
        }
        const update = {}
        if (body.businessName !== undefined) update.businessName = body.businessName;
        if (body.email !== undefined) update.email = body.email;
        if (body.address !== undefined) update.address = body.address;
        if (body.phone !== undefined) update.phone = body.phone;
        if (body.gst !== undefined) update.gst = body.gst;

        if (fileUrls.logoUrl) update.logoUrl = fileUrls.logoUrl;
        else if (body.logoUrl !== undefined) update.logoUrl = body.logoUrl;

        if (fileUrls.stampUrl) update.stampUrl = fileUrls.stampUrl;
        else if (body.stampUrl !== undefined) update.stampUrl = body.stampUrl;

        if (fileUrls.signatureUrl) update.signatureUrl = fileUrls.signatureUrl;
        else if (body.signatureUrl !== undefined) update.signatureUrl = body.signatureUrl;

        if (body.signatureOwnerName !== undefined) update.signatureOwnerName = body.signatureOwnerName;
        if (body.signatureOwnerTitle !== undefined) update.signatureOwnerTitle = body.signatureOwnerTitle;
        if (body.defaultTaxPercent !== undefined) update.defaultTaxPercent = Number(body.defaultTaxPercent);
        const updated = await BusinessProfile.findByIdAndUpdate(id, update, {
            new: true,
            runValidators: true
        })
        return res.status(200).json({ message: 'Profile Updated Successfully', success: true })
    } catch (error) {
        console.error('Business Profile Updation error');
        return res.status(500).json({ success: false, message: 'server error' })
    }
}

export async function getMyBusinessProfile(req, res) {
    try {
        const { userId } = getAuth(req)
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required', success: false })
        }
        const profile = await BusinessProfile.findOne({ owner: userId }).lean()
        if (!profile) {
            return res.status(204).json({
                message: 'No profile found',
                success: false
            })
        }
        return res.status(200).json({ message: 'Profile found', success: true, data: profile })
    } catch (error) {
        console.error(' get Business Profile error',error);
        return res.status(500).json({ success: false, message: 'server error' })
    }
}