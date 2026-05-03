## 로컬 실행 및 빌드 방법

### 실행 환경

이 프로젝트는 Node.js 16~20 버전을 지원합니다.  
권장 버전은 Node.js 20입니다.

현재 Node.js 버전은 아래 명령어로 확인할 수 있습니다.

```bash
node -v
```

### nvm 설치

Node.js 버전 관리를 위해 `nvm` 사용을 권장합니다.

`nvm`이 설치되어 있지 않다면 아래 명령어로 설치합니다.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

설치 후 터미널을 재실행합니다.

### Node.js 20 설정

```bash
nvm install 20
nvm use 20
```

프로젝트 루트에 `.nvmrc` 파일이 있는 경우 아래 명령어로도 버전을 맞출 수 있습니다.

```bash
nvm use
```

### 의존성 설치

```bash
npm install --legacy-peer-deps
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성한 뒤, 이메일로 전달드린 환경 변수 값을 복사해 붙여넣습니다.

```bash
touch .env.local
```

### 빌드

```bash
npm run build
```

### 개발 서버 실행

```bash
npm run dev
```

개발 서버 실행 후 아래 주소에서 확인할 수 있습니다.

```txt
http://localhost:3000
```

### 단위 테스트

```bash
npm test
```
