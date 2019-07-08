const interactionWays = ["Natural", "Eye tracking", "Beep and wait", "Touch", "Mouse", "Physical button", "Activation word"];
var interactionWay;
var text = "";

$(document).ready(function () {
    console.log("Ready");

    interaction_form_creator();
    text += "New interaction way (" + interactionWay + ") at: " + Date.now();
    update();

});

$( "#agent-starts-button" ).click(function() {
    text += "\n" + "ISI starts speaking at: " + Date.now();
    update(); 
});

$( "#agent-stops-button" ).click(function() {
    text += "\n" + "ISI stops speaking at: " + Date.now(); 
    update();
});

$( "#interaction-starts-button" ).click(function() {
    text += "\n" + "Interaction starts at: " + Date.now();
    update(); 
});

$( "#interaction-stops-button" ).click(function() {
    text += "\n" + "Interaction stops at: " + Date.now(); 
    update();
});

$( "#user-starts-button" ).click(function() {
    text += "\n" + "User starts speaking at: " + Date.now();
    update();
});

$( "#user-stops-button" ).click(function() {
    text += "\n" + "User stops speaking at: " + Date.now(); 
    update();
});

$( "#setup-starts-button" ).click(function() {
    text += "\n" + "Setup starts speaking at: " + Date.now();
    update();
});

$( "#setup-stops-button" ).click(function() {
    text += "\n" + "Setup stops speaking at: " + Date.now();
    update();
});

$( "#undo-button" ).click(function() {
    var i = text.lastIndexOf("\n");
    text = text.substring(0, i);    
    update();
});

function update() {
    $('#console').html(text.trim().replace(/(\n)+/g, '</br>'));
}

function interaction_form_creator() {
    var result = "";
    result += "<select id = \"interaction-form\" class=\"form-control\">";
    var i;
    for (i = 0; i < interactionWays.length; i++) {
        var temp = "<option>" + interactionWays[i] + "</option>";
        result += temp;
    }

    result += "</select>";
    $("#interaction-form-container").append(result);
    interactionWay = $('#interaction-form').val();
    
    $("#interaction-form").change(function() {
        interactionWay = $('#interaction-form').val();     
        text += "\n" + "New interaction way (" + interactionWay + ") at: " + Date.now();
        update();
    });
}

$( "#drop-logging-button" ).click(function() {
    text = "";
    $("#name-input").val("");
    text += "\n" + "New interaction way (" + interactionWay + ") at: " + Date.now();
    update();
});

function saveData() {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function () {
        var blob = new Blob([text.trim() + "\n\n" + "Note:" + "\n" + $('#text-area').val().trim()], {type: "text/plain"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        var fileName = $("#name-input").val() + "-" + Date.now() + ".txt";
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}

$('#save-logging-button').click(function(e) {
    if (text !== "") {
        if ($("#name-input").val()) {
            var temp = saveData();
            temp();    
        } else {
            alert("Do not forget about the child name!");
        }    
    } else {
        alert("Nothing to be saved");
    }
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
