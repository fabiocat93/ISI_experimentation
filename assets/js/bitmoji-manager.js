// holds the part of the preview avatar url that is the same for all combinations
const basePreviewUrl = "https://preview.bitmoji.com/avatar-builder-v3/preview/";

// holds the part of the cpanel avatar url that is the same for all comics
const baseCpanelUrl = "https://render.bitstrips.com/v2/cpanel/";

// holds the part of the render avatar url that is the same for all comics
const baseRenderUrl = "https://render.bitstrips.com/render/";

// holds all possible genders and their values
const genders = [1, 2];

// holds all possible perspectives and their values
const perspectives = [0
    //, 1, 7
];
var perspective = null;

// holds all possible avatar poses
const poses = ["head"
    //, "body", "fashion"
];
var pose = null;

// holds all possible styles and their values
//const styles = [["bitstrips",1],["bitmoji",4],["cm",5]];
const styles = [5
    //, 1, 4
];
var style = null;

var bitmoji;
var categories;

// bitmoji avatar ids
var id1 = null;
var id2 = null;

var link = "";

$(document).ready(function () {
    resetAvatar();
});



function resetAvatar() {
    $.getJSON("./assets/extra/assets.json", function (data) {
        console.log(data);
        bitmoji = data;
        style_form_creator();
        pose_form_creator();
        perspective_form_creator();
        gender_form_creator();
    });
}

function form_creator(parent, name, list_of_options, label_of_options) {
    if (label_of_options) {
        var result = "<h3>" + name + "</h3>";
        result += "<select id = \"" + name + "-form\" class=\"form-control\">";
        var i;
        for (i = 0; i < list_of_options.length; i++) {
            var temp = "<option value=" + list_of_options[i] + ">" + label_of_options[i] + "</option>";
            result += temp;
        }

        result += "</select><br/>";

        $(parent).append(result);
    } else {
        var result = "<h3>" + name + "</h3>";
        result += "<select id = \"" + name + "-form\" class=\"form-control\">";
        var i;
        for (i = 0; i < list_of_options.length; i++) {
            var temp = "<option>" + list_of_options[i] + "</option>";
            result += temp;
        }

        result += "</select><br/>";

        $(parent).append(result);
    }

}

function pose_form_creator() {
    var container = "<div id=\"pose-container\"> </div>"
    $('#style-dependent-div').append(container);

    form_creator("#pose-container", "poses", poses, 0);
    pose = $('#poses-form').val();

    $("#poses-form").change(function () {
        pose = $('#poses-form').val();
        update_image();
    });
}

function style_form_creator() {
    var container = "<div id=\"style-container\"> </div>"
    $('#features-column').append(container);
    form_creator("#style-container", "styles", styles, 0);
    style = $('#styles-form').val();
    var result = "<div id=\"style-dependent-div\"></div>";
    $('#features-column').append(result);

    $("#styles-form").change(function () {
        style = $('#styles-form').val();
        $('#style-dependent-div').empty();
        pose_form_creator();
        perspective_form_creator();
        gender_form_creator();
    });
}

function perspective_form_creator() {
    var container = "<div id=\"perspective-container\"> </div>"
    $('#style-dependent-div').append(container);
    form_creator("#perspective-container", "perspectives", perspectives, 0);
    perspective = $('#perspectives-form').val();

    $("#perspectives-form").change(function () {
        perspective = $('#perspectives-form').val();
        update_image();
    });
}

