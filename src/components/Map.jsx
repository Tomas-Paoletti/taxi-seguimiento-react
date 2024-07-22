// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import CocheSVG from '../CocheSVG';
import { Client } from '@stomp/stompjs';

// eslint-disable-next-line react/prop-types
function EvtClickMapa({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });

  return null;
}

const Mapa = () => {
  const position = [51.505, -0.09];
  const [posicionCoche, setPosicionCoche] = useState([51.505, -0.09]);
  const [posicionAnterior, setPosicionAnterior] = useState([51.505, -0.09]);
  const [anguloCoche, setAnguloCoche] = useState(0);

  useEffect(() => {
    const cliente = new Client({
      brokerURL: 'ws://localhost:8080/websocket',
    });

    cliente.onConnect = () => {
      console.log('Conectado');
      cliente.subscribe('/taxi/coordenada', (message) => {
        const coordenada = JSON.parse(message.body);
        const puntoNuevo = [coordenada.x, coordenada.y];
        const anguloNuevo = calcularAnguloDireccionGPS(posicionAnterior, puntoNuevo);
        setPosicionAnterior(puntoNuevo);
        setPosicionCoche(puntoNuevo);
        setAnguloCoche(anguloNuevo);
      });
    };

    cliente.activate();
    return () => {
      if (cliente) {
        cliente.deactivate();
      }
    };
  }, [posicionAnterior]);

  const svgIconoCoche = L.divIcon({
    html: `<div class='svg-icon' style="transform: rotate(${anguloCoche}deg);">${CocheSVG}</div>`,
    className: 'svg-icon',
  });

  const calcularAnguloDireccionGPS = (puntoAnterior, puntoNuevo) => {
    const [lat1, lon1] = puntoAnterior;
    const [lat2, lon2] = puntoNuevo;
    const deltaX = lat2 - lat1;
    const deltaY = lon2 - lon1;
    const anguloRad = Math.atan2(deltaY, deltaX);
    const anguloGrados = (anguloRad * 180) / Math.PI;
    return anguloGrados;
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <header className="header">
        Ober
      </header>
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: 'calc(100% - 50px)', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <EvtClickMapa onClick={(c) => console.log('coordenadas.add(new Coordenada(' + c.lat + ', ' + c.lng + '));')} />
        <Marker position={posicionCoche} icon={svgIconoCoche} />
      </MapContainer>
    </div>
  );
};

export default Mapa;
