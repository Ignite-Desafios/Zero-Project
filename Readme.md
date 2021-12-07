# Project: Zero Start React APP


<p align="center">
    <img 
    src="./public/logo.svg"
    width="60%"
    />
</p>
    

### Notion: [Link](https://www.notion.so/Desafio-01-Criando-um-projeto-do-zero-b1a3645d286b4eec93f5f1f5476d0ff7)

### Figma: [Link](https://www.figma.com/file/yJZDLP1J6VWhTs1c2K3KgT/Desafios-M%C3%B3dulo-3-ReactJS-(Copy)?node-id=0%3A1)

### Comandos Utilizados:

* ``yarn install``
* https://prismic.io/

* .env.local 
  ```
  PRISMIC_API_ENDPOINT='prismic http endpoint'
  ```


### Notas:

* Apesar da aplicação estar funcionando, os testes necessitam de uma atenção, ou seja, mesmo funcionando, os testes falham, então exige fazer a aplicação de acordo com o teste.

## Prismic Settings:

- **slug**
    - Tipo: UID
    - Descrição: Identificador único amigável de cada post. Pode receber um valor manualmente ou é gerado automaticamente a partir do primeiro campo de texto preenchido. Esse campo vai ser utilizado na navegação do Next.
- **title**
    - Tipo: Key Text
    - Descrição: Input de strings. Recebe valores manualmente. Esse campo será utilizado como título do Post.
- **subtitle**
    - Tipo: Key Text
    - Descrição: Input de strings. Recebe valores manualmente. Esse campo será utilizado como subtítulo do Post.
- **author**
    - Tipo: Key Text
    - Descrição: Input de strings. Recebe valores manualmente. Esse campo será utilizado como nome do autor do Post.
- **banner**
    - Tipo: Image
        
    - Descrição: Input de imagens. Recebe valores manualmente. Esse campo será utilizado como banner do Post.
- **content**
    - Tipo: Group
    - Descrição: Grupo de campos repetíveis. Esse campo será utilizado como o conteúdo do Post. O conteúdo será dividido em seções com um campo `heading` e um campo `body`.
    - Campos internos:
        - **heading**
            - Tipo: Key Text
            - Descrição: Input de strings. Recebe valores manualmente. Esse campo será utilizado como título da seção do Post.
        - **body**
            - Tipo: Rich Text
            - Configurações do campo:
                p, B, I, link, img, <>, ul, ol, rtl
                
            - Descrição: Input de *rich text* (HTML). Recebe valores manualmente. Esse campo será utilizado como conteúdo da seção do Post. Perceba que nas configurações do campo, selecionamos algumas opções para que o seu texto tenha varias formatações (negrito, hyperlinks, listas, etc.).