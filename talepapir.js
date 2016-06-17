var colors = ["#ffff99", " #acefed", "#d2d4ec", "#f2b9e1", "#d2d4ec", "#f6c0c0", "#acefed", "#e5c180", "#3ee180"];
var txt_selection;
var json_streng;
var pageX;
var pageY;
var score = 0;
var step = 0;
var korrekt_Array = [];
var score_Array = [];
var edit_mode = false;
// HTML konverteret til "WORD format"
// Gem fil som "Debat.docx"

$(document).ready(function() {

    init();

    safariWarning();

    generateHTML();

    rotateCheck();

    updateScore();

    $(".btn_transfer").click(transfer_text);
    $(".btn_tjek").click(tjeksvar);
    $(".btn_feedback").click(feedback);
    $(".btn_word").click(downloadWord);

    $(document).keydown(function(e) {
        if (e.keyCode == 13) {
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

    //Hvis man er i frit mode, kan man selv kopiere text til textholderen og så arbejde med den: 
    if (jsonData.opgavetype == "fri") {
        fri_opgave();
    }
});

function generateHTML() {
    $(".txt_besvarelse").prepend("<h4>" + jsonData.undersspm + "</h4>" + jsonData.tekst);
    $('#explanationWrapper').html(explanation(jsonData.explanation));
    $(".instr_container").html(instruction(jsonData.Instruktion));
    $(".right_wrapper").css("height", $(".left_wrapper").height() + "px");
    $(".inst_wrapper, .right_wrapper, h1, .txtudsnit").addClass("noselect");

}

function init() {
    for (var i = 0; i < jsonData.kategorier.length; i++) {
        korrekt_Array.push(jsonData.kategorier[i]);
        //alert("hej");
    }


    //$(".btn_feedback").fadeOut(0);
    $(".btn_word").fadeOut(0);
    //alert(korrekt_Array);
};

function update_selection() {
    if (edit_mode == false) {
        txt_selection = window.getSelection().toString();
        if (txt_selection.length == 0) {
            $(".udklips_content").html("De ord, som du markerer, står her").css("color", "#aaa");
        } else if (txt_selection.length < 65) {
            $(".udklips_content").html("'" + txt_selection + "'").css("color", "#000");
        } else {
            $(".udklips_content").html("Du kan maksimalt markere 65 tegn!").css("color", "red");
        }
    }
}

function transfer_text() {
    var exist = false;
    $(".udklips_ord").each(function() {
        if ($(this).text() == txt_selection) {
            console.log("Den er der i forvejen!");
            exist = true;
        }

    });

    if (txt_selection.length > 1 && txt_selection.length < 65 && exist === false) {
        $(".udklips_container").append("<div class='inner_container'><div class='udklips_ord btn btn-info '>" + txt_selection + "</div><div class='edit_btn glyphicon glyphicon-pencil'></div><div class='edit_btn glyphicon glyphicon-trash'></div>");
        $(".glyphicon-trash").hide();
        $(".udklips_ord").eq($(".udklips_ord").length - 1).fadeOut(0);
        $(".udklips_ord").eq($(".udklips_ord").length - 1).fadeIn(200);

        $(".udklips_container").sortable({
            containment: "parent",
            sortAnimateDuration: 500,
            sortAnimate: true,
            distance: 25
        });

        $(".udklips_ord").off("click");
        $(".edit_btn").off("click");

        $(".udklips_ord").click(function() {
            console.log("clicked u_ord");
            var indeks = $(this).parent().index();
            editudklips_ord($(this), indeks);
        });

        $(".edit_btn").click(function() {
            console.log("edit");
            editudklips_ord($(this).parent().find(".udklips_ord"));
        });
    }

    tjeksvar();
}

function editudklips_ord(obj, indeks) {

    $(".udklips_container").sortable("disable");

    var old_text = obj.text();
    var indeks = obj.index();
    console.log("Indeks: " + indeks + " old_text: " + old_text);

    obj.off("click");

    obj.html("<input type='text' class='edit_field' value='" + old_text + "'>"); //<div class='edit_btn glyphicon glyphicon-trash'></div>");
    obj.parent().find(".glyphicon-pencil").hide(); //switchClass("glyphicon-pencil", "glyphicon-trash");
    obj.parent().find(".glyphicon-trash").show();
    $(".edit_field").focus();

    $(".edit_field").focusout(function() {
        var new_text = $(".edit_field").val();

        obj.html(new_text); // + "<div class='edit_btn glyphicon glyphicon-pencil'></div>");
        obj.parent().find(".glyphicon-pencil").show();
        obj.parent().find(".glyphicon-trash").hide();

        $(".udklips_container").sortable("enable");

        obj.click(function() {
            var detteindeks = $(this).index();
            console.log("detteindeks:  " + detteindeks);
            console.log("clicked editudklips_orig");
            editudklips_ord($(this));
        })

        tjeksvar();
        obj.off("focusout");
    });

    $(".glyphicon-trash").mousedown(function() {
        var indeks = $(this).parent().index();
        console.log("parent-indeks: " + indeks);
        deleteCallOut(indeks);
        $(".udklips_ord").off("click");
        $(".edit_btn").off("click");
        console.log("clicked_trash");

    });

}




function deleteCallOut(indeks) {
    $(".inner_container").eq(indeks).addClass("readyfordelete");
    $(".inner_container").css("opacity", ".4");
    $(".inner_container").eq(indeks).css("opacity", "1");
    //$(".inner_container").eq(indeks).find(".glyphicon-trash").show();
    //$(".inner_container").eq(indeks).find(".edit_btn").switchClass("glyphicon-pencil", "glyphicon-trash");
    $(".inner_container").eq(indeks).prepend("<div class='label label-primary deleteCallOut'><h5>Slet?</h5></div><span class='glyphicon glyphicon-arrow-down'></span>");
    $(".inner_container").eq(indeks).find(".glyphicon-trash").addClass("readyfordelete");


    $(".deleteCallOut").click(function() {
        $(this).parent().remove();
        $(".deleteCallOut").off("click");
        $(".inner_container").css("opacity", "1");

    });

    //

    $(':not(.readyfordelete)').click(function() {
        console.log("clicked elsewhere");
        //$(':not(.readyfordelete)').off("click");
    });


    $(document).click(function(e) {
        if ($(e.target).closest('.readyfordelete').length === 0) {
            console.log("clicked_elsewhere");
            $(".deleteCallOut").remove();
            $(".glyphicon-arrow-down").remove();
            $(".glyphicon-trash").removeClass("readyfordelete");
            //$(".edit_btn").switchClass("glyphicon-trash", "glyphicon-pencil");
            $(".readyfordelete, .deleteCallOut").off("click");
            $(document).off("click");
            $(".glyphicon-trash").unbind("click");
            $(".inner_container").css("opacity", "1");
            $(".edit_btn").css("-webkit-user-select", "none");

            $(".udklips_ord").off("click");
            $(".edit_btn").off("click");


            $(".udklips_ord").click(function() {
                var indeks = $(this).parent().index();
                editudklips_ord($(this), indeks);
            });

            $(".edit_btn").click(function() {
                editudklips_ord($(this).parent().find(".udklips_ord"));
            });
        }
        //$(document).off("click");
    });



}



function tjeksvar() {
    score = 0;
    $(".udklips_ord").each(function(index) {
        console.log("indeks: " + index)
        var tekst = $(this).text().replace(/[.,\/#!$%\^\*:{}=\-_`~()]/g, ""); //.toLowerCase();
        var tekst = tekst.replace("<span class='sucesslabel label label-success'>", "");
        var tekst = tekst.replace("</span>", "");

        var old_html = tekst;
        for (var i = 0; i < jsonData.kategorier.length; i++) {
            //console.log(jsonData.kategorier[i]);

            if (tekst.indexOf(jsonData.kategorier[i]) > -1) {
                console.log("Kategori match:" + jsonData.kategorier[i])
                    // Add til korrekt_Array:

                if (score_Array.indexOf(jsonData.kategorier[i]) < 0) {
                    score_Array.push(jsonData.kategorier[i]);
                }

                old_html = old_html.replace(jsonData.kategorier[i], "<span class='sucesslabel label label-success'>" + jsonData.kategorier[i] + "</span>");
                console.log("new html: " + old_html);
                $(this).html(old_html);
                updateScore();
            }
        }

    });
}

function updateScore() {
    $(".QuestionCounter").html(score_Array.length + " ud af " + jsonData.kategorier.length);
 if (score_Array.length > jsonData.kategorier.length / 2) {
    $(".btn_word").fadeIn(200);
 }
}

function feedback() {

    if (score_Array.length > jsonData.kategorier.length / 2) {
        UserMsgBox("body", "<h3>Du har fundet " + score_Array.length + " ud af " + jsonData.kategorier.length + " vigtige ord i prosa teksten.</h3><p>" + jsonData.slutfeedback + "</p>");
    } else {
        UserMsgBox("body", "<h3>Du har fundet " + score_Array.length + " ud af " + jsonData.kategorier.length + " vigtige ord i prosa teksten.</h3><p>Du skal finde mere en halvdelen af de korrekte ord for at downloade dit talepapir.</p>");

    }

}


function downloadWord() {
    var HTML = wordTemplate(); // HTML markup fra min template
    var converted = htmlDocx.asBlob(HTML);
    saveAs(converted, 'Talepapir.docx');
}
/*
function wordTemplate() {
var JS = jsonData.studentSelectedProblems[jsonData.selectedIndexNum];
var keyProblem = jsonData.keyProblems[JS.selcNo].name;
var HTML = '';
HTML += '<!DOCTYPE html>';
HTML += '<html>';
HTML += '<head>';
HTML += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';  // Fixes issue with danish characters on Internet Explore 
HTML += '<style type="text/css">';
HTML += 'body {font-family: arial}';
HTML += 'h1 {text-align: center; padding: 25px; background-color: #45818E; color: #FFF}';
HTML += 'h2 {}';
HTML += 'h3 {font-style: italic; color: #717272}';
HTML += 'h4 {color: #56bfc5}';
HTML += 'h5 {}';
HTML += 'h6 {}';
HTML += '.selected {color: #56bfc5; width: 25%}';
HTML += 'p {font-size: 14px; margin-bottom: 5px}';
HTML += 'table {width:60%; margin-left:70px}';
HTML += 'td {padding:50px 50px 50px 50px}';
HTML += 'ol {color: #000}';
HTML += '.checkQuestion{background-color: #D0E0E3; padding: 1px 10px 10px 10px; margin-bottom: 10px}';
HTML += '.useMaterial{background-color: #FFD966; padding: 1px 10px 10px 10px; margin-bottom: 10px}';
HTML += '.innerSpacer{margin: 10px}';
HTML += '</style>';
HTML += '</head>';
HTML += '<body>';
HTML += '<h1>'+keyProblem+'</h1>';
// HTML += '<hr/>';

HTML += '<h2>Problemformulering</h2> ';
HTML += '<p>'+JS.problemFormulationMem[JS.problemFormulationMem.length - 1]+'</p>';

// HTML += '<hr/>';

HTML += '<h2>Underspørgsmål</h2> ';
HTML += '<ol>';
for (var n in JS.subQuestionArray){
HTML += '<li>'+JS.subQuestionArray[n]+'</li>';
}
HTML += '</ol>';

HTML += '<h2>Tjekspørgsmål til problemformuleringen:</h2> '; 
HTML += '<div><table class="checkQuestion">';
// HTML += '<div class="innerSpacer">';
HTML += '<tr><td><p><b>Rød tråd:</b> Hænger problemformulering og underspørgsmål sammen? Dvs. kan problemformuleringen besvares ved hjælp af underspørgsmålene? Og er der en sammenhæng mellem underspørgsmålene?</p>';
HTML += '<p><b>Taksonomi:</b> Lægger problemformuleringen op til undersøgelse, diskussion og vurdering - dvs. ikke kun til redegørelse?</p>';
HTML += '<p><b></tr></td>Tværfaglighed:</b> Kan viden fra historie, religion og samfundsfag inddrages i den samlede besvarelse af problemformulering og underspørgsmål?</p>';
// HTML += '</div>';
HTML += '</table></di>';

HTML += '<div class="useMaterial">';
HTML += '<p><b>Anvendelse af materiale:</b> Til KS-eksamen er det vigtigt, at spørgsmålene også lægger op til at inddrage det udleverede materiale i besvarelsen!</p>';
HTML += '</div>';

// Anvendelse af materiale: Til KS-eksamen er det vigtigt, at spørgsmålene også lægger op til at inddrage det udleverede materiale i besvarelsen!


HTML += '</body>';
HTML += '</html>';
// document.write(HTML);
return HTML;
}
*/
function wordTemplate() {
    var HTML = '';
    HTML += '<!DOCTYPE html>';
    HTML += '<html>';
    HTML += '<head>';
    HTML += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'; // Fixes issue with danish characters on Internet Explore 
    HTML += '<style type = "text/css" >';
    HTML += 'body {font-family: arial}';
    HTML += 'h1 {}';
    HTML += 'h2 {}';
    HTML += 'h3 {color: #333}';
    HTML += 'h4 {color: #56bfc5}';
    HTML += 'h5 {}';
    HTML += 'h6 {}';
    HTML += '.selected {color: #56bfc5; width: 25%}';
    HTML += 'p {font-size: 14px; margin-bottom: 5px}';
    HTML += 'table {width:95%; margin-left:12px}';
    HTML += 'td {padding:10px 10px 10px 10px}';
    HTML += 'ol {color: #000}';
    HTML += '.checkQuestion{background-color: #acefed; padding: 10px 10px 10px 10px; margin-bottom: 25px}'; // g2
    HTML += '.useMaterial{background-color: #d2d4ec; padding: 10px 10px 10px 10px; margin-bottom: 25px}'; // e2
    HTML += '.innerSpacer{margin: 10px}';
    HTML += '.spacer{}';
    HTML += '</style>';
    HTML += '</head>';
    HTML += '<body>';
    HTML += '<h1>Talepapir</h1>';
    HTML += '<h3>Prosatekst:</h3>';
    HTML += '<table class="checkQuestion"><tr><td><p>' + $(".txt_besvarelse").text() + '</p></tr></td>';
    HTML += '</table>';
    HTML += '<h3>Dine stikord og stikordsagtige sætninger: </h3>';
    HTML += '';

    HTML += '<ol>';
    for (var i = 0; i < $(".udklips_ord").length; i++) {
        HTML += '<li>' + $(".udklips_ord").eq(i).html() + '</li>';
    }
    HTML += '</ol>';

    HTML += ''
    HTML += '</body>';
    HTML += '</html>';
    // document.write(HTML);
    return HTML;
}

/////////////////////////////////////////////////////////////
////////// FRI OPGAVE VARATION HERUNDER: ////////////////////

function fri_opgave() {
    $(".scoreText, .QuestionCounter").fadeOut(0);
    $(".btn_feedback").hide();
    $(" .btn_word").fadeIn(0);
    $(".right_wrapper").prepend("<div class='btn btn-lg btn-info btn_edit'>Indsæt din egen tekst<span style='margin-left:20px; font-size:1.4em; color:#888' class='glyphicons glyphicons-paste'></span></div>")
    $(".btn_edit").click(edit_textfield);
    $(".txt_besvarelse").html("Når du skriver eller indsætter din egen tekst, optræder den her....").css("color", "#ccc");
    $(".score_container").css("background-color", "transparent").css("padding-left", " 0px");
    $(".udklips_content, .btn_transfer").css("opacity", ".1");

}

function edit_textfield() {
    console.log("editing_field");

    $(".txt_besvarelse").css("color", "black");

    var old_tekst = $(".txt_besvarelse").html();
    var regex = /<br\s*[\/]?>/gi;
    old_tekst = old_tekst.replace(regex, "\n");
    console.log("old_tekst: " + old_tekst);
    edit_mode = true;

    $(".txt_besvarelse").html("<textarea>" + old_tekst + "</textarea>");


    $("textarea").focus();

    $("textarea").focusout(function() {
        edit_mode = false;

        var input_text = $("textarea").val();

        var input_text = input_text.replace(/[\n]/g, '<br/>');

        console.log("input_text:" + input_text);
        $(".txt_besvarelse").html(input_text + "");
        $(".udklips_content, .btn_transfer").css("opacity", "1")
    });

}

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
