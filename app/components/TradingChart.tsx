'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData, HistogramData, Time } from 'lightweight-charts'
import styles from './TradingChart.module.css'

interface TradingChartProps {
  selectedTool: string
  chartType: 'candlestick' | 'line' | 'area' | 'bar'
  interval: string
  symbol: string
}

interface Drawing {
  id: string
  type: string
  points: { x: number; y: number; time: number; price: number }[]
  color: string
}

export default function TradingChart({ selectedTool, chartType, interval, symbol }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<any> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Generate sample data
  const generateData = (type: string) => {
    const data: any[] = []
    const volumeData: HistogramData[] = []
    let basePrice = 40000

    if (symbol.includes('ETH')) basePrice = 2200
    else if (symbol.includes('AAPL')) basePrice = 180
    else if (symbol.includes('GOOGL')) basePrice = 140
    else if (symbol.includes('TSLA')) basePrice = 210
    else if (symbol.includes('MSFT')) basePrice = 380
    else if (symbol.includes('AMZN')) basePrice = 155
    else if (symbol.includes('EUR')) basePrice = 1.08
    else if (symbol.includes('GBP')) basePrice = 1.26

    for (let i = 0; i < 500; i++) {
      const time = (Math.floor(Date.now() / 1000) - (500 - i) * 86400) as Time
      const open = basePrice + Math.random() * 500 - 250
      const close = open + Math.random() * 200 - 100
      const high = Math.max(open, close) + Math.random() * 100
      const low = Math.min(open, close) - Math.random() * 100

      if (type === 'candlestick' || type === 'bar') {
        data.push({ time, open, high, low, close })
      } else {
        data.push({ time, value: close })
      }

      volumeData.push({
        time,
        value: Math.random() * 1000000,
        color: close > open ? '#26a69a80' : '#ef535080'
      })

      basePrice = close
    }

    return { data, volumeData }
  }

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#131722' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#1e222d' },
        horzLines: { color: '#1e222d' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      rightPriceScale: {
        borderColor: '#2a2e39',
      },
      timeScale: {
        borderColor: '#2a2e39',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    })

    chartRef.current = chart

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (!chartRef.current) return

    if (seriesRef.current) {
      chartRef.current.removeSeries(seriesRef.current)
    }

    const { data, volumeData } = generateData(chartType)

    let series: ISeriesApi<any>

    if (chartType === 'candlestick') {
      series = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderUpColor: '#26a69a',
        borderDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      })
      series.setData(data)
    } else if (chartType === 'bar') {
      series = chartRef.current.addBarSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        openVisible: true,
        thinBars: false,
      })
      series.setData(data)
    } else if (chartType === 'line') {
      series = chartRef.current.addLineSeries({
        color: '#2962ff',
        lineWidth: 2,
      })
      series.setData(data)
    } else {
      series = chartRef.current.addAreaSeries({
        topColor: '#2962ff80',
        bottomColor: '#2962ff00',
        lineColor: '#2962ff',
        lineWidth: 2,
      })
      series.setData(data)
    }

    seriesRef.current = series

    if (volumeSeriesRef.current) {
      chartRef.current.removeSeries(volumeSeriesRef.current)
    }

    const volumeSeries = chartRef.current.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    })

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    })

    volumeSeries.setData(volumeData)
    volumeSeriesRef.current = volumeSeries

    chartRef.current.timeScale().fitContent()
  }, [chartType, interval, symbol])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (chartContainerRef.current) {
        canvas.width = chartContainerRef.current.clientWidth
        canvas.height = chartContainerRef.current.clientHeight
        redrawAll()
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  const redrawAll = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawings.forEach(drawing => {
      drawShape(ctx, drawing)
    })

    if (currentDrawing) {
      drawShape(ctx, currentDrawing)
    }
  }

  const drawShape = (ctx: CanvasRenderingContext2D, drawing: Drawing) => {
    if (drawing.points.length === 0) return

    ctx.strokeStyle = drawing.color
    ctx.fillStyle = drawing.color + '40'
    ctx.lineWidth = 2

    switch (drawing.type) {
      case 'trendline':
      case 'ray':
      case 'arrow':
        if (drawing.points.length >= 2) {
          ctx.beginPath()
          ctx.moveTo(drawing.points[0].x, drawing.points[0].y)
          ctx.lineTo(drawing.points[1].x, drawing.points[1].y)
          ctx.stroke()

          if (drawing.type === 'arrow') {
            drawArrowHead(ctx, drawing.points[0], drawing.points[1])
          }
        }
        break

      case 'horizontal':
        if (drawing.points.length >= 1) {
          ctx.beginPath()
          ctx.moveTo(0, drawing.points[0].y)
          ctx.lineTo(ctx.canvas.width, drawing.points[0].y)
          ctx.stroke()
        }
        break

      case 'vertical':
        if (drawing.points.length >= 1) {
          ctx.beginPath()
          ctx.moveTo(drawing.points[0].x, 0)
          ctx.lineTo(drawing.points[0].x, ctx.canvas.height)
          ctx.stroke()
        }
        break

      case 'rectangle':
        if (drawing.points.length >= 2) {
          const width = drawing.points[1].x - drawing.points[0].x
          const height = drawing.points[1].y - drawing.points[0].y
          ctx.fillRect(drawing.points[0].x, drawing.points[0].y, width, height)
          ctx.strokeRect(drawing.points[0].x, drawing.points[0].y, width, height)
        }
        break

      case 'circle':
        if (drawing.points.length >= 2) {
          const radius = Math.sqrt(
            Math.pow(drawing.points[1].x - drawing.points[0].x, 2) +
            Math.pow(drawing.points[1].y - drawing.points[0].y, 2)
          )
          ctx.beginPath()
          ctx.arc(drawing.points[0].x, drawing.points[0].y, radius, 0, 2 * Math.PI)
          ctx.fill()
          ctx.stroke()
        }
        break

      case 'fibonacci':
        if (drawing.points.length >= 2) {
          const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
          const y1 = drawing.points[0].y
          const y2 = drawing.points[1].y

          levels.forEach(level => {
            const y = y1 + (y2 - y1) * level
            ctx.beginPath()
            ctx.moveTo(0, y)
            ctx.lineTo(ctx.canvas.width, y)
            ctx.stroke()

            ctx.fillStyle = drawing.color
            ctx.font = '11px monospace'
            ctx.fillText(`${(level * 100).toFixed(1)}%`, 10, y - 5)
          })
        }
        break
    }
  }

  const drawArrowHead = (ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x)
    const headLength = 15

    ctx.beginPath()
    ctx.moveTo(to.x, to.y)
    ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
    )
    ctx.moveTo(to.x, to.y)
    ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
    )
    ctx.stroke()
  }

  useEffect(() => {
    redrawAll()
  }, [drawings, currentDrawing])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedTool === 'cursor' || selectedTool === 'crosshair') return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newDrawing: Drawing = {
      id: Date.now().toString(),
      type: selectedTool,
      points: [{ x, y, time: 0, price: 0 }],
      color: '#2962ff'
    }

    setCurrentDrawing(newDrawing)
    setIsDrawing(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentDrawing) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (currentDrawing.type === 'horizontal' || currentDrawing.type === 'vertical') {
      setCurrentDrawing({
        ...currentDrawing,
        points: [currentDrawing.points[0]]
      })
    } else {
      setCurrentDrawing({
        ...currentDrawing,
        points: [currentDrawing.points[0], { x, y, time: 0, price: 0 }]
      })
    }
  }

  const handleMouseUp = () => {
    if (isDrawing && currentDrawing) {
      if (currentDrawing.points.length > 0) {
        setDrawings([...drawings, currentDrawing])
      }
      setCurrentDrawing(null)
    }
    setIsDrawing(false)
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartInfo}>
        <div className={styles.priceInfo}>
          <span className={styles.label}>O</span>
          <span className={styles.value}>42,850.00</span>
          <span className={styles.label}>H</span>
          <span className={styles.valueHigh}>43,200.00</span>
          <span className={styles.label}>L</span>
          <span className={styles.valueLow}>42,100.00</span>
          <span className={styles.label}>C</span>
          <span className={styles.value}>42,950.00</span>
          <span className={styles.change}>+2.45%</span>
        </div>
      </div>

      <div ref={chartContainerRef} className={styles.chart}>
        <canvas
          ref={canvasRef}
          className={styles.drawingCanvas}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className={styles.chartControls}>
        <button className={styles.controlBtn} title="Zoom In">+</button>
        <button className={styles.controlBtn} title="Zoom Out">-</button>
        <button className={styles.controlBtn} title="Reset Zoom">⟲</button>
        <button className={styles.controlBtn} title="Screenshot">📷</button>
      </div>
    </div>
  )
}
