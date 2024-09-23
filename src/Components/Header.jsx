import React from 'react';
import { Wifi, BatteryFull, Reception4 } from 'react-bootstrap-icons'; // Icons

const Header = () => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="header">
      <div className="time">{formattedTime}</div>
      <div className="icons">
        <Reception4 className="icon" />
        <Wifi className="icon" />
        <BatteryFull className="icon" />
      </div>
    </div>
  );
};

export default Header;
