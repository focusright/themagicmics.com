function Renderer(circleElement) {
    var circles = [];
    var initialized = false;
    var height = 0;
    var width = 0;
    var init = function(config) {
        var count = config.count;
        width = config.width;
        height = config.height;
        var circleMaxWidth = (width * 0.66) >> 0;
        for (var i = 0; i < count; i++) {
            var node = document.createElement('div');
            node.style.width = node.style.height = (i / count * circleMaxWidth) + 'px';
            node.classList.add('circle');
            circles.push(node);
            circleElement.appendChild(node);
        }
        initialized = true;
    };
    var max = 256;
    var renderFrame = function(frequencyData) {
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];
            circle.style.cssText = '-webkit-transform:scale(' + ((frequencyData[i] / max)) + ')';
        }
    };
    return {
        init: init,
        isInitialized: function() {
            return initialized;
        },
        renderFrame: renderFrame
    }
};


var audio, audioStream, analyser, source, audioCtx, canvasCtx, frequencyData;
window.onload = function() {
    function Visualization(config) {
        var running = false,
            renderer = config.renderer,
            width = config.width || 360,
            height = config.height || 360;
        var init = function() {
            renderer.init({
                count: analyser.frequencyBinCount,
                width: width,
                height: height
            });
        };
        this.start = function() {
            running = true;
            renderFrame();
        };
        this.stop = function() {
            running = false;
        };
        this.isPlaying = function() {
            return running;
        }
        var renderFrame = function() {
            analyser.getByteFrequencyData(frequencyData);
            renderer.renderFrame(frequencyData);
            if (running) {
                requestAnimationFrame(renderFrame);
            }
        };
        init();
    };

    //main
    audio = document.getElementById('song');
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 64;
    frequencyData = new Uint8Array(analyser.frequencyBinCount);

    visualizations = [];
    var circleElements = document.querySelectorAll('.circles');
    for (var i = 0; i < circleElements.length; i++) {
        var element = circleElements[i];
        var renderer = new Renderer(element);
        var v = new Visualization({ renderer: renderer });
        visualizations.push(v);
    }

    var subwoofers = document.querySelectorAll(".subwoofer");
    audio.onplay = function() { 
        visualizations.forEach(
            function(item){ 
                item.start();
            }
        );
        circleElements.forEach(
            function(item){
                item.style.visibility = "visible";
            }
        );
        subwoofers.forEach(
            function(item){
                item.src = "assets/subwoofer.gif";
            }
        );
        reverse();
    };
    audio.onpause = function() { 
        visualizations.forEach(
            function(item){ 
                item.stop();
            }
        );
        circleElements.forEach(
            function(item){
                item.style.visibility = "hidden";
            }
        );
        subwoofers.forEach(
            function(item){
                item.src = "assets/subwoofer.png";
            }
        );
        forward();
    };
};


