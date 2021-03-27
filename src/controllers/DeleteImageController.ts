import { Request, Response } from "express";
import { gdriveProvider } from '../providers/GoogleDriveProvider'

class DeleteImageController {
  async handle(req: Request, res: Response) {
    const { id } = req.params
    const isDeleted = await gdriveProvider.delete(id)

    if (isDeleted) {
      return res.status(204).send()
    }

    return res.status(400).json({
      error: 'Image not found'
    })
  }
}

export default new DeleteImageController()