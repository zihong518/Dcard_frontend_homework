# Dcard 2023 Web Frontend Intern Homework

A React app about task management with github assigned issue

## About this project

- Learning React from scratch and completing this project
- List all the assigned issue with infinite scroll from GitHub REST API
- Edit and delete the issue from GitHub REST API
- Sort the issues by created date and filter according the status
- Search issue about the keyword with infinite scroll from GitHub REST API 

<img src="https://github.com/zihong518/Dcard_frontend_homework/blob/master/.github/Asset/demo.gif" width='100%' height='100%'/>

## Getting Started

1. Download this repository via git clone and enter this folder

```
git clone https://github.com/zihong518/Dcard_frontend_homework.git

cd Dcard-2022-Web-Frontend-Intern-Homework
```

2. Run this React app

```
npm install
npm start
```

`npm start` will automatically open http://localhost:3000 on your computer.

### Setup your Gatekeeper

> Due to the security related limitations, Github prevents you from implementing the OAuth Web Application Flow on a client-side only application. [Gatekeeper](https://github.com/prose/gatekeeper)

3.Download the gatekeeper this git clone and install Dependencies

```
git clone git@github.com:prose/gatekeeper.git

cd gatekeeper && npm install
```

4. Adjust config.json

```
{
  "oauth_client_id": "GITHUB_APPLICATION_CLIENT_ID",
  "oauth_client_secret": "GITHUB_APPLICATION_CLIENT_SECRET",
  "oauth_host": "github.com",
  "oauth_port": 443,
  "oauth_path": "/login/oauth/access_token",
  "oauth_method": "POST",
  "port": 9999
}
```

5. Run gatekeeper, so it will run on http://localhost:9999

```
node index.js
```

## Project structure:

```
src
 ┣ components // 元件庫
 ┃ ┗ image   // 使用圖片/icon
 ┃ ┃ ┣ edit.svg
 ┃ ┃ ┗ trash.svg
 ┣ global // 共用變數/函式
 ┃ ┣ Loading.js
 ┃ ┗ function.js
 ┣ pages
 ┃ ┣ Login // 登入
 ┃ ┃ ┗ index.js
 ┃ ┣ Task  // 任務管理
 ┃ ┃ ┣ components // 任務元件庫
 ┃ ┃ ┃ ┣ AlertModal.js // Modal -> 刪除task
 ┃ ┃ ┃ ┣ EditModal.js // Modal -> 編輯task
 ┃ ┃ ┃ ┣ Item.js  // task
 ┃ ┃ ┃ ┣ ItemModal.js // Modal -> task的詳細資訊
 ┃ ┃ ┃ ┗ Search.js // search
 ┃ ┃ ┗ index.js
 ┃ ┗ redirect.js    // 重新導向頁面
 ┣ router   // router管理
 ┃ ┗ AppRouter.js
 ┣ index.css
 ┗ index.js
```

## Developement/Testing Env

- **OS** : MacOS 13.2.1
- **Developing Language** : JavaScript
- **Framework** : React 18.2.0
- **CSS Framework** : Tailwind 3.2.4
