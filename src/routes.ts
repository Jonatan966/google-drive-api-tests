import { Router } from 'express'
import upload from './utils/multer'

import {
  deleteImageController,
  getImagesController,
  uploadImageController
} from './controllers'

const router = Router()

router.get('/images', getImagesController.handle)
router.post('/images', upload.array('images'), uploadImageController.handle)
router.delete('/images/:id', deleteImageController.handle)

export default router