import path from 'node:path'
import { Router } from 'express'
import multer from 'multer'
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js'
import * as controller from '../controllers/workerController.js'
import * as workers from '../services/workerService.js'
import * as lifecycle from '../services/lifecycleService.js'
import { documentFolders, prepareUploadFolders, uploadsRoot } from '../services/storageService.js'
await prepareUploadFolders()
const storage=multer.diskStorage({destination:(_req,file,done)=>done(null,path.join(uploadsRoot,documentFolders[file.fieldname]||documentFolders.other)),filename:(_req,file,done)=>done(null,`${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`)})
const upload=multer({storage,limits:{fileSize:10*1024*1024},fileFilter:(_req,file,done)=>done(null,/^(image\/|application\/pdf)/.test(file.mimetype))})
const router=Router();router.use(authenticate)
router.get('/stats',controller.stats);router.get('/',controller.list);router.get('/:id/lifecycle',async(request,response,next)=>{try{const result=await lifecycle.getLifecycle(request.params.id);if(!result)return response.status(404).json({message:'Worker not found.'});response.json(result)}catch(error){next(error)}});router.post('/:id/lifecycle/:type',authorizeRoles('admin','operator'),async(request,response,next)=>{try{response.status(201).json(await lifecycle.createLifecycleRecord(request.params.id,request.params.type,request.body,request.user.sub))}catch(error){next(error)}});router.get('/:id',controller.get);router.post('/',authorizeRoles('admin','operator'),controller.create);router.put('/:id',authorizeRoles('admin','operator'),controller.update);router.delete('/:id',authorizeRoles('admin'),controller.destroy)
router.get('/:id/documents',async(request,response,next)=>{try{response.json(await workers.listDocuments(request.params.id))}catch(error){next(error)}})
router.get('/documents/:documentId/download',async(request,response,next)=>{try{const document=await workers.documentPath(request.params.documentId);if(!document)return response.status(404).json({message:'Document not found.'});response.type(document.mime_type);response.download(document.storage_path,document.original_name)}catch(error){next(error)}})
router.post('/:id/documents',authorizeRoles('admin','operator'),upload.any(),async(request,response,next)=>{try{const files=await workers.addDocuments(request.params.id,request.files,request.user.sub);response.status(201).json({files})}catch(error){next(error)}})
export default router
