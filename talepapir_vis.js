var json_streng;


$(document).ready(function() {

    $(".instr_container").html(instruction("Et talepapir hjælper dig til at strukturere din mundtlige fremlæggelse til eksamen. Her kan du se den samme besvarelse af et eksamensspørgsmål som en lang tekst, som sætninger og som stikord."));
    $(".btn_prosa").click(vis_prosa);
    $(".btn_sentence").click(vis_sentence);
    $(".btn_stikord").click(vis_stikord);
    $(".btn").click(tweenMe);
    vis_prosa();
    rotateCheck();
});


function vis_prosa() {

    $(".btn").removeClass("vuc-info-active");
    $(".btn_prosa").addClass("vuc-info-active");
    $(".tale_header").html("LANG TEKSTVISNING");
    $(".tale_content").html("");
    $(".tale_content").append("<h4>" + jsonData.undersspm + "</h4>");
    $(".tale_content").append(jsonData.tekst);
}

function vis_sentence() {
    $(".btn").removeClass("vuc-info-active");
    $(".btn_sentence").addClass("vuc-info-active");
    $(".tale_header").html("SÆTNINGSVISNING");
    $(".tale_content").html("");
    for (var i = 0; i < jsonData.sentences.length; i++) {
        $(".tale_content").append("<li>" + jsonData.sentences[i] + "</li>")
    }
}

function vis_stikord() {
    $(".btn").removeClass("vuc-info-active");
    $(".btn_stikord").addClass("vuc-info-active");
    $(".tale_header").html("STIKORDSVISNING");
    $(".tale_content").html("");
    for (var i = 0; i < jsonData.kategorier.length; i++) {
        $(".tale_content").append("<li>" + jsonData.kategorier[i] + "</li>")
    }
}

function tweenMe() {
    $(".textHolder").animate({
        opacity: "0"
            //left: "-=1000",
    }, 0, function() {
        $(".textHolder").animate({
            opacity: "1"
                //left: "+=1000",
        }, 400, function() {
            // Animation complete.
        });
    });
}
