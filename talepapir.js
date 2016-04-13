var colors = ["#ffff99", " #acefed", "#d2d4ec", "#f2b9e1", "#d2d4ec", "#f6c0c0", "#acefed", "#e5c180", "#3ee180"];
var txt_selection;
var json_streng;
var pageX;
var pageY;
var score = 0;
var step = 0;
var korrekt_Array = [];

$(document).ready(function() {

    // alert(jsonData.tekst);

    // enable_audio();

    init();


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

function init() {
    for (var i = 0; i < jsonData.kategorier.length; i++) {
        korrekt_Array.push(jsonData.kategorier[i]);
        //alert("hej");
    }
    //alert(korrekt_Array);
};

function update_selection() {
    txt_selection = window.getSelection().toString();
    if (txt_selection.length == 0) {
        $(".udklips_content").html("Markér ord i teksten");
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
        } else {

        }
    });

    if (txt_selection.length > 0 && txt_selection.length < 65 && exist === false) {
        $(".udklips_container").append("<div class='udklips_ord btn btn-info '>" + txt_selection + "</div>");
        $(".udklips_ord").eq(0).fadeOut(0);
        $(".udklips_ord").eq(0).fadeIn(200);

        $(".udklips_container").sortable({});

        $(".udklips_ord").eq($(".udklips_ord").length - 1).click(function() {
            editudklips_ord($(this));
        })
    }
}


function editudklips_ord(obj) {
    console.log("clicked");
    var old_text = obj.text();
    var indeks = obj.index();
    //alert(indeks);
    $(".udklips_ord").off("click");

    $(".udklips_ord").eq(indeks).html("<input type='text' class='edit_field' value='" + old_text + "'>");

    $(".edit_field").focus();

    $(".edit_field").focusout(function() {
        console.log("FOCUSOUT");
        var new_text = $(".edit_field").val();
        $(".edit_field").remove();

        $(".udklips_ord").eq(indeks).html(new_text);
        $(".udklips_ord").click(function() {
            editudklips_ord($(this));
        })
        tjeksvar();
    });


}



function tjeksvar() {
    score = 0;
    $(".udklips_ord").each(function(index) {

        console.log("indeks: " + index)

        var tekst = $(this).text().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
        var tekst = tekst.replace("<span class='label label-success'>", "");
        var tekst = tekst.replace("</span>", "");

        var tekst_array = tekst.split(" ");

        for (var i = 0; i < tekst_array.length; i++) {
            console.log("looper indeks:" + index + "tekst_array: " + i);
            if (korrekt_Array.indexOf(tekst_array[i]) > -1) {
                //$(this).addClass("btn-success").removeClass("btn-info");
                //alert(tekst_array[i]);
                var old_html = tekst;
                var new_html = old_html.replace(tekst_array[i], "<span class='label label-success'>" + tekst_array[i] + "</span>");
                console.log(new_html);
                $(this).html(new_html);
                //korrekt_Array.splice(index, 1);
                //score++;
                updateScore();
            } else {

            };
        }
    });
}

function updateScore() {
    $(".QuestionCounter").html(score + " ud af " + jsonData.kategorier.length);
}
