'use client'

import { useState } from 'react'
import TradingChart from './components/TradingChart'
import Toolbar from './components/Toolbar'
import TopBar from './components/TopBar'
import SidePanel from './components/SidePanel'
import styles from './page.module.css'

export default function Home() {
  const [selectedTool, setSelectedTool] = useState<string>('cursor')
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area' | 'bar'>('candlestick')
  const [interval, setInterval] = useState<string>('1D')
  const [symbol, setSymbol] = useState<string>('BTCUSD')

  return (
    <div className={styles.container}>
      <TopBar
        symbol={symbol}
        setSymbol={setSymbol}
        interval={interval}
        setInterval={setInterval}
        chartType={chartType}
        setChartType={setChartType}
      />
      <div className={styles.mainContent}>
        <Toolbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        <TradingChart
          selectedTool={selectedTool}
          chartType={chartType}
          interval={interval}
          symbol={symbol}
        />
        <SidePanel />
      </div>
    </div>
  )
}
