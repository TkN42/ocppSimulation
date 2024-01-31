// app.js

import React, { useState } from 'react';
import { handler } from '../../my-nextjs-project/pages/api/api.js';

const Card = ({ stationNumber, status, available, handleChargeStart, handleChargeStop, kW }) => {
  return (
    <div>
      <hr></hr>
      <h1>OCPP Uygulaması - İstasyon {stationNumber}</h1>
      <p>Durum: {status}</p>
      <p>Kullanılabilirlik: {available ? "Evet" : "Hayır"}</p>
      <button onClick={handleChargeStart}>Şarj Başlat</button>
      <button onClick={handleChargeStop}>Şarj Durdur</button>
      <p>kW: {kW}</p>
      <hr></hr>
    </div>
  );
};

const App = () => {
  const [status, setStatus] = useState("");
  const [available, setAvailable] = useState(true);
  const [stations, setStations] = useState([
    { id: 1, status: "-", available: true, kW: 0  },
    { id: 2, status: "-", available: true, kW: 0  },
    { id: 3, status: "-", available: true, kW: 0  },
    { id: 4, status: "-", available: true, kW: 0  },
    { id: 5, status: "-", available: true, kW: 0  },
  ]);

  const handleChargeStart = async (stationId) => {
    const targetStation = stations.find(station => station.id === stationId);

  if (!targetStation || !targetStation.available) {
    console.error("Şarj başlatma hatası: İstasyon kullanılamıyor veya zaten bir şarj işlemi devam ediyor.");
    return;
  }

    try {

      const response2 = await handler({
        method: "POST",
        url: "/charge/kw-hesapla",
        data: {
          istasyonlar: stations.filter(station => !station.available).length,
        },
      });

      const kWPerStation = response2.kWPerStation;
      console.log("----------------------------KWPerStation: " + kWPerStation);

      const response = await handler({
        method: "POST",
        url: "/charge/start",
        data: {
          stationId,
          status: targetStation.status,
          available: targetStation.available,
          kW: targetStation.kW,
          totalUsedStations: stations.filter(station => !station.available).length,
          totalUsedKW: stations.reduce((total, station) => total + (station.available ? 0 : station.kW), 0),
        },
      });

          console.log("response = ******************************");
          console.log(response);
          console.log("*****************************************");

      if (!response) {
        
        console.error("Şarj başlatma hatası: Geçersiz API yanıtı", response);
        return;
      }

      console.log("Şarj başlatma API yanıtı:", response);

      if (response.status != 200) {
        console.error("Şarj başlatma hatası: Başarısız API yanıtı", response);
        return;
      }

      //const responseData = await response.json();

      // if (!responseData || !responseData.message) {
      //   console.error("Şarj başlatma hatası: Geçersiz API yanıt formatı", responseData);
      //   return;
      // }

      console.log("Şarj başlatma başarılı yanıt:", response.message);

      setStations(prevStations => {
        const updatedStations = [...prevStations];
        const stationIndex = updatedStations.findIndex(station => station.id === stationId);
        
        updatedStations.forEach(station => {
          if (!station.available) {
            station.kW = kWPerStation;
          }
        });

        if (stationIndex !== -1) {
          updatedStations[stationIndex].status = response.message;
          updatedStations[stationIndex].available = false;
          updatedStations[stationIndex].kW = kWPerStation;
        }

        return updatedStations;
      });
    } catch (error) {
      console.error("Şarj başlatma hatası:", error);
    }
  };

  const handleChargeStop = async (stationId) => {
    const targetStation = stations.find(station => station.id === stationId);

  if (!targetStation || targetStation.available) {
    console.error("Şarj durdurma hatası: İstasyon kullanılamıyor veya şarj işlemi başlamamış.");
    return;
  }

    try {
      const response2 = await handler({
        method: "POST",
        url: "/charge/kw-hesapla",
        data: {
          istasyonlar: stations.filter(station => !station.available).length - 2,
        },
      });

      const kWPerStation = response2.kWPerStation;
      console.log("----------------------------KWPerStation: " + kWPerStation);

      const response = await handler({
        method: "POST",
        url: "/charge/stop",
        data: {
          stationId,
          status: targetStation.status,
          available: targetStation.available,
          kW: targetStation.kW,
          totalUsedStations: stations.filter(station => !station.available).length,
          totalUsedKW: stations.reduce((total, station) => total + (station.available ? 0 : station.kW), 0),
        },
      });

      if (!response) {
        console.error("Şarj durdurma hatası: Geçersiz API yanıtı", response);
        return;
      }

      console.log("Şarj durdurma API yanıtı:", response);

      if (response.status != 400) {
        console.error("Şarj durdurma hatası: Başarısız API yanıtı", response);
        return;
      }

      // const responseData = await response.json();

      // if (!responseData || !responseData.message) {
      //   console.error("Şarj durdurma hatası: Geçersiz API yanıt formatı", responseData);
      //   return;
      // }

      console.log("Şarj durdurma başarılı yanıt:", response.message);

      setStations(prevStations => {
        const updatedStations = [...prevStations];
        const stationIndex = updatedStations.findIndex(station => station.id === stationId);

        updatedStations.forEach(station => {
          if (!station.available) {
            station.kW = kWPerStation;
          }
        });

        if (stationIndex !== -1) {
          updatedStations[stationIndex].status = response.message;
          updatedStations[stationIndex].available = true;
          updatedStations[stationIndex].kW = 0;
        }

        return updatedStations;
      });
    } catch (error) {
      console.error("Şarj durdurma hatası:", error);
    }
  };

  return (
    <div>
      {stations.map((station) => (
        <Card
          key={station.id}
          stationNumber={station.id}
          status={station.status}
          available={station.available}
          handleChargeStart={() => handleChargeStart(station.id)}
          handleChargeStop={() => handleChargeStop(station.id)}
          kW={station.kW}
        />
      ))}
    </div>
  );
};


export default App;
