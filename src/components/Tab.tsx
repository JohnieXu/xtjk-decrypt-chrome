import React, { useState, useEffect } from 'react';
import './Tab.scss';

interface Props {
  active: string;
  options: Option[];
  onUpdateActive?: (active: string) => void
}

interface Option {
  name: string;
  title: string;
}

const Tab: React.FC<Props> = ({ active, options = [], onUpdateActive }: Props) => {
  const [curActive, setCurActive] = useState("")

  useEffect(() => {
    setCurActive(active)
  }, [active])

  const handleItemClick = (name: string) => {
    setCurActive(name)
    onUpdateActive && onUpdateActive(name)
  }

  const renderSelectOptions = () => {
    return <>
      {
        options.map(({ name, title }) => (
          <div className={`x-tab__options__item ${curActive === name ? 'active' : ''}`} key={name} onClick={() => handleItemClick(name)}>{title}</div>
        ))
      }
    </>
  }
  return <div className="x-tab">
    <div className="x-tab__options">
    {renderSelectOptions()}
    </div>
  </div>;
};

export default Tab;
