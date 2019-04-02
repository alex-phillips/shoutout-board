var socket = null

class Socket {
  static setSocket (io) {
    socket = io
  }

  static emit (event, data) {
    socket.emit(event, data)
  }
}

module.exports = Socket
