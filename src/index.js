import React, { useEffect, useState } from "react"

const SpinningWheel = ({
  options,
  optColors,
  winningOption,
  onFinished,
  primaryColor,
  contrastColor,
  buttonText,
  isOnlyOnce = true,
  size = 290,
  upDuration = 100,
  downDuration = 1000,
  fontFamily = "proxima-nova",
  autoSpin = false,
}) => {
  let currentSegment = ""
  let isStarted = false
  const [isFinished, setFinished] = useState(false)
  let timerHandle = 0
  const timerDelay = options.length
  let angleCurrent = 0
  let angleDelta = 0
  let canvasContext = null
  let maxSpeed = Math.PI / `${options.length}`
  const upTime = options.length * upDuration
  const downTime = options.length * downDuration
  let spinStart = 0
  let frames = 0
  let centerMargin = size <= 220 ? 5 : 20
  let centerX = size + centerMargin
  let centerY = size + centerMargin
  let canvasHeight = centerX * 2 + centerMargin * 2
  let canvasWidth = centerY * 2 + centerMargin * 2
  const wheelInit = () => {
    initCanvas()
    wheelDraw()
  }

  const initCanvas = () => {
    let canvas = document.getElementById("canvas")
    if (navigator.appVersion.indexOf("MSIE") !== -1) {
      canvas = document.createElement("canvas")
      canvas.setAttribute("width", canvasHeight)
      canvas.setAttribute("height", canvasWidth)
      canvas.setAttribute("id", "canvas")
      document.getElementById("wheel").appendChild(canvas)
    }
    if (!autoSpin) {
      canvas.addEventListener("click", spin, false)
    }
    canvasContext = canvas.getContext("2d")
  }
  const spin = () => {
    isStarted = true
    if (timerHandle === 0) {
      spinStart = new Date().getTime()
      // maxSpeed = Math.PI / ((options.length*2) + Math.random())
      maxSpeed = Math.PI / options.length
      frames = 0
      timerHandle = setInterval(onTimerTick, timerDelay)
    }
  }
  const onTimerTick = () => {
    frames++
    draw()
    const duration = new Date().getTime() - spinStart
    let progress = 0
    let finished = false
    if (duration < upTime) {
      progress = duration / upTime
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2)
    } else {
      if (winningOption) {
        if (currentSegment === winningOption && frames > options.length) {
          progress = duration / upTime
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
          progress = 1
        } else {
          progress = duration / downTime
          angleDelta =
            maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
        }
      } else {
        progress = duration / downTime
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
      }
      if (progress >= 1) finished = true
    }

    angleCurrent += angleDelta
    while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2
    if (finished) {
      setFinished(true)
      onFinished(currentSegment)
      clearInterval(timerHandle)
      timerHandle = 0
      angleDelta = 0
    }
  }

  const wheelDraw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const draw = () => {
    clear()
    drawWheel()
    drawNeedle()
  }

  const drawSegment = (key, lastAngle, angle) => {
    const ctx = canvasContext
    const value = options[key]
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, size, lastAngle, angle, false)
    ctx.lineTo(centerX, centerY)
    ctx.closePath()
    ctx.fillStyle = optColors[key]
    ctx.fill()
    ctx.stroke()
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate((lastAngle + angle) / 2)
    ctx.fillStyle = contrastColor || "white"
    ctx.font = `bold ${size <= 220 ? 0.75 : 1}em ` + fontFamily
    ctx.fillText(value.substr(0, 21), size / 2 + 20, 0)
    ctx.restore()
  }

  const drawWheel = () => {
    const ctx = canvasContext
    let lastAngle = angleCurrent
    const len = options.length
    const PI2 = Math.PI * 2
    ctx.lineWidth = 1
    ctx.strokeStyle = primaryColor || "black"
    ctx.textBaseline = "middle"
    ctx.textAlign = "center"
    ctx.font = `${size <= 220 ? 0.75 : 1}em ` + fontFamily
    for (let i = 1; i <= len; i++) {
      const angle = PI2 * (i / len) + angleCurrent
      drawSegment(i - 1, lastAngle, angle)
      lastAngle = angle
    }

    // Draw a center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 50, 0, PI2, false)
    ctx.closePath()
    ctx.fillStyle = primaryColor || "black"
    ctx.lineWidth = 10
    ctx.strokeStyle = contrastColor || "white"
    ctx.fill()
    ctx.font = `bold ${size <= 220 ? 0.75 : 1}em ` + fontFamily
    ctx.fillStyle = contrastColor || "white"
    ctx.textAlign = "center"
    if (!autoSpin) {
      ctx.fillText(buttonText || "Spin", centerX, centerY + 3)
    }
    ctx.stroke()

    // Draw outer circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, size, 0, PI2, false)
    ctx.closePath()

    ctx.lineWidth = 10
    ctx.strokeStyle = primaryColor || "black"
    ctx.stroke()
  }

  const drawNeedle = () => {
    const ctx = canvasContext
    ctx.lineWidth = 1
    ctx.strokeStyle = contrastColor || "white"
    ctx.fileStyle = contrastColor || "white"
    ctx.beginPath()
    ctx.moveTo(centerX + 20, centerY - 50)
    ctx.lineTo(centerX - 20, centerY - 50)
    ctx.lineTo(centerX, centerY - 70)
    ctx.closePath()
    ctx.fill()
    const change = angleCurrent + Math.PI / 2
    let i =
      options.length - Math.floor((change / (Math.PI * 2)) * options.length) - 1
    if (i < 0) i = i + options.length
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = primaryColor || "black"
    ctx.font = `bold ${size <= 220 ? 1 : 1.5}em ` + fontFamily
    currentSegment = options[i]
    isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + size + 50)
  }
  const clear = () => {
    const ctx = canvasContext
    ctx.clearRect(0, 0, canvasHeight, canvasWidth)
  }

  useEffect(() => {
    wheelInit()
    setTimeout(() => {
      window.scrollTo(0, 1)
    }, 0)
    if (autoSpin) {
      spin()
    }
  }, [])
  return (
    <div id="wheel">
      <canvas
        id="canvas"
        width={canvasWidth}
        height={canvasHeight}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? "none" : "auto",
        }}
      />
    </div>
  )
}
export default SpinningWheel
