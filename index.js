import { EventEmitter } from 'events'

// const MAX_BYTE_SIZE = 1E7 // 10 MB

export default (address) => {
  class Message extends EventEmitter {
    constructor (wire) {
      super()

      this._wire = wire
      this.address = address
      this._filter = []
    }

    onHandshake (infoHash, peerId, extensions) {
      this._infoHash = infoHash
      this._peer = peerId
    }

    onExtendedHandshake (handshake) {
      if (!handshake.m || !handshake.m.ut_message) {
        return this.emit('warning', new Error('Peer does not support ut_message'))
      }
    }

    onMessage (buf) {
      this.emit('msg', buf)
    }

    send (buf) {
      this._wire.extended('ut_msg', buf)
    }
  }

  // Name of the bittorrent-protocol extension
  Message.prototype.name = 'ut_msg'

  return Message
}