function gender_form_creator() {
    form_creator("#style-dependent-div", "gender", ["male", "female"], 0);
    var result = "<div id=\"gender-dependent-div\"></div>";
    $('#style-dependent-div').append(result);

    $("#gender-form").change(function () {
        var value = $('#gender-form').val();
        $('#gender-dependent-div').empty();

        if (value === "male") {
            if (style === "1") {
                categories = bitmoji.traits.male.bitstrips.categories;
            } else if (style === "4") {
                categories = bitmoji.traits.male.bitmoji.categories;
            } else {
                categories = bitmoji.traits.male.cm.categories;
            }
            features_creator();
        } else {
            if (style === "1") {
                categories = bitmoji.traits.female.bitstrips.categories;
            } else if (style === "4") {
                categories = bitmoji.traits.female.bitmoji.categories;
            } else {
                categories = bitmoji.traits.female.cm.categories;
            }
            features_creator();
        }

        update_image();
    });

    $("#gender-form").trigger('change');
}

function features_creator() {
    var i;
    for (i = 0; i < categories.length; i++) {
        var j;
        var values = [];
        var labels = [];
        for (j = 0; j < categories[i].options.length; j++) {
            values.push(categories[i].options[j].value);
            labels.push(categories[i].options[j].label)
        }

        var container = "<div id=\"" + categories[i].key + "-container\"> </div>"
        $('#gender-dependent-div').append(container);
        form_creator("#" + categories[i].key + "-container", categories[i].key, values, labels);

        //console.log(categories[i].key);

        $("#" + categories[i].key + "-form").change(function () {
            update_image();
        });
    }

}

function update_image() {
    link = generate_link();
    var code = "<img id=\"avatar-image\" src=\"" + link + "\">";
    $("#image-column").empty();
    $("#image-column").append(code);
}

function generate_link() {
    var scale = "1";
    var result = "";
    result += basePreviewUrl;
    result += pose;
    result += "?scale=" + scale;
    result += "&gender=" + get_gender_value();
    result += "&style=" + get_style_value();
    result += "&rotation=" + perspective;

    var i;
    for (i = 0; i < categories.length; i++) {
        result += "&" + categories[i].key + "=" + get_form_value(categories[i].key);
    }

    //result += "&outfit=990491";

    console.log(result);
    getAvatarId(result);
    return result;
}


function get_form_value(name) {
    var value = $('#' + name + '-form').val();
    return value;
}

function get_gender() {
    var value = $('#gender-form').val();
    return value;
}

function get_gender_value() {
    var value = $('#gender-form').val();
    if (value === "male") {
        return 1;
    } else {
        return 2;
    }
}

function get_style_value() {
    var value = $('#styles-form').val();
    return value;
}

function getAvatarId(url) {
    console.log(url.split('-').slice(1, 3).join('-'));
    return url.split('-').slice(1, 3).join('-');
};

//https://github.com/JoshCheek/bitmoji
//https://github.com/matthewnau/randmoji


// to do: 
/*
- outfits
*/

// Starting point (just the simple round face)
// https://preview.bitmoji.com/avatar-builder-v3/preview/head?scale=1&gender=1&style=1&rotation=0&beard=-1&brow=-1&cheek_details=-1&ear=-1&earring=-1&eye=-1&eyelash=-1&eye_details=-1&face_lines=-1&glasses=-1&hair=490&hat=-1&jaw=185&mouth=-1&nose=-1&pupil=-1&beard_tone=-1&blush_tone=-1&brow_tone=-1&eyeshadow_tone=-1&hair_tone=-1&lipstick_tone=-1&pupil_tone=-1&skin_tone=-1&body=0&face_proportion=0

// fabio's avatar
// https://preview.bitmoji.com/avatar-builder-v3/preview/head?scale=1&gender=1&style=5&rotation=0&beard=1643&brow=1541&cheek_details=-1&ear=1428&eye=1615&eyelash=-1&eye_details=1347&face_lines=-1&glasses=-1&hair=1323&hat=-1&jaw=1401&mouth=2337&nose=1475&beard_tone=0&blush_tone=7255190&brow_tone=0&eyeshadow_tone=-1&hair_tone=2039326&hair_treatment_tone=-1&lipstick_tone=-1&pupil_tone=8404014&skin_tone=14718554&body=0&face_proportion=16&eye_spacing=1&eye_size=0