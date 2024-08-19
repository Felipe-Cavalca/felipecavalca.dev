# BifrostPHP - Front-end Module

[![Repo](https://img.shields.io/badge/Bifrost-Back-blue)](./)

[![GIT](https://img.shields.io/badge/GIT-orange)](./)
[![MD](https://img.shields.io/badge/MD-darkblue)](./)
[![YML](https://img.shields.io/badge/YML-darkblue)](./)
[![PHP](https://img.shields.io/badge/PHP-blue)](./)
[![SQL](https://img.shields.io/badge/SQL-orange)](./)

[![link-readme-inglês](https://img.shields.io/badge/README-English/Inglês-red)](./README.md)
[![link-readme-Portugês](https://img.shields.io/badge/README-Portuguese/Portugês-green)](./README-PT.md)

Este repositório contém a base de código-fonte do back-end do BifrostPHP.

Você pode encontrar mais informações sobre o projeto no repositório oficial no GitHub: [BifrostPHP](https://github.com/Felipe-Cavalca/BifrostPHP)

## Instalação

Para executar o projeto, você precisará ter o Docker e o Docker Compose instalados em sua máquina.

Siga as etapas abaixo para executar o Docker Compose:

1. Abra um terminal e navegue até a pasta `api` do projeto.

2. Execute o seguinte comando para construir e iniciar os contêineres do Docker:

    ```bash
    docker-compose up -d
    ```

    Isso irá baixar as imagens necessárias, construir os contêineres e iniciar os serviços.

3. Após a conclusão, você poderá acessar o aplicativo em seu navegador usando o seguinte URL:

    ```bash
    http://localhost:28080
    ```

## Documentação

Para gerar a documentação do projeto em formato HTML, execute o seguinte comando:

```bash
docker run --rm -v "$(pwd):/data" "phpdoc/phpdoc:3" run -d ./api -t ./docs/api
```

## Patrocinado por

* @Felipe-Cavalca
