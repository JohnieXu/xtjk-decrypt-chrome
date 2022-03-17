import React, { useState, useEffect } from "react"
import { ExpandO, Shrink, Enlarge } from "@react-vant/icons"

import "./Header.scss"

interface Props {
  onSizeChange: (size: Size) => void
}

type Size = 'mini' | 'wide' | 'full'

/**
 * 尺寸对应头部图标映射
 * Expand: 方法
 * Shrink: 缩小
 * Enlarge: 全屏
 */
const sizeIconMap = {
  'mini': ['Expand', 'Enlarge'],
  'wide': ['Shrink', 'Enlarge'],
  'full': ['Shrink']
}

const Header: React.FC<Props> = ({ onSizeChange }: Props) => {
  const [size, setSize] = useState<Size>('mini')

  const enlarge = () => {
    const next: Size = 'full'
    setSize(next)
    if (onSizeChange) {
      onSizeChange(next)
    }
  }
  const expand = () => {
    const next: Size = 'wide'
    setSize(next)
    if (onSizeChange) {
      onSizeChange(next)
    }
  }
  const shrink = () => {
    if (size === 'full') {
      const next: Size = 'wide'
      setSize('wide')
      if (onSizeChange) {
        onSizeChange(next)
      }
    } else if (size === 'wide') {
      const next: Size = 'mini'
      setSize('mini')
      if (onSizeChange) {
        onSizeChange(next)
      }
    }
  }

  const iconClickHandler = {
    Expand: expand,
    Shrink: shrink,
    Enlarge: enlarge
  }

  const onIconClick = (icon: string) => {
    if (typeof (iconClickHandler as any)[icon] === 'function') {
      (iconClickHandler as any)[icon].call(this)
    }
  }

  const renderIcons = () => {
    const icons = sizeIconMap[size] || []
    return icons.map((icon) => {
      switch (icon) {
        case 'Expand':
          return <ExpandO key={icon} onClick={() => onIconClick(icon)}/>
        case 'Shrink':
          return <Shrink key={icon} onClick={() => onIconClick(icon)}/>
        case 'Enlarge':
          return <Enlarge key={icon} onClick={() => onIconClick(icon)}/>
      }
    })
  }

  return (
    <div className="x-header">
      <div className="x-header__icon">{renderIcons()}</div>
    </div>
  )
}

export default Header;
