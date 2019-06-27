$(document).ready(function () {
    var videosContainer = document.getElementById('videos-container');

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

    };

    peer.onStreamAdded = function (e) {
        var video = e.mediaElement;
        video.setAttribute('width', '80%');
        video.setAttribute('controls', true);
        videosContainer.insertBefore(video, videosContainer.firstChild);
        video.play();
        //scaleVideos();
    };

    peer.onStreamEnded = function (e) {
        var video = e.mediaElement;
        if (video) {
            video.style.opacity = 1;
            rotateVideo(video);
            setTimeout(function () {
                video.parentNode.removeChild(video);
                //scaleVideos();
            }, 1000);
        }
    };

    getUserMedia(function (stream) {
        peer.addStream(stream);
        peer.startBroadcasting();
    });

    /*
    function scaleVideos() {
        var videos = document.querySelectorAll('video'),
            length = videos.length,
            video;

        var minus = 130;
        var windowHeight = 1050;
        var windowWidth = 900;
        var windowAspectRatio = windowWidth / windowHeight;
        var videoAspectRatio = 4 / 3;
        var blockAspectRatio;
        var tempVideoWidth = 0;
        var maxVideoWidth = 0;

        for (var i = length; i > 0; i--) {
            blockAspectRatio = i * videoAspectRatio / Math.ceil(length / i);
            if (blockAspectRatio <= windowAspectRatio) {
                tempVideoWidth = videoAspectRatio * windowHeight / Math.ceil(length / i);
            } else {
                tempVideoWidth = windowWidth / i;
            }
            if (tempVideoWidth > maxVideoWidth)
                maxVideoWidth = tempVideoWidth;
        }
        for (var i = 0; i < length; i++) {
            video = videos[i];
            if (video)
                video.width = maxVideoWidth - minus;
        }
    }
    window.onresize = scaleVideos;
    */

    // I need to capture getUserMedia myself to send the stream to the player!
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
            // We do not need to see ourselves
            /*
            peer.onStreamAdded({
                mediaElement: video,
                userid: 'self',
                stream: stream
            });
            */
            callback(stream);
        });
    }
});

function sendMessage(message) {
    console.log("Controller sends a message to the player: " + message);
    controllerToPlayer.send(message);
}

function handleReceiveMessage(event) {
    console.log("Controller receives a message from the player: " + event.data);
    manageEvent(event.data);
    //var res = event.data.split(",");
}
