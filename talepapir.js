var colors = ["#ffff99", " #acefed", "#d2d4ec", "#f2b9e1", "#d2d4ec", "#f6c0c0", "#acefed", "#e5c180", "#3ee180"];
var txt_selection;
var json_streng;
var pageX;
var pageY;
var score = 0;
var step = 0;
var korrekt_Array = [];
var score_Array=[];

$(document).ready(function() {
    //$("h1").html($("body").width() + "px");

    // alert(jsonData.tekst);

    // enable_audio();

    init();


    generateHTML();

    updateScore();

    $(".btn_transfer").click(transfer_text);
    $(".btn_tjek").click(tjeksvar);
    $(".btn_feedback").click(feedback);

    $(document).keydown(function (e){
    if(e.keyCode == 13){
        transfer_text();
        $(".edit_field").focusout();
    }
})

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
    $('#explanationWrapper').html(explanation(jsonData.explanation));
    $(".instr_container").html(instruction(jsonData.Instruktion));
    $(".right_wrapper").css("height", $(".left_wrapper").height()+"px");
}

function init() {
    for (var i = 0; i < jsonData.kategorier.length; i++) {
        korrekt_Array.push(jsonData.kategorier[i]);
        //alert("hej");
    }

    $(".btn_feedback").fadeOut(0);
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

    tjeksvar();
}


function editudklips_ord(obj) {
    console.log("clicked");
    $(".udklips_container").sortable("disable");

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
         $(".udklips_container").sortable("enable");

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
        var tekst = tekst.replace("<span class='sucesslabel label label-success'>", "");
        var tekst = tekst.replace("</span>", "");

        var tekst_array = tekst.split(" ");

        for (var i = 0; i < tekst_array.length; i++) {
            console.log("looper indeks:" + index + "tekst_array: " + i);
            if (korrekt_Array.indexOf(tekst_array[i]) > -1) {

                // Add til korrekt_Array:
                if (score_Array.indexOf(tekst_array[i])<0){
                    score_Array.push(tekst_array[i]);
                }
            console.log("score_Array: ",score_Array);

                //$(this).addClass("btn-success").removeClass("btn-info");
                //alert(tekst_array[i]);
                var old_html = tekst;
                var new_html = old_html.replace(tekst_array[i], "<span class='sucesslabel label label-success'>" + tekst_array[i] + "</span>");
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
    $(".QuestionCounter").html(score_Array.length + " ud af " + jsonData.kategorier.length);
    if(score_Array.length>0){
        $(".btn_feedback").fadeIn(100);
    }
}

function feedback(){
    UserMsgBox("body", "<h3>Du har fundet " + score_Array.length + " vigtige ord i prosa teksten.</h3><p>En masse mere feedback her: </p> <p>Man kan fremad se, at de har været udset til at læse, at der skal dannes par af ligheder. Dermed kan der afsluttes uden løse ender, og de kan optimeres fra oven af at formidles stort uden brug fra presse. I en kant af landet går der blandt om, at de vil sætte den over forbehold for tiden. Vi flotter med et hold, der vil rundt og se sig om i byen. Det gør heller ikke mere. Men hvor vi nu overbringer denne størrelse til det den handler om, så kan der fortælles op til 3 gange. Hvis det er træet til dit bord der får dig op, er det snarere varmen over de andre. Selv om hun har sat alt mere frem, og derfor ikke længere kan betragtes som den glade giver, er det en nem sammenstilling, som bærer ved i lang tid. Det går der så nogle timer ud, hvor det er indlysende, at virkeligheden bliver tydelig istandsættelse. Det er opmuntrende og anderledes, at det er dampet af kurset i morgen. Der indgives hvert år enorme strenge af blade af større eller mindre tilsnit.</p>");
        
}
