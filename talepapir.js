var colors = ["#ffff99", " #acefed", "#d2d4ec", "#f2b9e1", "#d2d4ec", "#f6c0c0", "#acefed", "#e5c180", "#3ee180"];
var txt_selection;
var json_streng;
var pageX;
var pageY;
var score = 0;
var step = 0;

$(document).ready(function() {

    // alert(jsonData.tekst);

    // enable_audio();
    generateHTML();

    $(".btn_transfer").click(transfer_text);
    $(".btn_tjek").click(tjeksvar);

    setInterval(function() {
        update_selection();
    }, 100);


    $(".dropzone_skrald").droppable({
        drop: function(event, ui) {
            ui.draggable.fadeToggle("slow", function() {
                ui.draggable.remove();
            });
        },
        hoverClass: 'dropping',
    });

});

function generateHTML() {
    $(".txt_besvarelse").prepend("<h4>" + jsonData.undersspm + "</h4>" + jsonData.tekst);
    //$('#explanationWrapper').html(explanation(jsonData.explanation));
    $(".instr_container").html(instruction(jsonData.Instruktion));

}

function update_selection() {
    txt_selection = window.getSelection().toString();
    if (txt_selection.length == 0) {
        $(".udklips_content").html("Marker et ord");
    } else if (txt_selection.length < 65) {
        $(".udklips_content").html("'" + txt_selection + "'");
    } else {
        $(".udklips_content").html("MAX 65 tegn!");
    }
}

function transfer_text() {
    var exist = false;

    $(".udklips_ord").each(function() {
        if ($(this).html() == txt_selection) {
            console.log("Den er der i forvejen!");
            exist = true;
        }
    });

    if (txt_selection.length > 0 && txt_selection.length < 65 && exist === false) {
        $(".udklips_container").prepend("<div class='udklips_ord btn btn-info '>" + txt_selection + "</div>");
        $(".udklips_ord").eq(0).fadeOut(0);
        $(".udklips_ord").eq(0).fadeIn(200);

        $(".udklips_ord").draggable({
            "revert": "invalid"
        });
    }
}


function tjeksvar() {
    score = 0;
    $(".udklips_ord").each(function(index) {
        var tekst = $(this).text().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
        var tekst_array = tekst.split(" ");

        for (var i = 0; i < tekst_array.length; i++) {
            if (jsonData.kategorier.indexOf(tekst_array[i]) > -1) {
                $(this).addClass("btn-success").removeClass("btn-info");
                //alert(tekst_array[i]);
                var old_html = $(this).html();
                var new_html = old_html.replace(tekst_array[i], tekst_array[i].toUpperCase());
                console.log(new_html);
                $(this).html(new_html);
                score++;
                updateScore();
            } else {

            };
        }
    });
}

function updateScore() {
    $(".QuestionCounter").html(score + " ud af " + jsonData.kategorier.length);
}
