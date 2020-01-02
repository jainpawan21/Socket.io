const express = require('express')
const http = require('http')
const path  = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket)=> {
  console.log('New WebSocket Connection')

  socket.emit('message', 'Welcome!')
  socket.broadcast.emit('message', 'A new user has joined!')

  socket.on('sendMessage', (message, callback)=> {
  const filter = new Filter()

  if(filter.isProfane(message)){
    return callback('Profanity Not Allowed')
  }

    io.emit('message', message)
    callback('Delivered')
  })

  socket.on('sendLocation', (coords, callback)=>{
    io.emit('locationMessage', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
    callback()
  })

  socket.on('disconnect', ()=>{
    io.emit('message', 'A user has left')
  })

})

server.listen(port, () => {
  console.log(`Server is running on port ${port}!`)
})