import { Request, Response } from 'express'
import { gdriveProvider } from '../providers/GoogleDriveProvider'

class GetImagesController {
  async handle(req: Request, res: Response) {
    const result = await gdriveProvider.list()
    res.json(result)
  }
}

export default new GetImagesController()
