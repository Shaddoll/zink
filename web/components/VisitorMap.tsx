'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import VisitorStats from './VisitorStats'
import { useTranslation } from 'app/i18n/client'

const markerRadius = [8, 10, 12, 14]

function getMarkerRadius(value: number) {
  if (value < 10) return markerRadius[0]
  if (value < 100) return markerRadius[1]
  if (value < 1000) return markerRadius[2]
  return markerRadius[3]
}

const VisitorMap = ({ data, visits, startDate, currentDate, locale }) => {
  const MapContainer = dynamic(
    () => import('react-leaflet').then((module) => module.MapContainer),
    { ssr: false }
  )
  const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), {
    ssr: false,
  })
  const CircleMarker = dynamic(
    () => import('react-leaflet').then((module) => module.CircleMarker),
    { ssr: false }
  )
  const Popup = dynamic(() => import('react-leaflet').then((module) => module.Popup), {
    ssr: false,
  })
  const LayerGroup = dynamic(() => import('react-leaflet').then((module) => module.LayerGroup), {
    ssr: false,
  })
  const LayersControl = dynamic(
    () => import('react-leaflet').then((module) => module.LayersControl),
    { ssr: false }
  )
  const BaseLayer = dynamic(
    () => import('react-leaflet').then((module) => module.LayersControl.BaseLayer),
    { ssr: false }
  )
  const MarkerClusterGroup = dynamic(() => import('react-leaflet-cluster'), { ssr: false })
  const { t } = useTranslation(locale, 'visitor')
  return (
    <div className="flex min-h-full flex-col">
      <VisitorStats
        startDate={startDate}
        currentDate={currentDate}
        visits={visits}
        locale={locale}
      />
      <div className="flex-grow">
        {/* Takes up all available space */}
        <div className="relative h-[48rem] w-full">
          <MapContainer
            zoom={2}
            center={{ lat: 20, lng: 0 }}
            scrollWheelZoom={false}
            worldCopyJump={true}
            style={{ backgroundColor: 'transparent' }}
            className="absolute left-1/2 h-full w-[85vw] -translate-x-1/2 transform" // Make the map 150% of the container's width
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              minZoom={1}
            />
            <LayersControl>
              <BaseLayer checked name={t('distinct')}>
                <MarkerClusterGroup
                  showCoverageOnHover={false}
                  zoomToBoundsOnClick={true}
                  spiderfyOnMaxZoom={false}
                >
                  <LayerGroup>
                    {data.map((entry, index) => (
                      <CircleMarker
                        key={index}
                        center={[entry.location.lat, entry.location.lon]}
                        radius={getMarkerRadius(entry.distinctVisitors)}
                        pathOptions={{
                          fillColor: '#F8A400',
                          fillOpacity: 1,
                          weight: 0.5,
                          color: '#ffffff',
                        }}
                      >
                        <Popup>
                          <div>
                            <strong>{`${entry.city}:`}</strong> {entry.distinctVisitors} <br />
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </LayerGroup>
                </MarkerClusterGroup>
              </BaseLayer>
              <BaseLayer name={t('total')}>
                <MarkerClusterGroup
                  showCoverageOnHover={false}
                  zoomToBoundsOnClick={true}
                  spiderfyOnMaxZoom={false}
                >
                  <LayerGroup>
                    {data.map((entry, index) => (
                      <CircleMarker
                        key={index}
                        center={[entry.location.lat, entry.location.lon]}
                        radius={getMarkerRadius(entry.distinctVisitors)}
                        pathOptions={{
                          fillColor: '#FF0000',
                          fillOpacity: 0.7,
                          weight: 0.5,
                          color: '#ffffff',
                        }}
                      >
                        <Popup>
                          <div>
                            <strong>{`${entry.city}:`}</strong> {entry.totalVisits}
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                  </LayerGroup>
                </MarkerClusterGroup>
              </BaseLayer>
            </LayersControl>
          </MapContainer>
        </div>
      </div>
    </div>
  )
}

export default VisitorMap
