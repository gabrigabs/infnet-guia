# Guia de Implantação - Infnet Guide

Este documento fornece instruções detalhadas para o deploy da aplicação Infnet Guide utilizando Docker e Kubernetes.

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) instalado
- Acesso a um cluster Kubernetes (Minikube, Docker Desktop ou solução em nuvem)
- Conta no [Docker Hub](https://hub.docker.com/)

## Construção e Publicação da Imagem Docker

1. **Construir a imagem Docker**

   Navegue até o diretório raiz do projeto e execute:

   ```bash
   docker build -t seu-usuario-dockerhub/infnet-guia:latest .
   ```

2. **Testar a imagem localmente**

   ```bash
   docker run -p 3000:3000 seu-usuario-dockerhub/infnet-guia:latest
   ```

   Verifique se a aplicação está funcionando corretamente em http://localhost:3000

3. **Fazer login no Docker Hub**

   ```bash
   docker login
   ```

4. **Publicar a imagem no Docker Hub**

   ```bash
   docker push seu-usuario-dockerhub/infnet-guia:latest
   ```

## Deploy no Kubernetes

### 1. Deploy do Redis (Componente de Banco de Dados)

Os arquivos de configuração do Redis já estão prontos na pasta `.devops`.

1. **Aplicar o Deployment do Redis**

   ```bash
   kubectl apply -f .devops/redis-deployment.yaml
   ```

   Este comando cria um pod Redis conforme configurado no arquivo, com 1 réplica.

2. **Aplicar o Service do Redis (ClusterIP)**

   ```bash
   kubectl apply -f .devops/redis-service.yaml
   ```

   Este comando cria um serviço interno (ClusterIP) para o Redis, permitindo que a aplicação se conecte a ele.

### 2. Deploy da Aplicação

Os arquivos de configuração da aplicação também estão prontos na pasta `.devops`.

1. **Aplicar o Deployment da Aplicação**

   ```bash
   kubectl apply -f .devops/infnet-guia-deployment.yaml
   ```

   Este comando cria o deployment da aplicação com 4 réplicas conforme configurado. O arquivo inclui:

   - 4 réplicas como exigido na especificação
   - Probe de prontidão (Readiness Probe)
   - Probe de vida (Liveness Probe)

2. **Aplicar o Service da Aplicação (NodePort)**

   ```bash
   kubectl apply -f .devops/infnet-guia-service.yaml
   ```

   Este comando cria um serviço NodePort para a aplicação, tornando-a acessível fora do cluster.

### 3. Verificar o Deploy

1. **Verificar o status dos deployments**

   ```bash
   kubectl get deployments
   ```

   Você deverá ver tanto `redis-deployment` quanto `infnet-guia-deployment` em execução.

2. **Verificar os pods**

   ```bash
   kubectl get pods
   ```

   Você deverá ver 1 pod Redis e 4 pods da aplicação infnet-guia (réplicas) em execução.

3. **Verificar os serviços**

   ```bash
   kubectl get services
   ```

   Você deverá ver `redis-service` como ClusterIP e `infnet-guia-service` como NodePort.

### 4. Acessar a Aplicação

Acesse a aplicação usando o IP do seu nó e a porta NodePort:

```
http://<ip-do-nó>:<porta-nodeport>
```

Se estiver usando Minikube, você pode obter a URL com:

```bash
minikube service infnet-guia-service --url
```

Se estiver usando Kubernetes do Docker Desktop, você pode acessar o serviço em:

```
http://localhost:<porta-nodeport>
```

## Resumo da Configuração

1. **Container Docker**: A aplicação está containerizada usando o Dockerfile na raiz do projeto, com múltiplos estágios para otimização.
2. **Deployments no Kubernetes**:
   - Redis: 1 réplica, acessível internamente via ClusterIP
   - Aplicação: 4 réplicas com probes de liveness e readiness
3. **Exposição de Serviços**:
   - Redis: ClusterIP (acesso apenas interno)
   - Aplicação: NodePort (acessível externamente)
