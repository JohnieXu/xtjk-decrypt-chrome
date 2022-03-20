import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SideMenu.scss';

export interface MenuItem {
  name: string
  label: string
  to?: string | boolean | undefined
}

interface Props {
  menus: MenuItem[]
  onChange?: (menuItem: MenuItem) => void
}

function SideMenu({ menus = [], onChange }: Props) {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

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
    if (menuItem.to === true) {
      navigate(`/${menuItem.name}`)
    } else if (menuItem.to) {
      navigate(`/${menuItem.to}`)
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
