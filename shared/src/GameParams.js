function GameParams() {}

GameParams.serverUpdateTime = 50;       // milliseconds
GameParams.playerSpeedX = 240;          // px/sec
GameParams.playerSpeedY = 240;          // px/sec

//
// debug values
//
GameParams.serverStateVisible = false;

if (typeof module !== 'undefined') {
    module.exports.GameParams = GameParams;
}
