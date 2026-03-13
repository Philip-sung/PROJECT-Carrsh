# 프론트/백엔드 단일 배포 통합 및 인프라 정리 (2026-03-14)

## 배경

이전 작업에서 프론트엔드(Vite + React)와 백엔드(Express + Apollo)를 별도 Deployment 2개로 분리하고,
Ingress에서 `/graphql` → back, `/` → web으로 분기 라우팅하는 구조로 변경되어 있었다.

문제: 프론트엔드는 정적 빌드 결과물을 서버가 서빙하는 구조이므로 분리할 이유가 없었다.

## 수행한 작업

### 1. Dockerfile 통합

- 루트에 단일 멀티스테이지 Dockerfile 생성
- Stage 1: front/ 빌드 (npm run build → dist/)
- Stage 2: back/ 빌드 (tsc)
- Stage 3: 런타임 — back의 빌드 결과 + front의 빌드 결과를 /app/public/에 복사
- front/Dockerfile, back/Dockerfile 삭제

### 2. server.ts 수정

- express.static으로 /app/public/ 서빙 추가
- SPA fallback (index.html) 추가
- publicPath를 `path.resolve(__dirname, "../public")` 으로 수정 (dist/에서 실행되므로 한 단계 위)

### 3. k8s 리소스 정리

- carrsh-web-deployment.yaml 삭제
- carrsh-web-service.yaml 삭제
- carrsh-back-deployment.yaml에서 이미지 이름을 통합 이미지로 변경
- carrsh-back-service.yaml만 유지 (ClusterIP, port 80 → targetPort 3000)

### 4. package.json 스크립트 통합

- 기존: kube:deploy:front, kube:deploy:back, kube:deploy:all (3개)
- 변경: kube:deploy 하나로 통합 (docker build → push → k8s apply → rollout restart)

### 5. 서버(호스트) k8s 리소스 정리

이전 구조에서 web과 back이 분리되어 있었으므로, 클러스터에 다음 리소스가 살아있었다:
- carrsh-web-deployment (nginx로 프론트 정적 파일 서빙)
- carrsh-web-service (web deployment를 노출)
- carrsh-back-deployment
- carrsh-back-service

통합 후 web 관련 리소스는 불필요하므로 클러스터에서 직접 삭제:
```
kubectl delete deployment carrsh-web-deployment
kubectl delete service carrsh-web-service
```

Ingress(`carrsh-server-ingress`)는 원래부터 `/` → `carrsh-back-service:80`으로 되어 있었고,
이전 클로드가 `/graphql` → back, `/` → web으로 분기하려던 변경은 적용 전이었으므로 수정 불필요.

### 6. nginx 리버스 프록시 정리 및 SSL 설정

#### 6-1. 트래픽 경로 구조

이 서버의 트래픽 경로는 다음과 같다:
```
외부 요청 → 호스트 nginx (포트 80/443)
  → Ingress Controller (K3s 내부, NodePort 32527)
    → Ingress Resource (호스트 기반 라우팅)
      → 각 서비스의 ClusterIP → Pod
```

호스트 nginx는 K8s Ingress Controller 앞단의 리버스 프록시 역할이다.
SSL 종료는 호스트 nginx에서 Certbot으로 처리하고, Ingress Controller에는 HTTP로 전달한다.

#### 6-2. 이전 상태 (문제)

이전 클로드가 carrsh-back-service와 carrsh-web-service를 각각 NodePort(32581, 32580)로 변경하고,
호스트 nginx에서 Ingress Controller를 우회하여 NodePort로 직접 연결하려 했다.
이는 다른 서비스(oip 등)가 Ingress 경유 구조를 쓰고 있는 것과 일관성이 없었다.

또한 nginx 설정 파일이 여러 곳에 분산되어 있었다:
- `/etc/nginx/conf.d/carrsh-proxy.conf` — carrsh.com 전용 (port 32527로 되어있었음)
- `/etc/nginx/conf.d/ingress-proxy.conf` — oip 도메인용인데 carrsh 블록이 섞여있었음

