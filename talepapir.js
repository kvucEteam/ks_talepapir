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
    //$("h1").html($("body").width() + "px");

    // alert(jsonData.tekst);

    // enable_audio();

    init();

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


    //txt_selection = "Tester løs";
    //transfer_text();
    //
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


    $(".btn_feedback").fadeOut(0);
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
        } else {

        }

    });

    if (txt_selection.length > 0 && txt_selection.length < 65 && exist === false) {
        $(".udklips_container").append("<div class='inner_container'><div class='udklips_ord btn btn-info '>" + txt_selection + "</div><div class='edit_btn glyphicon glyphicon-pencil'></div>");
        $(".udklips_ord").eq(0).fadeOut(0);
        $(".udklips_ord").eq(0).fadeIn(200);

        $(".udklips_container").sortable({
            containment: "parent",
            sortAnimateDuration: 500,
            sortAnimate: true,
            distance: 25
        });

        $(".udklips_ord").click(function() {
            editudklips_ord($(this));
        })

        $(".edit_btn").click(function() {
            editudklips_ord($(this).parent().find(".udklips_ord"));
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

    obj.html("<input type='text' class='edit_field' value='" + old_text + "'>"); //<div class='edit_btn glyphicon glyphicon-trash'></div>");

    obj.parent().find(".edit_btn").switchClass("glyphicon-pencil", "glyphicon-trash");
    $(".edit_field").focus();

    $(".edit_field").focusout(function() {
        console.log("FOCUSOUT");
        var new_text = $(".edit_field").val();
        $(".edit_field").remove();

        obj.html(new_text); // + "<div class='edit_btn glyphicon glyphicon-pencil'></div>");
        obj.parent().find(".edit_btn").switchClass("glyphicon-trash", "glyphicon-pencil");

        $(".udklips_container").sortable("enable");

        $(".udklips_ord").click(function() {
            editudklips_ord($(this));
        })
        tjeksvar();
    });

    $(".glyphicon-trash").click(function() {
        var indeks = $(this).parent().index();
        console.log("parent-indeks: " + indeks);
        deleteCallOut(indeks);
        console.log("clicked_trash");
        //$(".glyphicon-trash").off("click");
    });

}


function deleteCallOut(indeks) {
    //$(".inner_container").eq(indeks).addClass("readyfordelete");
    $(".inner_container").css("opacity", ".4");
    $(".inner_container").eq(indeks).css("opacity", "1");

    $(".inner_container").eq(indeks).find(".edit_btn").switchClass("glyphicon-pencil", "glyphicon-trash");
    $(".inner_container").eq(indeks).prepend("<div class='label label-primary deleteCallOut'><h5>Slet?</h5></div><span class='glyphicon glyphicon-arrow-down'></span>");
    $(".inner_container").eq(indeks).find(".glyphicon-trash").addClass("readyfordelete");
    $(".deleteCallOut").click(function() {
        $(this).parent().remove();
        $(".deleteCallOut").off("click");
        $(".inner_container").css("opacity", "1");

    });

    //

    /*$(':not(.readyfordelete)').click(function(){
console.log("clicked elsewhere");
    });*/


    $(document).click(function(e) {
        if ($(e.target).closest('.readyfordelete').length === 0) {
            console.log("clicked_elsewhere");
            $(".deleteCallOut").remove();
            $(".glyphicon-arrow-down").remove();
            $(".glyphicon-trash").removeClass("readyfordelete");
            $(".edit_btn").switchClass("glyphicon-trash", "glyphicon-pencil");
            $(".readyfordelete, .deleteCallOut").off("click");
            $(document).off("click");
            $(".inner_container").css("opacity", "1");
        }

    });

}

/*function editudklips_ord(obj) {
    console.log("clicked_container");
    $(".udklips_container").sortable("disable");

    var old_text = obj.text();
    var indeks = obj.index();
    console.log("indeks: "  + indeks + " old_text: " + old_text);
    //$(".udklips_ord").off("click");

    $(".udklips_ord").eq(indeks).html("<input type='text' class='edit_field' value='" + old_text + "'><div class='edit_btn glyphicon glyphicon-trash'></div>");

    $(".edit_field").focus();

    $(".edit_field").focusout(function() {
        console.log("FOCUSOUT");
        var new_text = $(".edit_field").val();
        $(".edit_field").remove();

        $(".udklips_ord").eq(indeks).html(new_text + "<div class='edit_btn glyphicon glyphicon-pencil'></div>");
        $(".udklips_container").sortable("enable");

        $(".udklips_ord").click(function() {
            editudklips_ord($(this));
        })
        tjeksvar();
    });

    $(".edit_btn").click(function(e) {
    	 e.stopPropagation();
        console.log("clicked_trash");
    })


    /////////////////////////////
    //////////////Trash it! ////



}*/



/*function tjeksvar() {
    score = 0;
    $(".udklips_ord").each(function(index) {
        console.log("indeks: " + index)
        var tekst = $(this).text().replace(/[.,\/#!$%\^\*:{}=\-_`~()]/g, ""); //.toLowerCase();
        var tekst = tekst.replace("<span class='sucesslabel label label-success'>", "");
        var tekst = tekst.replace("</span>", "");

        var tekst_array = tekst.split(" ");

        for (var i = 0; i < tekst_array.length; i++) {
            console.log("looper indeks:" + index + "tekst_array: " + i);
            if (korrekt_Array.indexOf(tekst_array[i]) > -1) {

                // Add til korrekt_Array:
                if (score_Array.indexOf(tekst_array[i]) < 0) {
                    score_Array.push(tekst_array[i]);
                }
                console.log("score_Array: ", score_Array);

                //$(this).addClass("btn-success").removeClass("btn-info");
                //alert(tekst_array[i]);
                var old_html = tekst;
                var new_html = old_html.replace(tekst_array[i], "<span class='sucesslabel label label-success'>" + tekst_array[i] + "</span>");
                console.log(new_html);
                $(this).html(new_html);
                //korrekt_Array.splice(index, 1);
                //score++;
                updateScore();
            }
        }
    });
}*/

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

        //var tekst_array = tekst.split(" ");

        /*for (var i = 0; i < tekst_array.length; i++) {
            console.log("looper indeks:" + index + "tekst_array: " + i);
            if (korrekt_Array.indexOf(tekst_array[i]) > -1) {

                // Add til korrekt_Array:
                if (score_Array.indexOf(tekst_array[i]) < 0) {
                    score_Array.push(tekst_array[i]);
                }
                console.log("score_Array: ", score_Array);

                //$(this).addClass("btn-success").removeClass("btn-info");
                //alert(tekst_array[i]);
                var old_html = tekst;
                var new_html = old_html.replace(tekst_array[i], "<span class='sucesslabel label label-success'>" + tekst_array[i] + "</span>");
                console.log(new_html);
                $(this).html(new_html);
                //korrekt_Array.splice(index, 1);
                //score++;
                updateScore();
            }
        }*/
    });
}

