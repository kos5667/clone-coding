## Zoom Clone Coding

Zoom Clone using NodeJS, WebRTC and Websockets



### Environment

**package.json**

```json
...
"scripts": {
    "dev": "nodemon" // npm run dev(project run) 실행중 nodemon.json mapping.
},
...
```

**nodemon.json**

> `watch` : 지정한 파일에 코드 변경이 감지되면 서버를 재시작.
>
> `exec` : 감지되었을 때 수행할 명령
>
> `ext` : extension, 파일확장자 입력.
>
> `ignore` : 입력한 파일또는 폴더를 감지에서 제외

```json
{
    "ignore": ["src/public/*"],	// package 'src/public/*'이하 package는 nodemon 적용을 제외
    "exec": "babel-node src/server.js"  // 실행할 명령어 또는 Script file 지정.
}
```

**babel.config.json** - [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
babel plugin을 모아둔 프리셋.

> `@babel` :  자바스크립트의 코드를 구버전에 맞게끔 변환
>
> - `@babel/core` : 바벨의 코어 패키지
> - `@babel/cli` : 커맨드라인에서 파일을 컴파일하게 해주는 CLI 제공
> - `@babel/node` : 코드의 변환과 node 실행을 같이 하는 패키지
> - `@babel/preset-env` :  Babel플러그인을 모아둔 것으로 Babel프리셋이라고 부르며 공식 프리셋은 다음과 같다.
>   - `@babel/preset-env` 
>   - ` @babel/preset-flow`
>   - `@babel/preset-react`
>   -  `@babel/preset-typescript`

```json
{
    "presets": ["@babel/preset-env"]
}
```



### Web Socket

### SocketIO

socket io callback function은 backend에서 처리하지 말고 front로 돌려보내서 처리하는것이 좋다.
(보안상 좋지않음)

