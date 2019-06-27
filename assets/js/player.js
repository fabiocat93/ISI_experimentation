var userFound = false;

$(document).ready(function () {
    if (!location.hash.replace('#', '').length) {
        location.href = location.href.split('#')[0] + '#' + ("usabilityTest").toString().replace('.', '')
        location.reload();
    }

    var channel = "channel";
    var pub = 'pub-f986077a-73bd-4c28-8e50-2e44076a84e0';
    var sub = 'sub-b8f4c07a-352e-11e2-bb9d-c7df1d04ae4a';

    WebSocket = PUBNUB.ws;

    var websocket = new WebSocket('wss://pubsub.pubnub.com/' + pub + '/' + sub + '/' + channel);

    websocket.onerror = function () {
        location.reload();
    };

    websocket.onclose = function () {
        location.reload();
    };

    websocket.push = websocket.send;
    websocket.send = function (data) {
        websocket.push(JSON.stringify(data));
    };

    var peer = new PeerConnection(websocket);
    peer.onUserFound = function (userid) {
        if (userFound) {
            return;
        }
        userFound = true;

        getUserMedia(function (stream) {
            peer.addStream(stream);
            peer.sendParticipationRequest(userid);
        });
    };


    peer.onStreamAdded = function (e) {
        // Nothing to declare
    };

    peer.onStreamEnded = function (e) {
        // Nothing to declare
    };
    
    // I need to capture getUserMedia myself to send the stream to the controller!
    function getUserMedia(callback) {
        var hints = {
            audio: true,
            video: true
        };
        /* video:{
             optional: [],
             mandatory: {}
         }*/
    
        navigator.getUserMedia(hints, function (stream) {
            var video = document.createElement('video');
            video.srcObject = stream;
            video.controls = true;
            video.muted = true;
            peer.onStreamAdded({
                mediaElement: video,
                userid: 'self',
                stream: stream
            });

            callback(stream);
        });
    }
});

function sendMessage(message) {
    console.log("Player sends a message to the controller: " + message);
    playerToController.send(message);
}

function handleReceiveMessage(event) {
    console.log("Player receives a message from the controller: " + event.data);
    manageEvent(event.data);
    //var res = event.data.split(",");
}


//TO DO
// L'ANIMAZIONE DELL'AUDIO
/*
function listeningAnimator() {
    var waves = new SineWaves({
        el: document.getElementById('waves'),
        speed: 2,
        ease: 'SineInOut',
        wavesWidth: '75%',
        waves: [
            {
                timeModifier: 4,
                lineWidth: 1,
                amplitude: -25,
                wavelength: 25
    },
            {
                timeModifier: 2,
                lineWidth: 1,
                amplitude: -10,
                wavelength: 30
    },
            {
                timeModifier: 1,
                lineWidth: 1,
                amplitude: -30,
                wavelength: 30
    },
            {
                timeModifier: 3,
                lineWidth: 1,
                amplitude: 40,
                wavelength: 40
    },
            {
                timeModifier: 0.5,
                lineWidth: 1,
                amplitude: -60,
                wavelength: 60
    },
            {
                timeModifier: 1.3,
                lineWidth: 1,
                amplitude: -40,
                wavelength: 40
    }
  ],

        resizeEvent: function () {
            var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
            gradient.addColorStop(0, "rgba(255,221,116,0.49)");
            gradient.addColorStop(0.5, "rgba(255,221,116,0.49)");
            gradient.addColorStop(1, "rgba(255, 255, 25, 0");

            var index = -1;
            var length = this.waves.length;
            while (++index < length) {
                this.waves[index].strokeStyle = gradient;
            }

            index = void 0;
            length = void 0;
            gradient = void 0;
        }
    });
}
*/