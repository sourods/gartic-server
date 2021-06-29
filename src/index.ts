import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import { Server } from 'colyseus';
//Rooms
import CanvasRoom from './rooms/canvas';

const PORT = Number(process.env.PORT || 2567);
const app = express()
app.use(cors())
app.use(express.json())

app.get('/health-check', (req, resp) => {
    resp.sendStatus(200)
})

const gameServer = new Server({
    server: createServer(app)
})

gameServer.define('CanvasRoom', CanvasRoom);

gameServer.listen(PORT)