function updateScore() {
    $(".QuestionCounter").html(score_Array.length + " ud af " + jsonData.kategorier.length);
    if (score_Array.length > jsonData.kategorier.length / 2) {
        $(".btn_feedback, .btn_word").fadeIn(500);
    }
}

function feedback() {
    UserMsgBox("body", "<h3>Du har fundet " + score_Array.length + " ud af " + jsonData.kategorier.length + " vigtige ord i prosa teksten.</h3><p>" + jsonData.slutfeedback + "</p>");

}


function downloadWord() {
    var HTML = wordTemplate(); // HTML markup fra min template
    var converted = htmlDocx.asBlob(HTML);
    saveAs(converted, 'Talepapir.docx');
}


function wordTemplate() {
    var HTML = '';
    HTML += '<!DOCTYPE html>';
    HTML += '<html>';
    HTML += '<head>';
    HTML += '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'; // Fixes issue with danish characters on Internet Explore 
    HTML += '<style type="text/css">';
    HTML += 'body {font-family: arial;}';
    HTML += 'h1 {}';
    HTML += 'h2 {}';
    HTML += 'h3 {color: #717272;}';
    HTML += 'h4 {color: #56bfc5;}';
    HTML += 'h5 {}';
    HTML += 'h6 {}';
    HTML += '.selected {color: #56bfc5; width: 25%;}';
    HTML += 'p {font-size: 14px; margin-bottom: 5px}';
    HTML += 'table {padding: 8px; width: 100%;}';
    HTML += 'td {width: 25%;}';
    HTML += 'ol {color: #717272;}';
    HTML += '</style>';
    HTML += '</head>';
    HTML += '<body>';
    HTML += '<h1>Talepapir</h1>';
    HTML += '<h3>Underspørgsmål: ' + jsonData.undersspm + '</h3>';
    HTML += '<h2>Dine stikord og stikordsagtige sætninger: </h2>';
    HTML += '<h3><ul>';
    for (var i = 0; i < $(".udklips_ord").length; i++) {
        HTML += '<li>' + $(".udklips_ord").eq(i).html() + '</li>';
        HTML += '<br/>';
        // HTML +=      '<hr/>';
    }
    HTML += '</ul></h3>';
    HTML += '</body>';
    HTML += '</html>';
    // document.write(HTML);
    return HTML;
}

/////////////////////////////////////////////////////////////
////////// FRI OPGAVE VARATION HERUNDER: ////////////////////

function fri_opgave() {
    $(".scoreText, .QuestionCounter").fadeOut(0);
    $("	.btn_word").fadeIn(0);
    $(".right_wrapper").prepend("<div class='btn btn-lg btn-info btn_edit'>Indsæt din egen tekst<span style='margin-left:20px; font-size:1.4em; color:#888' class='glyphicons glyphicons-paste'></span></div>")
    $(".btn_edit").click(edit_textfield);
    $(".txt_besvarelse").html("Din egen tekst skal være her...");
    $(".score_container").css("background-color","transparent").css("padding-left"," 0px");
    $(".udklips_content, .btn_transfer").css("opacity", ".1")
}

function edit_textfield() {
    console.log("editing_field");

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
