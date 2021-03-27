import { Request, Response } from 'express'
import { gdriveProvider } from '../providers/GoogleDriveProvider'

class UploadImageController {
  async handle(req: Request, res: Response) {
    const fileIds = await gdriveProvider.create(req.files as any)

    res.json({uploaded: fileIds})
  }
}

export default new UploadImageController()
