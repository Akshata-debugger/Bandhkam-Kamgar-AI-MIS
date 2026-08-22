import path from 'node:path'
import { Router } from 'express'
import multer from 'multer'
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js'
import * as controller from '../controllers/workerController.js'
import { documentFolders, prepareUploadFolders, uploadsRoot } from '../services/storageService.js'
await prepareUploadFolders()
const storage=multer.diskStorage({destination:(_req,file,done)=>done(null,path.join(uploadsRoot,documentFolders[file.fieldname]||documentFolders.other)),filename:(_req,file,done)=>done(null,`${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`)})
const upload=multer({storage,limits:{fileSize:10*1024*1024},fileFilter:(_req,file,done)=>done(null,/^(image\/|application\/pdf)/.test(file.mimetype))})
const router=Router();router.use(authenticate)
router.get('/stats',controller.stats);router.get('/',controller.list);router.get('/:id',controller.get);router.post('/',authorizeRoles('admin','operator'),controller.create);router.put('/:id',authorizeRoles('admin','operator'),controller.update);router.delete('/:id',authorizeRoles('admin'),controller.destroy)
router.post('/:id/documents',authorizeRoles('admin','operator'),upload.any(),async(request,response)=>response.status(201).json({message:'Files stored securely. Authenticated document preview endpoint will be enabled with document metadata.',files:request.files.map((file)=>({type:file.fieldname,name:file.originalname,mimeType:file.mimetype,size:file.size}))}))
export default router
