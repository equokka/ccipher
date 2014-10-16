// main.js

var newbtn = $("#newbtn"),
    showbtn = $("#showbtn"),
    langbtn = $("#langbtn"),
    
    convertbtn = $("#convertbtn"),
    submitbtn = $("#submitbtn"),
    
    intext = $("#intext"),
    outtext = $("#outtext"),
    submittext = $("#submittext"),
    resultbox = $("#resultbox"),
    
    currentkey = 0,
    currentlang = "PT",
    currentstate,
    laststate,
    lastexample = "";

function newGame () {
    getNewKey();
    setState("normal");
    $("#wrap > *").slideUp(function(){
        intext.val("");
        outtext.val("");
        submittext.val("");
        toggleInput(true);
    });
    $("#wrap > *").slideDown();
}

function getNewKey () {
    var lastkey = currentkey,
        key = lastkey;
    for(;key == lastkey;) {
        n = Math.floor(Math.random() * 24 + 1) + 1; // 1 to 25
        i = Math.floor(Math.random() * 2 + 1); // positive / negative
        if (n != 13) { // not a ROT13
            if (i == 1) key = +n;
            if (i == 2) key = -n;
        } else { // is a ROT13
            key = +13;
        }
    }
    currentkey = key;
}

function setState (state) {
    if (state == "normal"){
        resultbox.text("...");
        resultbox.animate({backgroundColor: "#808080"}, 200);
        $("#container").css("box-shadow", "0 0 1000px 30px #000");
        
    } else if (state == "correct") {
        if (currentlang == "PT") resultbox.text("CORRECTO");
        if (currentlang == "ENG") resultbox.text("CORRECT");
        resultbox.animate({backgroundColor: "green"}, 200);
        $("#container").css("box-shadow", "0 0 1000px 30px green");
        
    } else if (state == "wrong") {
        if (currentlang == "PT") resultbox.text("ERRADO");
        if (currentlang == "ENG") resultbox.text("WRONG");
        resultbox.animate({backgroundColor: "red"}, 200);
        $("#container").css("box-shadow", "0 0 1000px 30px red");
        
    } else if (state == "show") {
        resultbox.animate({backgroundColor: "blue"}, 200);
        $("#container").css("box-shadow", "0 0 1000px 30px blue");
        resultbox.text(currentkey);
    }
    laststate = currentstate;
    currentstate = state; 
}

function showKey () {
    toggleInput(false);
    resultbox.text(currentkey);
    setState("show");
}
function toggleInput (bool) {
    showbtn.prop("disabled", !bool);
    convertbtn.prop("disabled", !bool);
    submitbtn.prop("disabled", !bool);
    intext.prop("disabled", !bool);
    outtext.prop("disabled", !bool);
    submittext.prop("disabled", !bool);
}
function convertKey() {
    if (intext.val() != lastexample) {
        var o_text = intext.val(),
            o_letters = o_text.split(""),
            alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
            c_text = "", _x = "";
        lastexample = o_text;
        outtext.fadeOut(function() {
            outtext.val("");
            for (var o_x in o_text) {
            var let = o_text[o_x];
            if (isNaN(let) && alphabet.indexOf(let.toLowerCase()) != -1) {
                var x = let.toLowerCase();
                if (currentkey > 0) {
                    _x = alphabet[(alphabet.indexOf(x) + currentkey) % alphabet.length];
                } else {
                    _x = alphabet[(alphabet.indexOf(x) + (26 - Math.abs(currentkey))) % alphabet.length];
                }
                if (let == let.toUpperCase()) _x = _x.toUpperCase();
            } else {
                _x = let;
            }
            c_text += _x;
        }
        outtext.val(c_text);
        });
        outtext.fadeIn();
    }
}
function submitKey() {
    if (currentkey == submittext.val()) {
        setState("correct");
    } else if (submittext.val() == "") {
        setState("normal");
    } else {
        setState("wrong");
    }
}
function toggleLang () {
    if (currentlang == "PT") {
        currentlang = "ENG";
        $("title").text("Key?");
        $("h3").text("Caesar Cipher");
        newbtn.text("New");
        showbtn.text("Answer");
        intext.attr("placeholder", "Example text");
        outtext.attr("placeholder", "Converted text");
        submittext.attr("placeholder", "Key?");
    } else if (currentlang == "ENG") {
        currentlang = "PT";
        $("title").text("Chave?");
        $("h3").text("Cifra de César");
        newbtn.text("Novo");
        showbtn.text("Solução");
        intext.attr("placeholder", "Texto de exemplo");
        outtext.attr("placeholder", "Texto convertido");
        submittext.attr("placeholder", "Chave?");
    }
    langbtn.text(currentlang);
    setState(currentstate);
}

newbtn.click(function(){ newGame(); });
showbtn.click(function(){ showKey(); });
langbtn.click(function(){ toggleLang(); });
convertbtn.click(function(){ convertKey(); });
submitbtn.click(function(){ submitKey(); });
getNewKey();