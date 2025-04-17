import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import createGame from "./game/game";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://jogo-da-velha-client.vercel.app/", "http://localhost:5173"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const game = createGame()

io.on("connect", (socket) => {

    console.log("> Player connected:", socket.id);
    game.addPlayer(socket.id)

    socket.on("get_initial_state", () => {
        io.emit("board", game.state.board)
        io.emit("players", game.state.players)
        io.emit("turn", game.state.currentPlayer)
    })

    socket.on("move", ({ position, symbol }) => {
        if (game.state.players.p1.id === "" || game.state.players.p2.id === "") {
            return socket.emit("message", "Insufficient players!")
        }
        if (position !== null && symbol !== null) {
            game.newMove(position, symbol)
            game.changeTurn()
            io.emit("board", game.state.board)
            io.emit("winner", game.checkWinner())
            io.emit("turn", game.state.currentPlayer)
        }
        else {
            socket.emit("message", "Error on create move!")
        }
    })

    socket.on("reset", () => {
        game.reset();
        io.emit("board", game.state.board);
        io.emit("turn", game.state.currentPlayer)
        io.emit("reset");
    })

    socket.on("disconnect", () => {
        console.log("> Player disconnected: ", socket.id);
        if(game.state.players.viewers.includes(socket.id)){
            game.removePlayer(socket.id)
            io.emit("players", game.state.players)            
        }else{
            game.removePlayer(socket.id)
            io.emit("players", game.state.players)            
            game.reset();
            io.emit("board", game.state.board)
            io.emit("reset")
        }
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});