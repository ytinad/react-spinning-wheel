function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

var SpinningWheel = function SpinningWheel(_ref) {
  var options = _ref.options,
      optColors = _ref.optColors,
      winningOption = _ref.winningOption,
      onFinished = _ref.onFinished,
      primaryColor = _ref.primaryColor,
      contrastColor = _ref.contrastColor,
      buttonText = _ref.buttonText,
      _ref$isOnlyOnce = _ref.isOnlyOnce,
      isOnlyOnce = _ref$isOnlyOnce === void 0 ? true : _ref$isOnlyOnce,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 290 : _ref$size,
      _ref$upDuration = _ref.upDuration,
      upDuration = _ref$upDuration === void 0 ? 100 : _ref$upDuration,
      _ref$downDuration = _ref.downDuration,
      downDuration = _ref$downDuration === void 0 ? 1000 : _ref$downDuration,
      _ref$fontFamily = _ref.fontFamily,
      fontFamily = _ref$fontFamily === void 0 ? "proxima-nova" : _ref$fontFamily,
      _ref$autoSpin = _ref.autoSpin,
      autoSpin = _ref$autoSpin === void 0 ? false : _ref$autoSpin;
  var currentSegment = "";
  var isStarted = false;

  var _useState = React.useState(false),
      isFinished = _useState[0],
      setFinished = _useState[1];

  var timerHandle = 0;
  var timerDelay = options.length;
  var angleCurrent = 0;
  var angleDelta = 0;
  var canvasContext = null;
  var maxSpeed = Math.PI / ("" + options.length);
  var upTime = options.length * upDuration;
  var downTime = options.length * downDuration;
  var spinStart = 0;
  var frames = 0;
  var centerMargin = size <= 220 ? 5 : 20;
  var centerX = size + centerMargin;
  var centerY = size + centerMargin;
  var canvasHeight = centerX * 2 + centerMargin * 2;
  var canvasWidth = centerY * 2 + centerMargin * 2;

  var wheelInit = function wheelInit() {
    initCanvas();
    wheelDraw();
  };

  var initCanvas = function initCanvas() {
    var canvas = document.getElementById("canvas");

    if (navigator.appVersion.indexOf("MSIE") !== -1) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("width", canvasHeight);
      canvas.setAttribute("height", canvasWidth);
      canvas.setAttribute("id", "canvas");
      document.getElementById("wheel").appendChild(canvas);
    }

    if (!autoSpin) {
      canvas.addEventListener("click", spin, false);
    }

    canvasContext = canvas.getContext("2d");
  };

  var spin = function spin() {
    isStarted = true;

    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      maxSpeed = Math.PI / options.length;
      frames = 0;
      timerHandle = setInterval(onTimerTick, timerDelay);
    }
  };

  var onTimerTick = function onTimerTick() {
    frames++;
    draw();
    var duration = new Date().getTime() - spinStart;
    var progress = 0;
    var finished = false;

    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2);
    } else {
      if (winningOption) {
        if (currentSegment === winningOption && frames > options.length) {
          progress = duration / upTime;
          angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta = maxSpeed * Math.sin(progress * Math.PI / 2 + Math.PI / 2);
      }

      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;

    while (angleCurrent >= Math.PI * 2) {
      angleCurrent -= Math.PI * 2;
    }

    if (finished) {
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  var wheelDraw = function wheelDraw() {
    clear();
    drawWheel();
    drawNeedle();
  };

  var draw = function draw() {
    clear();
    drawWheel();
    drawNeedle();
  };

  var drawSegment = function drawSegment(key, lastAngle, angle) {
    var ctx = canvasContext;
    var value = options[key];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, size, lastAngle, angle, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fillStyle = optColors[key];
    ctx.fill();
    ctx.stroke();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((lastAngle + angle) / 2);
    ctx.fillStyle = contrastColor || "white";
    ctx.font = "bold " + (size <= 220 ? 0.75 : 1) + "em " + fontFamily;
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0);
    ctx.restore();
  };

  var drawWheel = function drawWheel() {
    var ctx = canvasContext;
    var lastAngle = angleCurrent;
    var len = options.length;
    var PI2 = Math.PI * 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = primaryColor || "black";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = (size <= 220 ? 0.75 : 1) + "em " + fontFamily;

    for (var i = 1; i <= len; i++) {
      var angle = PI2 * (i / len) + angleCurrent;
      drawSegment(i - 1, lastAngle, angle);
      lastAngle = angle;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, PI2, false);
    ctx.closePath();
    ctx.fillStyle = primaryColor || "black";
    ctx.lineWidth = 10;
    ctx.strokeStyle = contrastColor || "white";
    ctx.fill();
    ctx.font = "bold " + (size <= 220 ? 0.75 : 1) + "em " + fontFamily;
    ctx.fillStyle = contrastColor || "white";
    ctx.textAlign = "center";

    if (!autoSpin) {
      ctx.fillText(buttonText || "Spin", centerX, centerY + 3);
    }

    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, 0, PI2, false);
    ctx.closePath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = primaryColor || "black";
    ctx.stroke();
  };

  var drawNeedle = function drawNeedle() {
    var ctx = canvasContext;
    ctx.lineWidth = 1;
    ctx.strokeStyle = contrastColor || "white";
    ctx.fileStyle = contrastColor || "white";
    ctx.beginPath();
    ctx.moveTo(centerX + 20, centerY - 50);
    ctx.lineTo(centerX - 20, centerY - 50);
    ctx.lineTo(centerX, centerY - 70);
    ctx.closePath();
    ctx.fill();
    var change = angleCurrent + Math.PI / 2;
    var i = options.length - Math.floor(change / (Math.PI * 2) * options.length) - 1;
    if (i < 0) i = i + options.length;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = primaryColor || "black";
    ctx.font = "bold " + (size <= 220 ? 1 : 1.5) + "em " + fontFamily;
    currentSegment = options[i];
    isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + size + 50);
  };

  var clear = function clear() {
    var ctx = canvasContext;
    ctx.clearRect(0, 0, canvasHeight, canvasWidth);
  };

  React.useEffect(function () {
    wheelInit();
    setTimeout(function () {
      window.scrollTo(0, 1);
    }, 0);

    if (autoSpin) {
      spin();
    }
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    id: "wheel"
  }, /*#__PURE__*/React__default.createElement("canvas", {
    id: "canvas",
    width: canvasWidth,
    height: canvasHeight,
    style: {
      pointerEvents: isFinished && isOnlyOnce ? "none" : "auto"
    }
  }));
};

module.exports = SpinningWheel;
//# sourceMappingURL=index.js.map
