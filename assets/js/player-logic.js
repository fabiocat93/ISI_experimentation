var audio = new Audio('./assets/audio/beep.wav');

function manageEvent(e){
    switch(e) {
        case "beep":
            playMusic();
            break;
        case "idle":
            idle();
            break;
        case "agent-speaking":
                speak();
                break;
        case "agent-listening":
                listen();
                break;
        default:
            showAvatar(e);
            break;
    }
}

var status = "idle";

$(document).ready(function() {
    var siriWave = new SiriWave({
        container: document.getElementById('siri-container'),
        width: 640,
        height: 200,
        style: "ios", // alt. "ios"
        speed: 0.1,
        amplitude: 1, 
        cover: true,
        color: "#ffff00",
        pixelDepth: 0.02
    });    
    siriWave.start();

    $("#circle").click(function() {
        if (status === "idle") {
            sendMessage("interaction-starts");
        } else if (status === "listening") {
            sendMessage("interaction-stops");
        }
    });

    $(document).keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            if (status === "idle") {
                sendMessage("interaction-starts");
            } else if (status === "listening") {
                sendMessage("interaction-stops");
            }
        }
    });
});

function playMusic() {
    console.log("play beep");
    audio.play();
}

function idle() {
    $("#siri-container").fadeOut("slow", function() {
        $("#circle").fadeIn("slow");
        $("#circle").removeClass("pulsate-fwd");
        status = "idle";
    });
}

function listen() {
    $("#siri-container").fadeOut("slow", function() {
        $("#circle").fadeIn("slow");
        $("#circle").addClass("pulsate-fwd");
        status = "listening";
    });
}

function speak() {
    $("#circle").removeClass("pulsate-fwd");
    $("#circle").fadeOut("slow", function() {
        $("#siri-container").fadeIn("slow");
        status = "speaking";
    });
}

function showAvatar(link) {
    $("#avatar-picture").fadeOut("slow", function() {
        $("#avatar-picture").attr("src",link);
        $("#avatar-picture").fadeIn("slow");    
    });
}