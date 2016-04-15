var json_streng;


$(document).ready(function() {

    $(".btn_prosa").click(vis_prosa);
    $(".btn_sentence").click(vis_sentence);
    $(".btn_stikord").click(vis_stikord);


    vis_prosa();

});


function vis_prosa() {
    $(".tale_header").html("PROSA VISNING");
    $(".tale_content").html(jsonData.tekst);
}

function vis_sentence() {
    $(".tale_header").html("SÆTNINGSVISNING");
    $(".tale_content").html("");
    for (var i = 0; i < jsonData.sentences.length; i++) {
        $(".tale_content").append("<li>" + jsonData.sentences[i] + "</li>")
    }
}

function vis_stikord() {
    $(".tale_header").html("STIKORDSVISNING");
    for (var i = 0; i < jsonData.kategorier.length; i++) {
        $(".tale_content").append("<li>" + jsonData.kategorier[i] + "</li>")
    }
}