#### 6-3. 정리 작업

1. `/etc/nginx/conf.d/ingress-proxy.conf`에서 carrsh.com 관련 server 블록 제거 (oip 전용으로 정리)

2. `/etc/nginx/conf.d/carrsh-proxy.conf`를 다음과 같이 작성:
```nginx
server {
    listen 80;
    server_name carrsh.com www.carrsh.com;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:32527;
    }
}
```

3. Certbot으로 SSL 인증서 발급:
```
sudo certbot --nginx -d carrsh.com -d www.carrsh.com
```

Certbot이 자동으로 다음을 처리:
- `/etc/letsencrypt/live/carrsh.com/`에 인증서 저장 (fullchain.pem, privkey.pem)
- carrsh-proxy.conf에 `listen 443 ssl` 블록 추가
- HTTP → HTTPS 301 리다이렉트 블록 추가
- 자동 갱신 스케줄 등록

최종 carrsh-proxy.conf 상태:
```nginx
server {
    server_name carrsh.com www.carrsh.com;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:32527;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/carrsh.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/carrsh.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = www.carrsh.com) {
        return 301 https://$host$request_uri;
    }
    if ($host = carrsh.com) {
        return 301 https://$host$request_uri;
    }
    listen 80;
    server_name carrsh.com www.carrsh.com;
    return 404;
}
```

4. nginx 설정 검증 및 리로드:
```
sudo nginx -t && sudo systemctl reload nginx
```

### 7. MongoDB 인증 및 데이터 마이그레이션

#### 7-1. 인증 실패 문제

통합 배포 후 서버 로그에 `MongoServerError: Authentication failed` 발생.
원인: carrsh DB에 접속할 유저가 생성되어 있지 않았다.

DATABASE_URI는 `mongodb://carrshAdmin:****@cluster-db-service:27017/carrsh`로 설정되어 있었지만,
MongoDB의 carrsh 데이터베이스에 `carrshAdmin` 유저가 존재하지 않았다.

#### 7-2. 유저 생성

ClusterInfra 프로젝트에 이미 초기화 스크립트가 준비되어 있었다:
```
cd ~/PROJECT-ClusterInfra && npm run db:create-carrsh-user
```

이 스크립트가 `database/init/runCreateCarrshUser.js`를 실행하여
carrsh DB에 `carrshAdmin` 유저를 생성한다.

#### 7-3. 데이터 마이그레이션

유저 생성 후에도 데이터가 조회되지 않았다.
원인: 실제 데이터가 `carrsh` DB가 아닌 `pserver` DB에 들어있었다 (이전 프로젝트명).

mongosh로 pserver의 모든 컬렉션을 carrsh DB로 복사:
```javascript
db = db.getSiblingDB("pserver");
db.getCollectionNames().forEach(function(col) {
  var docs = db[col].find().toArray();
  if (docs.length > 0) {
    db.getSiblingDB("carrsh")[col].insertMany(docs);
  }
});
```

복사 확인 후 pserver DB 삭제:
```
db.getSiblingDB("pserver").dropDatabase()
```

## 최종 아키텍처

```
클라이언트 → carrsh.com (HTTPS)
  → 호스트 nginx (SSL 종료, /etc/nginx/conf.d/carrsh-proxy.conf)
    → Ingress Controller (NodePort 32527)
      → Ingress (carrsh-server-ingress)
        → carrsh-back-service (ClusterIP:80)
          → carrsh-back-deployment (Pod, port 3000)
            → Express: /graphql → Apollo Server
            → Express: /* → 정적 파일 (front 빌드 결과물)
```

## 삭제된 파일

- front/Dockerfile
- back/Dockerfile
- k8s/carrsh-web-deployment.yaml
- k8s/carrsh-web-service.yaml
