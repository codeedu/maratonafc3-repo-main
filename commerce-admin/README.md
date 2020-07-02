<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://maratona.fullcycle.com.br/public/img/logo-maratona.png"/></a>
</p>

## Descrição

Maratona FullCycle 3.0

Microsserviço de administração da loja com Django + PostgreSQL + Redis

## Rodar a aplicação

### Para Windows 

Lembrar de instalar o WSL2 e Docker. Vejo o vídeo: [https://www.youtube.com/watch?v=g4HKttouVxA](https://www.youtube.com/watch?v=g4HKttouVxA) 

Siga o guia rápido de instalação: [https://gist.github.com/argentinaluiz/6bff167be40a2bf7a6bb879062cd25cd](https://gist.github.com/argentinaluiz/6bff167be40a2bf7a6bb879062cd25cd) 

#### Crie os volumes

```bash
docker volume create commerce-admin-pgdata
```

#### Altere seu /etc/hosts ou C:\Windows\System32\drivers\etc\hosts

```
127.0.0.1 code-commerce.test
127.0.0.1 store1-admin.code-commerce.test store2-admin.code-commerce.test store3-admin.code-commerce.test store4-admin.code-commerce.test
127.0.0.1 store1-store.code-commerce.test store2-store.code-commerce.test store3-store.code-commerce.test
127.0.0.1 admin.code-commerce1.test admin.code-commerce2.test admin3.code-commerce3.test admin.code-commerce4.test
127.0.0.1 store.code-commerce1.test store.code-commerce2.test store.code-commerce3.test store.code-commerce4.test
```


#### Crie os containers com Docker

```bash
cd .. && cd redis && docker-compose up -d
cd .. && cd rabbitmq && docker-compose up -d
$ docker-compose up
```

##### Para Windows: Somente se acontecer erro No such file directory ao fazer docker-compose up
```bash
$chmod +x ./.docker/app-entrypoint.sh 
$chmod +x ./.docker/worker-entrypoint.sh
```

#### Accesse no browser

```
http://code-commmerce.test:8000/admin ou http://admin.code-commerce1.test:8000/admin 
```

### Dicas

* Verifique o arquivo **tenant/fixtures/fake_data.json** para saber quais endereços estão disponíveis
* Verifique o arquivo **auth_app/fixtures/fake_data.json** para saber quais usuários estão disponiveis
* O usuário **admin@user.com** é o dono do sistema


