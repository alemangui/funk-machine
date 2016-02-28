(function() {


	var audioPath = Dolby.checkDDPlus() ? './audio/electro_DDplus.mp4' : './audio/electro.m4a';
	var playButton = document.getElementById('play-control');
	var pauseButton = document.getElementById('pause-control');

	var delay;
	var flanger;
	var lowPassFilter;
	var distortion;
	var analyser = Pizzicato.context.createAnalyser();
	var canvas = document.getElementById('audio-visualisation');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var canvasContext = canvas.getContext('2d');
	var waveformData = new Uint8Array(analyser.frequencyBinCount);

	startWaitingScreen();

	var electro = new Pizzicato.Sound({
		source: 'file',
    	options: { path: audioPath, loop: false }
	}, (function(error) {

		if (error) {
			handleLoadFileError();
			return;
		}

		setupSoundsAndEffects();
		setupLeapMotion();
		removeWaitingScreen();
	}).bind(this));

	/**
	 *
	 */
	function startWaitingScreen() {

	};

	/**
	 *
	 */
	function removeWaitingScreen () {
	}

	/**
	 *
	 */
	function handleLoadFileError() {

	}

	/**
	 *
	 */
	function setupSoundsAndEffects() {
		delay = new Pizzicato.Effects.Delay({ mix: 0 });
		flanger = new Pizzicato.Effects.Flanger();
		lowPassFilter = new Pizzicato.Effects.LowPassFilter();
		distortion = new Pizzicato.Effects.LowPassFilter();

		electro.addEffect(delay);

		delay.outputNode.connect(analyser);

		electro.play();
		drawWaveform();
	};

	/**
	 *
	 */
	function drawWaveform() {

		requestAnimationFrame(drawWaveform);
		analyser.getByteFrequencyData(waveformData);
	
		canvasContext.fillStyle = '#1B1B1B';
		canvasContext.fillRect(0, 0, canvas.width, canvas.height);
		

		canvasContext.fillStyle = '#282828';

		var sliceWidth = canvas.width / analyser.frequencyBinCount * 6;
		var x = 0;

		for(var i = 0; i < analyser.frequencyBinCount; i++) {
			if (i % 6) continue;
			canvasContext.fillRect(x, canvas.height - waveformData[i] * 2.5, sliceWidth, waveformData[i] * 2.5);
			x += sliceWidth + 1;
		}


		// canvasContext.lineWidth = 1;
		// canvasContext.strokeStyle = '#AAAAAA';

		// canvasContext.beginPath();

		// var sliceWidth = canvas.width / analyser.frequencyBinCount;
		// var x = 0;

		// for(var i = 0; i < analyser.frequencyBinCount; i++) {

		// 	var v = waveformData[i] / 128.0;
		// 	var y = v * canvas.height / 2.5;

		// 	if(i === 0)
		// 		canvasContext.moveTo(x, y);
		// 	else
		// 		canvasContext.lineTo(x, y);	

		// 	x += sliceWidth;
		// }

		// canvasContext.lineTo(canvas.width, canvas.height/2);
		// canvasContext.stroke();
	}

	/**
	 * If the Leap Motion is connected the event loop will start.
	 */
	function setupLeapMotion() {
		Leap.loop(onLeapCapturedData);
	};


	/**
	 * This function is called for the Leap Motion loop
	 * event. leapData contains information on the hands detected
	 * by the Leap Motion device.
	 */
	function onLeapCapturedData(leapData) {
		if (!leapData.hands || leapData.hands.length === 0) {		
			clearLeapMotionOutput();
			return;
		}

		var verticalPosition = leapData.hands[0].palmPosition[1];
		var percentage = Math.min((verticalPosition / 400), 1);


		output.innerHTML = 'Position: ' + verticalPosition; // TEMP
	};

})();