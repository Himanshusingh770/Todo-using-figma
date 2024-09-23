import React, { useEffect, useState } from 'react';
import { Wifi, BatteryFull, Reception4 } from 'react-bootstrap-icons'; // Icons

const Header = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header">
      <div className="time">{time}</div>
      <div className="icons">
        <Reception4 className="icon"  />
        <Wifi className="icon" />
        <BatteryFull className="icon" />
      </div>
    </div>
  );
};

export default Header;
