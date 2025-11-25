import React from 'react'
import styles from './Toolbar.module.css'

interface ToolbarProps {
  selectedTool: string
  setSelectedTool: (tool: string) => void
}

const tools = [
  { id: 'cursor', icon: '↖', name: 'Cursor' },
  { id: 'crosshair', icon: '+', name: 'Crosshair' },
  { id: 'trendline', icon: '╱', name: 'Trend Line' },
  { id: 'horizontal', icon: '━', name: 'Horizontal Line' },
  { id: 'vertical', icon: '┃', name: 'Vertical Line' },
  { id: 'ray', icon: '→', name: 'Ray' },
  { id: 'arrow', icon: '➜', name: 'Arrow' },
  { id: 'rectangle', icon: '▭', name: 'Rectangle' },
  { id: 'circle', icon: '○', name: 'Circle' },
  { id: 'triangle', icon: '△', name: 'Triangle' },
  { id: 'fibonacci', icon: 'Φ', name: 'Fibonacci Retracement' },
  { id: 'parallel', icon: '∥', name: 'Parallel Channel' },
  { id: 'pitchfork', icon: '⋔', name: 'Andrews Pitchfork' },
  { id: 'gann', icon: '⊞', name: 'Gann Fan' },
  { id: 'text', icon: 'T', name: 'Text' },
  { id: 'note', icon: '📝', name: 'Note' },
  { id: 'measure', icon: '📏', name: 'Measure' },
  { id: 'brush', icon: '🖌', name: 'Brush' },
]

export default function Toolbar({ selectedTool, setSelectedTool }: ToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolSection}>
        <div className={styles.sectionTitle}>Drawing Tools</div>
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`${styles.toolBtn} ${selectedTool === tool.id ? styles.active : ''}`}
            onClick={() => setSelectedTool(tool.id)}
            title={tool.name}
          >
            <span className={styles.icon}>{tool.icon}</span>
            <span className={styles.label}>{tool.name}</span>
          </button>
        ))}
      </div>

      <div className={styles.toolSection}>
        <div className={styles.sectionTitle}>Actions</div>
        <button className={styles.toolBtn} title="Remove All Drawings">
          <span className={styles.icon}>🗑</span>
          <span className={styles.label}>Clear All</span>
        </button>
        <button className={styles.toolBtn} title="Lock All Drawings">
          <span className={styles.icon}>🔒</span>
          <span className={styles.label}>Lock</span>
        </button>
        <button className={styles.toolBtn} title="Show/Hide Drawings">
          <span className={styles.icon}>👁</span>
          <span className={styles.label}>Toggle</span>
        </button>
      </div>
    </div>
  )
}
