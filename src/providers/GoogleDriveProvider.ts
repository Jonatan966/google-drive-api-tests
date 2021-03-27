import path from 'path'
import fs from 'fs'
import readline from 'readline-sync'
import { google, drive_v3 } from 'googleapis'
import { OAuth2Client, Credentials } from 'google-auth-library'

class GoogleDriveProvider {
  private scopes = ['https://www.googleapis.com/auth/drive']
  private tokenPath = path.join(__dirname, '..', 'secrets', 'token.json')
  private credentialsPath = path.join(__dirname, '..', 'secrets', 'credentials.json')
  private gdrive: drive_v3.Drive = null as any
  private folderId = '1fWOPdv4exR9S8lUmK2vLGi1pC1IFBE1u'

  constructor() {
    const credentialsFile = fs.readFileSync(this.credentialsPath)

    this._authorize(JSON.parse(String(credentialsFile)), (oAuth2Client) => {
      this.gdrive = google.drive({version: 'v3', auth: oAuth2Client})
      console.log('Logado com sucesso!')
    })
  }

  async _authorize(credentials: any, callback: (oAuth2Client: OAuth2Client) => void) {
    const {client_secret, client_id, redirect_uris} = credentials.installed
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0])
  
    try {
      const token = JSON.parse(String(fs.readFileSync(this.tokenPath)))
      
      oAuth2Client.setCredentials(token)
      callback(oAuth2Client)  
    }
    catch (err){
      this._getAccessToken(oAuth2Client, callback)
    }
  }

  _writeTokenInFile(token: any) {
    fs.writeFileSync(this.tokenPath, JSON.stringify(token))
    console.log('Token armazenado com sucesso!')
  }

  _grantAllFilePermissions(fileId: string) {
    this.gdrive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    })
  }

  async _getAccessToken(oAuth2Client: OAuth2Client, callback: (oAuth: OAuth2Client) => void) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });

    console.log('Autorize este app acessando essa URL:\n', authUrl);

    const code = readline.question('Cole o código de autenticação aqui: ')
    
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Erro ao tentar recuperar o token de acesso. ', err)

      oAuth2Client.setCredentials(token as Credentials)

      try {
        this._writeTokenInFile(token)
        callback(oAuth2Client)
      }
      catch (err) {
        console.error('Algo deu errado ao tentar armazenar o token de login.\n Motivo: ', err)
      }
    })
  }

  async list() {
    const files = await this.gdrive.files.list({
      fields: 'files(id, name, webContentLink)',
      q: `parents in "${this.folderId}"`
    })
    // q = mimeType="image/jpeg" and 

    // console.log((await this.#GDRIVE.files.list({
    //   q: 'mimeType = "application/vnd.google-apps.folder"',
    //   fields: 'files(id, name)'
    // })).data)

    if (Object.keys(files.data).length) {
      return files.data.files
    }

    return []
  }

  async create(files: Express.Multer.File[]) {
    let fileIds = []

    for (const file of files) {
      const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(path.join(__dirname, '..', '..', file.path))
      }

      const fileMetadata = {
        name: `${(new Date()).getTime()}.jpg`,
        parents: [this.folderId]
      }
    
      const results = await this.gdrive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, webContentLink',

      })

      this._grantAllFilePermissions(String(results.data.id))

      fileIds.push(results.data)
    }

    return fileIds
  }

  async delete(fileId: string) {
    try {
      await this.gdrive.files.delete({
        fileId,
      })

      return true
    }
    catch {
      return false
    }
  }
}

export const gdriveProvider = new GoogleDriveProvider()
