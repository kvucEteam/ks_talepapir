var colors = ["#ffff99", " #acefed", "#d2d4ec", "#f2b9e1", "#d2d4ec", "#f6c0c0", "#acefed", "#e5c180", "#3ee180"];
var txt_selection;
var json_streng;
var pageX;
var pageY;

$(document).ready(function() {

    // alert(jsonData.tekst);

    enable_audio();
    generateHTML();

    $(".btn_tjek").click(tjeksvar);

    setInterval(function() {
        txt_selection = window.getSelection().toString();
        if (txt_selection.length < 65) {
            $(".txtudsnit").html(txt_selection);
        } else {
            $(".txtudsnit").html("MAX 65 tegn!");
        }
        //console.log(txt_selection)
    }, 100);

    $(document).bind('mousemove', function(e) {
        pageX = e.pageX;
        pageY = e.pageY;
    });

    $(".txtudsnit").click(function() {
        if (txt_selection.length > 0) {
            $(".udklips_container").prepend("<div class='udklips_ord btn btn-info '>" + txt_selection + "</div>");
        }
        $(".udklips_ord").eq(0).fadeOut(0);
        $(".udklips_ord").eq(0).fadeIn(200);

        $(".udklips_ord").draggable({
            "revert": "invalid"
        });
        //$(".draggable_text").css("left", pageX).css("top", pageY + 20);
    });

    $(".dropzone_skrald").droppable({
        drop: function(event, ui) {
            ui.draggable.fadeToggle("slow", function() {
                ui.draggable.remove();
            });

        }
    });

});

function generateHTML() {
    $(".txt_besvarelse").html(jsonData.tekst);
    $('#explanationWrapper').html(explanation(jsonData.explanation));
    $(".instr_container").html(instruction(jsonData.Instruktion));
}

function tjeksvar() {
    //alert(jsonData.kategorier);
    $(".udklips_ord").each(function(index) {
        var tekst = $(this).text().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
        console.log(tekst);
        var tekst_array = tekst.split(" ");
        console.log(tekst_array);

        //console.log(jsonData.kategorier.indexOf(tekst_array[0]));

        for (var i = 0; i < tekst_array.length; i++) {
            if (jsonData.kategorier.indexOf(tekst_array[i]) > -1) {
                $(this).addClass("btn-success").removeClass("btn-info");

                console.log("korrekt");
            } else {
                console.log("ikke korrekt");
            };
        }



    });
}
