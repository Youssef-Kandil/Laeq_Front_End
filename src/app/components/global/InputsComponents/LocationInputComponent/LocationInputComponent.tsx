"use client";
import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import Modal from "react-modal";
import Styles from './LocationInputComponent.module.css';
import { LatLngExpression, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

import L from 'leaflet';
import { FaMapMarkerAlt, FaLocationArrow } from "react-icons/fa";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"
});

interface Props {
  label: string;
  placeholder: string;
  onChange: (value: {lat:string,long:string}) => void;
  value: {lat:string,long:string};
}

export default function LocationInputComponent({
  label,
  placeholder,
  value,
  onChange,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState<LatLngExpression | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTempLocation(null);
  };

  const saveLocation = () => {
    if (tempLocation) {
      const [lat, lng] = tempLocation as [number, number];
      onChange({lat: lat.toFixed(5), long:lng.toFixed(5)});
    }
    setIsModalOpen(false);
  };

  const LocationPicker = () => {
    useMapEvents({
      click(e) {
        setTempLocation([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const MapSetup = () => {
    const map = useMap();
    React.useEffect(() => {
      mapRef.current = map;
      map.invalidateSize();
    }, [map]);
    return null;
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
        setTempLocation(coords);

        if (mapRef.current) {
          mapRef.current.flyTo(coords, 15, {
            animate: true,
            duration: 1.5
          });
        }
      },
      (err) => {
        alert("حدث خطأ أثناء تحديد الموقع");
        console.error(err);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className={Styles.input}>
      <label className={Styles.lacel}>{label}</label>

      <div
        className={Styles.field}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={openModal}
      >
        <span>{value.lat?`lat:${value.lat},long:${value.long}` : placeholder}</span>
        <FaMapMarkerAlt style={{ fontSize: "20px", color: "#10b981" }} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="اختر الموقع"
        ariaHideApp={false}
        style={{
          content: {
            inset: "10%",
            padding: 0,
            overflow: "hidden",
            borderRadius: "12px",
          },
        }}
      >
        <div style={{ height: "85%", width: "100%", position: "relative" }}>
          <MapContainer
            center={[24.7136, 46.6753]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <MapSetup />
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker />
            {tempLocation && <Marker position={tempLocation} />}
          </MapContainer>

          <button
            onClick={handleUseCurrentLocation}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#10b981",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <FaLocationArrow />
            استخدم موقعي الحالي
          </button>
        </div>

        <div style={{
          height: "15%",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#f3f4f6",
          borderTop: "1px solid #e5e7eb"
        }}>
          <button
            style={{
              padding: "10px 20px",
              background: "#d1d5db",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
            onClick={closeModal}
          >
            إلغاء
          </button>
          <button
            style={{
              padding: "10px 20px",
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
            onClick={saveLocation}
            disabled={!tempLocation}
          >
            حفظ الموقع
          </button>
        </div>
      </Modal>
    </div>
  );
}
