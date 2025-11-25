import React from 'react'
import styles from './TopBar.module.css'

interface TopBarProps {
  symbol: string
  setSymbol: (symbol: string) => void
  interval: string
  setInterval: (interval: string) => void
  chartType: 'candlestick' | 'line' | 'area' | 'bar'
  setChartType: (type: 'candlestick' | 'line' | 'area' | 'bar') => void
}

const intervals = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W', '1M']
const symbols = ['BTCUSD', 'ETHUSD', 'AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN', 'EURUSD', 'GBPUSD']

export default function TopBar({ symbol, setSymbol, interval, setInterval, chartType, setChartType }: TopBarProps) {
  return (
    <div className={styles.topBar}>
      <div className={styles.left}>
        <div className={styles.logo}>TradingView</div>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className={styles.symbolSelect}
        >
          {symbols.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className={styles.center}>
        <div className={styles.chartTypes}>
          <button
            className={chartType === 'candlestick' ? styles.active : ''}
            onClick={() => setChartType('candlestick')}
            title="Candlestick"
          >
            📊
          </button>
          <button
            className={chartType === 'bar' ? styles.active : ''}
            onClick={() => setChartType('bar')}
            title="Bar"
          >
            ▯
          </button>
          <button
            className={chartType === 'line' ? styles.active : ''}
            onClick={() => setChartType('line')}
            title="Line"
          >
            ━
          </button>
          <button
            className={chartType === 'area' ? styles.active : ''}
            onClick={() => setChartType('area')}
            title="Area"
          >
            ▬
          </button>
        </div>

        <div className={styles.intervals}>
          {intervals.map(i => (
            <button
              key={i}
              className={interval === i ? styles.active : ''}
              onClick={() => setInterval(i)}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} title="Alerts">🔔</button>
        <button className={styles.iconBtn} title="Settings">⚙️</button>
        <button className={styles.iconBtn} title="Fullscreen">⛶</button>
      </div>
    </div>
  )
}
