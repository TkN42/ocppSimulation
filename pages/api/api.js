// api/api.js

import { ok } from "assert";

export async function handler(req, res) {
  console.log("API çağrısı:", req.method, req.url);

      console.log("req = ******************************");
      console.log(req);
      console.log("*****************************************");
      
      console.log("res = ******************************");
      console.log(res);
      console.log("*****************************************");

  if (req.method === "POST") {
    switch (req.url) {
      case "/charge/start": {
        const responseData = { message: "Şarj başlatıldı", status:200 };
        console.log("Şarj başlatma API yanıtı:", responseData);
        //res.status(200).json(responseData);
        return responseData;
      }

      case "/charge/supported": {
        const endpoints = [
          { url: "/charge/start", method: "POST" },
          { url: "/charge/stop", method: "POST" },
        ];
        console.log("Desteklenen end noktaları API yanıtı:", endpoints);
        res.status(200).json(endpoints);
        return;
      }

      case "/charge/stop": {
        // Şarj durdurma işlemlerini burada gerçekleştirin
        const responseData = { message: "Şarj durduruldu", status:400 };
        console.log("Şarj durdurma API yanıtı:", responseData);
        //res.status(200).json(responseData);
        return responseData;
      }
      
      case "/charge/kw-hesapla": {
        const istasyonlar = req.data.istasyonlar; // İstek gövdesinden istasyonlar bilgisini al
        const aktifIstasyonSayisi = istasyonlar+1;
        
        // İstasyon sayısına göre kW'yi paylaştır
        const kW = 35; // Toplam kW'yi al
        
        let kWPerStation;

        if (aktifIstasyonSayisi >= 1 && aktifIstasyonSayisi <= 3) {
          kWPerStation = 10;
        } else if (aktifIstasyonSayisi === 4) {
          kWPerStation = 8.75;
        } else if (aktifIstasyonSayisi === 5) {
          kWPerStation = 7;
        }
        
        const responseData = {
          message: "kW paylaştırma başarılı",
          status: 200,
          kWPerStation,
        };
        
        console.log("kW hesaplama API yanıtı:", responseData);
        //res.status(200).json(responseData);
        return responseData;
      }

      default: {
        // GET ve PUT yöntemleri için 405 durum kodu döndür
        if (req.method === "GET" || req.method === "PUT") {
          res.status(405).json({ message: "Desteklenmeyen HTTP yöntemi" });
        }
        return;
      }
    }
  } else {
    // Diğer HTTP yöntemleri için 405 durum kodu döndür
    res.status(405).json({ message: "Desteklenmeyen HTTP yöntemi" });
  }
}
