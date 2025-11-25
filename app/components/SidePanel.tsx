import React, { useState } from 'react'
import styles from './SidePanel.module.css'

export default function SidePanel() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'indicators' | 'alerts'>('watchlist')

  const watchlist = [
    { symbol: 'BTCUSD', price: '43,250.00', change: '+2.45%', positive: true },
    { symbol: 'ETHUSD', price: '2,287.50', change: '+3.12%', positive: true },
    { symbol: 'AAPL', price: '182.34', change: '-0.85%', positive: false },
    { symbol: 'GOOGL', price: '139.67', change: '+1.23%', positive: true },
    { symbol: 'TSLA', price: '207.89', change: '-1.45%', positive: false },
  ]

  const indicators = [
    { name: 'Moving Average (50)', active: true },
    { name: 'Moving Average (200)', active: true },
    { name: 'RSI (14)', active: false },
    { name: 'MACD (12,26,9)', active: false },
    { name: 'Bollinger Bands', active: false },
    { name: 'Volume', active: true },
  ]

  return (
    <div className={styles.sidePanel}>
      <div className={styles.tabs}>
        <button
          className={activeTab === 'watchlist' ? styles.active : ''}
          onClick={() => setActiveTab('watchlist')}
        >
          Watchlist
        </button>
        <button
          className={activeTab === 'indicators' ? styles.active : ''}
          onClick={() => setActiveTab('indicators')}
        >
          Indicators
        </button>
        <button
          className={activeTab === 'alerts' ? styles.active : ''}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'watchlist' && (
          <div className={styles.watchlist}>
            {watchlist.map(item => (
              <div key={item.symbol} className={styles.watchlistItem}>
                <div className={styles.symbolInfo}>
                  <div className={styles.symbol}>{item.symbol}</div>
                  <div className={styles.price}>{item.price}</div>
                </div>
                <div className={`${styles.change} ${item.positive ? styles.positive : styles.negative}`}>
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className={styles.indicators}>
            <button className={styles.addBtn}>+ Add Indicator</button>
            {indicators.map(indicator => (
              <div key={indicator.name} className={styles.indicatorItem}>
                <input
                  type="checkbox"
                  checked={indicator.active}
                  onChange={() => {}}
                  className={styles.checkbox}
                />
                <span className={styles.indicatorName}>{indicator.name}</span>
                <button className={styles.settingsBtn}>⚙️</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className={styles.alerts}>
            <button className={styles.addBtn}>+ Create Alert</button>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔔</div>
              <div className={styles.emptyText}>No alerts yet</div>
              <div className={styles.emptySubtext}>Create price alerts to get notified</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
