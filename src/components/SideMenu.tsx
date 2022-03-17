import React, { useState, useEffect } from 'react';
import './SideMenu.scss';

export interface MenuItem {
  name: string
  label: string
  to?: string
}

interface Props {
  menus: MenuItem[]
  onChange?: (menuItem: MenuItem) => void
}

function SideMenu({ menus = [], onChange }: Props) {
  const [active, setActive] = useState(null);

  // 默认选中第一个
  useEffect(() => {
    if (menus.length) {
      setActive(menus[0].name as any)
    }
  }, []);

  const handleMenuItemClick = (menuItem: MenuItem) => {
    setActive(menuItem.name as any);
    if (onChange) {
      onChange(menuItem);
    }
  }
  
  const renderMenuItem = (menuItem: MenuItem) => {
    return (
      <div className={`x-side-menu__item ${menuItem.name === active ? 'x-side-menu__item--active' : ''}`} key={menuItem.name} onClick={() => handleMenuItemClick(menuItem)}>
        { menuItem.label }
      </div>
    )
  }
  return (
    <div className="x-side-menu">
      {
        menus.map(renderMenuItem)
      }
    </div>
  );
}

export default SideMenu;
