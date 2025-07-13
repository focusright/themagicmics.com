var label = document.getElementById("label");
var logo = document.getElementById("logo");
var song = document.getElementById("song");
var record = document.getElementById("record");
var paused = true;

function reverse() {
    audioCtx.resume();
    logo.style.WebkitAnimationPlayState = "running";
    logo.style.animationPlayState = "running";
    paused = false;
}
function forward() {
    logo.style.WebkitAnimationPlayState = "paused";
    logo.style.animationPlayState = "paused";
    paused = true;
}
function play() { song.play(); }
function pause() { song.pause(); }

record.addEventListener("mouseover", play);
record.addEventListener("mouseout", pause);
