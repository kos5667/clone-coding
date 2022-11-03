import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public")); 
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const httpServer = http.createServer(app);
const io = SocketIO(httpServer);

function onSocketClose() {
    console.log("Disconnected from Browser!!")
}

// front에서 보낸 callback function은 backend에서 처리 하는것 보다는 front로 돌려보내 처리
// backend에서 처리하는 것은 보안상 좋지않음.
io.on("connection", (socket) => {
    socket.onAny((event) => {
        console.log(`Socket Event : ${event}`)
    })

    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
    })
})

// Web socket
// const wss = new WebSocket.Server({ server });
// const sockets = [];
// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser!!");
//     socket.on("close", onSocketClose)
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${message.payload.toString('utf8')}`));
//                 break;
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     })
// }); 

httpServer.listen(3000, handleListen);