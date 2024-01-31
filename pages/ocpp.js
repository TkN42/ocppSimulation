// pages/ocpp.js
import { useState } from 'react';
import { ChargePoint } from 'ocpp';

const OCPPExample = () => {
  const [connectionStatus, setConnectionStatus] = useState('');

  const connectToOCPP = async () => {
    try {
      // OCPP bağlantısı için gerekli bilgiler buraya gelecek.
      const chargePoint = new ChargePoint('ws://ocpp-server-url');

      // Bağlantıyı başlat
      await chargePoint.connect();

      setConnectionStatus('Connected to OCPP');
    } catch (error) {
      console.error('Error connecting to OCPP:', error);
      setConnectionStatus('Connection error');
    }
  };

  return (
    <div>
      <h1>OCPP Example with Next.js</h1>
      <button onClick={connectToOCPP}>Connect to OCPP</button>
      <p>Connection Status: {connectionStatus}</p>
    </div>
  );
};

export default OCPPExample;
