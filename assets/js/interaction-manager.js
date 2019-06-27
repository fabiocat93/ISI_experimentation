const interactionWays = ["Natural", "Eye tracking", "Beep and wait", "Touch", "Mouse", "Physical button", "Activation word"];
var interactionWay;
var text = "";

var weStopTalking;
var startInteraction;
var startTalking;
var startSetup;
var stopInteraction;
var stopTalking;
var stopSetup;

var link = "https://preview.bitmoji.com/avatar-builder-v3/preview/body?scale=1&gender=1&style=1&rotation=1&beard=-1&brow=-1&cheek_details=-1&ear=-1&earring=-1&eye=-1&eyelash=-1&eye_details=-1&face_lines=-1&glasses=-1&hair=490&hat=-1&jaw=185&mouth=-1&nose=-1&pupil=-1&beard_tone=-1&blush_tone=-1&brow_tone=-1&eyeshadow_tone=-1&hair_tone=-1&lipstick_tone=-1&pupil_tone=-1&skin_tone=-1&body=1&face_proportion=0";

$( document ).ready(function() {
    interaction_form_creator();
    text = interactionWay;

    $('#save-logging-button').click(function(e) {
        var temp = saveData();
        temp();
    });

    $('#agent-stops-button').addClass('next-button');

    $('#save-logging-button').click(function(e) {
        var temp = saveData();
        temp();
    });

    $('#set-avatar-button').click(function(e) {
        sendMessage(link);
    });
});

function navbar_form_creator(parent, name, list_of_options) {
    var result = "";
    result += "<select id = \"" + name+ "-form\" class=\"form-control\">";
    var i;
    for (i = 0; i < list_of_options.length; i++) {
        var temp = "<option>" + list_of_options[i] + "</option>";
        result += temp;
    }

    result += "</select><br/>";
    
    $(parent).append(result);
}

function interaction_form_creator() {
    navbar_form_creator("#interaction-form-container", "interaction" , interactionWays);
    interactionWay = $('#interaction-form').val();
    
    $( "#interaction-form").change(function() {
        interactionWay = $('#interaction-form').val();     

        if (interactionWay === "Beep and wait") {
            $('#beep-button').css('visibility', 'visible');
        } else {
            $('#beep-button').css('visibility', 'hidden');
        }

        $( "#agent-stops-time").html("00:00");
        $( "#interaction-starts-time").html("00:00");
        $( "#talk-starts-time").html("00:00");
        $( "#talk-stops-time").html("00:00");
        $( "#interaction-stops-time").html("00:00");
        $( "#setup-starts-time").html("00:00");
        $( "#setup-stops-time").html("00:00");

        updateText("\n\n");
        updateText(interactionWay);
    });
}

var interactionStartsWithBeep = false;

$( "#beep-button" ).click(function() {
    if (!interactionStartsWithBeep) {
        sendMessage("beep");
        manageInteractionStarts();
        interactionStartsWithBeep = true;
    } else {
        sendMessage("beep");
        manageInteractionStops();
        interactionStartsWithBeep = false;
    }
});

$( "#agent-stops-button").click(function() {
    manageAgentStartAndStopButton();
});

function manageAgentStartAndStopButton() {
    if ($( "#agent-stops-button" ).html() === "Stop") {

        if (interactionWay === "Beep and wait") {
            $('#beep-button').addClass('next-button');
        } else {
            $('#interaction-starts-button').addClass('next-button');
        }

        $('#agent-stops-button').removeClass('next-button');    

        // Smettiamo di parlare
        weStopTalking = Date.now();
        updateText("The agent stops speaking at: " + weStopTalking);
        $( "#agent-stops-time").html(msToTime(weStopTalking));
        $( "#agent-stops-button" ).html("Start");
        $( "#agent-start-and-stop-description").html("We start talking");
        sendMessage("idle");
    } else {
        // Iniziamo a parlare
        $( "#agent-stops-button" ).html("Stop");
        $( "#agent-start-and-stop-description").html("We stop talking");

        updateText("The agent starts speaking at: " + Date.now());

        $( "#agent-stops-time").html("00:00");
        $( "#interaction-starts-time").html("00:00");
        $( "#talk-starts-time").html("00:00");
        $( "#talk-stops-time").html("00:00");
        $( "#interaction-stops-time").html("00:00");

        sendMessage("agent-speaking");
    }
}

$( "#interaction-starts-button" ).click(function() {
    manageInteractionStarts();
});

function manageInteractionStarts() {
    startInteraction = Date.now(); // - weStopTalking;
    updateText("Interaction starts: " + startInteraction);

    $('#beep-button').removeClass('next-button');
    $('#interaction-starts-button').removeClass('next-button');
    $('#talk-starts-button').addClass('next-button');    

    $( "#interaction-starts-time").html(msToTime(startInteraction));
    sendMessage("agent-listening");
}

$( "#talk-starts-button" ).click(function() {
    startTalking = Date.now(); // - weStopTalking;
    updateText("User starts talking: " + startTalking);
    $( "#talk-starts-time").html(msToTime(startTalking));

    $('#talk-stops-button').addClass('next-button');
    $('#talk-starts-button').removeClass('next-button');
});

$( "#talk-stops-button" ).click(function() {
    stopTalking = Date.now(); // - weStopTalking;
    updateText("User stops talking: " + stopTalking);
    $( "#talk-stops-time").html(msToTime(stopTalking));

    if (interactionWay === "Beep and wait") {
        $('#beep-button').addClass('next-button');
    } else {
        $('#interaction-stops-button').addClass('next-button');    
    }

    $('#talk-stops-button').removeClass('next-button');
});

$( "#interaction-stops-button" ).click(function() {
    manageInteractionStops();
});

function manageInteractionStops() {

    $('#agent-stops-button').addClass('next-button');
    $('#interaction-stops-button').removeClass('next-button');
    $('#beep-button').removeClass('next-button');

    console.log("manageInteractionStops");
    stopInteraction = Date.now(); // - weStopTalking;
    updateText("Interaction stops: " + stopInteraction + "\n");
    $( "#interaction-stops-time").html(msToTime(stopInteraction));
    sendMessage("idle");

}

$( "#setup-starts-button" ).click(function() {
    startSetup = Date.now();
    updateText("Setup starts: " + startSetup);
    $( "#setup-starts-time").html(msToTime(0));
});

$( "#setup-stops-button" ).click(function() {
    stopSetup = Date.now(); // - startSetup;
    updateText("Setup stops: " + stopSetup + "\n");
    $( "#setup-stops-time").html(msToTime(stopSetup));
});

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
  
    return hrs + ':' + mins + ':' + secs + ':' + ms;
}

function manageEvent(e){
    switch(e) {
        case "interaction-starts":
            if((interactionWay === "Touch" ) || (interactionWay === "Mouse" ) || (interactionWay === "Physical button" )) {
                console.log("manageEvent: " + e + " in " + interactionWay + " mode.");
                manageInteractionStarts();
            }
            break;
        case "interaction-stops":
            if ((interactionWay === "Touch" ) || (interactionWay === "Mouse" ) || (interactionWay === "Physical button" )) {
                console.log("manageEvent: " + e + " in " + interactionWay + " mode.");
                manageInteractionStops();
            }
            break;    
        default:
            //console.log("default branch");
            break;
    }
}

function updateText(t) {
    text += "\n";
    text += t;
}

function saveData() {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function () {
        var blob = new Blob([text], {type: "text/plain"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        var fileName = interactionWay + "-" + $("#input-name").val() + "-" + Date.now() + ".txt";
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}