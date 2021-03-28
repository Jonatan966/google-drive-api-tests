<h1 align="center">
  Google Drive API Tests
</h1>

## 💻 Sobre
Um projeto destinado a testes com a API do Google Drive. Os testes se resumem a upload, deleção e visualização de imagens. Este projeto pode servir como base para outras criações.

## :rocket: Como iniciar
1. Certifique-se de possuir o arquivo JSON com as credenciais da sua aplicação do Google Cloud Platform. Insira este arquivo no diretório **src/secrets**

2. Antes de iniciar o servidor, é necessário fazer o download das dependências, para isso é necessário digitar o seguinte comando no **terminal/cmd**
    ```
    yarn
    ```

3. Por fim, para iniciar o servidor, digite o seguinte comando no **terminal/cmd**:
    ```
    yarn dev
    ```

4. Por padrão, o servidor iniciado estará disponível para consumo na seguinte URL:
    ```
    http://localhost:3333
    ```

## :airplane: Rotas
Listar imagens
```
GET - /images
```
Inserir imagem
```
POST - /images
```
Deletar imagem
```
DELETE - /images/:id
```

## 👽 Tecnologias
As tecnologias principais utilizadas neste projeto são as seguintes:
- Google Drive API
- Express
- Multer