const interactionWays = ["Natural", "Eye tracking", "Beep and wait", "Touch", "Mouse", "Physical button", "Activation word"];
var interactionWay;

$( document ).ready(function() {
    interaction_form_creator();
});

function interaction_form_creator() {
    var result = "";
    result += "<select id = \"interaction-form\" class=\"form-control\">";
    var i;
    for (i = 0; i < interactionWays.length; i++) {
        var temp = "<option>" + interactionWays[i] + "</option>";
        result += temp;
    }
    result += "</select><br/>";    
    $("#interaction-form-container").append(result);

    interactionWay = $('#interaction-form').val();
    $( "#interaction-form").change(function() {
        interactionWay = $('#interaction-form').val();     

        if (interactionWay === "Beep and wait") {
            $('#beep-button-col').show();
        } else {
            $('#beep-button-col').hide();
        }
    });
}

$( "#listening-button" ).click(function() {
    $( "#status" ).html("User is speaking");
    $( "#chat" ).html("");
    sendMessage("agent-listening");
});

$( "#speaking-button" ).click(function() {
    $( "#status" ).html("ISI is speaking");
    $( "#chat" ).html("");
    sendMessage("agent-speaking");
});

$( "#idle-button" ).click(function() {
    $( "#status" ).html("Idle");
    $( "#chat" ).html("");
    sendMessage("idle");
});


$( "#beep-button" ).click(function() {
    sendMessage("beep");
});

$( "#reset-button" ).click(function() {
    resetAvatar();
});

$( "#share-button" ).click(function() {
    sendMessage(link);
});

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

function manageInteractionStarts() {
    $( "#chat" ).html("User wants to speak!!");
}

function manageInteractionStops() {
    $( "#chat" ).html("User wants to stop speaking!!!");
}