// pages/index.js
import { useEffect } from 'react';
import OCPP from 'ocpp';

function Home() {
  useEffect(() => {
    const chargePoint = new OCPP.ChargePoint({
      id: 'charge-point-1',
      connectorId: 1,
      url: 'ws://localhost:9220/ChargeBox/Ocpp2/1',
    });

    chargePoint.connect();

    chargePoint.on('connected', () => {
      console.log('Connected to the Charging Station');
      
      chargePoint.bootNotification({
        chargingStation: 'My Charging Station',
        chargingStationModel: 'Model XYZ',
      });
    });

    chargePoint.on('boot.notification', (payload) => {
      console.log('Received Boot Notification:', payload);
    });

    return () => {
      chargePoint.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>OCPP Example with Next.js</h1>
      <p>Check the browser console for OCPP events.</p>
    </div>
  );
}

export default Home;
