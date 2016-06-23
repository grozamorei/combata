import {SendMessage, GameParams, SharedUtils} from "./shared.gen";
var __clientIdCounter = 0;

export class ServerClient {
    static _nextId() {
        return __clientIdCounter++;
    }

    static _socketStateToStr(state) {
        switch (state) {
            case 0: return 'CONNECTING';
            case 1: return 'OPEN';
            case 2: return 'CLOSING';
            case 3: return 'CLOSED';
            default: return 'UNKNOWN';
        }
    }

    static _isSocketReady(socket) {
        return socket.readyState == 1;
    }

    /**
     * @param socket {WebSocket}
     */
    constructor(socket) {
        this._id = ServerClient._nextId();
        this._name = "client" + this._id;

        this._approxLag = 0;
        this._sentPingTime = -1;
        this._rttHistory = [];

        /**
         * TODO: DEPRECATED
         * @type {boolean}
         */
        this.alive = true;

        this._socket = socket;
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get lag() { return this._approxLag; }

    /**
     * @param data {string}
     */
    send(data) {
        if (!this._canUseSocket('send message')) return;
        this._socket.send(data)
    }

    /**
     * @param currentTime {number}
     */
    ping(currentTime) {
        if (!this._canUseSocket('ping client')) return;
        this._sentPingTime = currentTime;
        this._socket.send(SendMessage.ping());
    }

    /**
     * @param currentTime {number}
     */
    ackPong(currentTime) {
        if (this._sentPingTime === -1) {
            console.error("wrong time on client", this._id);
            return;
        }
        var rtt = currentTime - this._sentPingTime;
        this._rttHistory.push(rtt);
        if (this._rttHistory.length > GameParams.rttMedianHistory) {
            this._rttHistory.shift();
            var sortedHistory = this._rttHistory.concat().sort(SharedUtils.sortAcc);
            var medianIdx = Math.floor(GameParams.rttMedianHistory/2);
            this._approxLag = Math.round((sortedHistory[medianIdx] + GameParams.additionalVirtualLagMedian)/2);
            // console.log(this.lag, this._rttHistory, sortedHistory);
        }
        this._sentPingTime = -1;
    }

    /**
     * @param value {number}
     */
    setMedianRTT(value) {
        this._approxLag = Math.round(value / 2);
    }
    
    purge() {
        this._socket = null;
        this._id = -1;
    }
    
    toString() {
        if (this._id > -1) {
            var state = ServerClient._socketStateToStr(this._socket.readyState);
            return '{[' + this._id + ":" + this._name + "]; sock [" + state + "]}";
        }
        return '{[' + this._id + ":" + this._name + "]; sock [DEAD]}"; 
    }

    /**
     * @param m {string}
     * @returns {boolean}
     * @private
     */
    _canUseSocket(m) {
        if (!ServerClient._isSocketReady(this._socket)) {
            console.log('ServerClient: cannot ' + m + ' ' + this._socket.readyState);
            return false;
        }
        return true;
    }
}