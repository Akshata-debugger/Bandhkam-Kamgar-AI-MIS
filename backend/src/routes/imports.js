import { Router } from 'express'
import { authenticate, authorizeRoles } from '../middleware/authMiddleware.js'
import { previewImport, supportedImportSources } from '../services/importService.js'
import getDatabasePool from '../db.js'
const router=Router();router.use(authenticate)
router.get('/sources',(_request,response)=>response.json({sources:supportedImportSources,googleSheetsConnected:false}))
router.post('/preview',authorizeRoles('admin','operator'),async(request,response,next)=>{try{response.json(await previewImport(request.body,request.user.sub))}catch(error){response.status(400);next(error)}})
router.get('/history',async(_request,response,next)=>{try{const pool=getDatabasePool();const[rows]=await pool.execute('SELECT ih.*,u.full_name imported_by_name FROM import_history ih LEFT JOIN users u ON u.id=ih.imported_by ORDER BY ih.created_at DESC LIMIT 50');response.json({rows})}catch(error){next(error)}})
export default router
