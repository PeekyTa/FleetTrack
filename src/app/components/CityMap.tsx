import React, { useState, useRef, useEffect } from 'react';
import { devices as allDevices, Device, GeofenceZone, historyPath } from '../data/mockData';
const W = 1200;
const H = 700;
const STATUS_COLORS: Record<string, string> = {
  online: '#10B981',
  offline: '#94A3B8',
  'low-battery': '#F59E0B',
  warning: '#F97316',
};
function generateBlocks() {
  const majorH = [0, 140, 280, 420, 560, 700];
  const majorV = [0, 160, 320, 480, 640, 800, 960, 1120, 1280];
  const allH = majorH;
  const allV = majorV;
  const blocks: { x: number; y: number; w: number; h: number; shade: number }[] = [];
  const rng = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  let seed = 0;
  for (let r = 0; r < allH.length - 1; r++) {
    for (let c = 0; c < allV.length - 1; c++) {
      const y0 = allH[r], y1 = allH[r + 1];
      const x0 = allV[c], x1 = allV[c + 1];
      const cellW = x1 - x0;
      const cellH = y1 - y0;
      const margin = 10;
      const halfW = Math.floor(cellW / 2);
      const halfH = Math.floor(cellH / 2);
      const gap = 8;
      const subCells = [
        { sx: x0 + margin, sy: y0 + margin, sw: halfW - margin - gap / 2, sh: halfH - margin - gap / 2 },
        { sx: x0 + halfW + gap / 2, sy: y0 + margin, sw: cellW - halfW - margin - gap / 2, sh: halfH - margin - gap / 2 },
        { sx: x0 + margin, sy: y0 + halfH + gap / 2, sw: halfW - margin - gap / 2, sh: cellH - halfH - margin - gap / 2 },
        { sx: x0 + halfW + gap / 2, sy: y0 + halfH + gap / 2, sw: cellW - halfW - margin - gap / 2, sh: cellH - halfH - margin - gap / 2 },
      ];
      for (const sc of subCells) {
        seed++;
        const shade = Math.floor(rng(seed) * 25);
        if (sc.sw > 8 && sc.sh > 8 && sc.sx + sc.sw <= W && sc.sy + sc.sh <= H) {
          blocks.push({ x: sc.sx, y: sc.sy, w: sc.sw, h: sc.sh, shade });
        }
      }
    }
  }
  return blocks;
}
const cityBlocks = generateBlocks();
function CityBackground() {
  return (
    <g>
      {}
      <rect width={W} height={H} fill="#E8EDF4" />
      {}
      {cityBlocks.map((b, i) => (
        <rect
          key={i}
          x={b.x} y={b.y}
          width={b.w} height={b.h}
          fill={`rgb(${200 - b.shade}, ${208 - b.shade}, ${218 - b.shade})`}
          rx={2}
        />
      ))}
      {}
      <rect x={330} y={155} width={140} height={110} fill="#BBE4C4" rx={4} />
      <rect x={340} y={162} width={128} height={98} fill="#A8DAAA" rx={3} />
      <text x={404} y={218} textAnchor="middle" fill="#4B9A5A" fontSize={10} fontFamily="Inter" fontWeight={600}>PARK</text>
      <rect x={770} y={445} width={160} height={100} fill="#BBE4C4" rx={4} />
      <rect x={780} y={452} width={148} height={88} fill="#A8DAAA" rx={3} />
      <text x={850} y={500} textAnchor="middle" fill="#4B9A5A" fontSize={10} fontFamily="Inter" fontWeight={600}>PARK</text>
      <rect x={70} y={280} width={80} height={130} fill="#BBE4C4" rx={4} />
      <rect x={78} y={287} width={68} height={118} fill="#A8DAAA" rx={3} />
      {}
      <path
        d={`M 0,620 Q 200,600 380,630 Q 560,660 740,640 Q 920,620 1200,650 L 1200,700 L 0,700 Z`}
        fill="#BFDBFE"
        opacity={0.8}
      />
      <path
        d={`M 0,625 Q 200,608 380,635 Q 560,662 740,644 Q 920,624 1200,654`}
        fill="none"
        stroke="#93C5FD"
        strokeWidth={2}
      />
      <text x={600} y={672} textAnchor="middle" fill="#60A5FA" fontSize={11} fontFamily="Inter" fontWeight={500} opacity={0.8}>
        RIVER DISTRICT
      </text>
      {}
      {[0, 140, 280, 420, 560, 700].map((y, i) => (
        <line key={`mh${i}`} x1={0} y1={y} x2={W} y2={y} stroke="white" strokeWidth={14} />
      ))}
      {}
      {[0, 160, 320, 480, 640, 800, 960, 1120, W].map((x, i) => (
        <line key={`mv${i}`} x1={x} y1={0} x2={x} y2={H} stroke="white" strokeWidth={14} />
      ))}
      {}
      {[70, 210, 350, 490, 630].map((y, i) => (
        <line key={`nh${i}`} x1={0} y1={y} x2={W} y2={y} stroke="#F0F4F8" strokeWidth={6} />
      ))}
      {}
      {[80, 240, 400, 560, 720, 880, 1040, 1200].map((x, i) => (
        <line key={`nv${i}`} x1={x} y1={0} x2={x} y2={H} stroke="#F0F4F8" strokeWidth={6} />
      ))}
      {}
      {[
        { x: 80, y: 136, text: '1st Ave', rot: -90 },
        { x: 240, y: 136, text: 'Broadway', rot: -90 },
        { x: 400, y: 136, text: 'Park Ave', rot: -90 },
        { x: 560, y: 136, text: 'Central Blvd', rot: -90 },
        { x: 720, y: 136, text: 'Harbor Rd', rot: -90 },
        { x: 880, y: 136, text: 'East Ave', rot: -90 },
      ].map((lbl, i) => (
        <text
          key={i}
          x={lbl.x} y={lbl.y}
          transform={`rotate(${lbl.rot}, ${lbl.x}, ${lbl.y})`}
          textAnchor="middle"
          fill="#A0AEC0"
          fontSize={9}
          fontFamily="Inter"
          fontWeight={500}
        >{lbl.text}</text>
      ))}
      {[
        { x: 80, y: 130, text: 'Main St' },
        { x: 80, y: 270, text: 'Market Ave' },
        { x: 80, y: 410, text: 'Commerce Rd' },
        { x: 80, y: 550, text: 'Harbor Blvd' },
      ].map((lbl, i) => (
        <text key={i} x={lbl.x} y={lbl.y} textAnchor="start" fill="#A0AEC0" fontSize={9} fontFamily="Inter" fontWeight={500}>{lbl.text}</text>
      ))}
      {}
      <g transform="translate(1140, 50)">
        <circle r={24} fill="white" opacity={0.9} />
        <circle r={22} fill="white" stroke="#E2E8F0" strokeWidth={1} />
        <text y={-6} textAnchor="middle" fill="#1E40AF" fontSize={11} fontFamily="Inter" fontWeight={700}>N</text>
        <line x1={0} y1={-2} x2={0} y2={-16} stroke="#1E40AF" strokeWidth={2} strokeLinecap="round" />
        <line x1={0} y1={2} x2={0} y2={16} stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
        <line x1={-2} y1={0} x2={-16} y2={0} stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
        <line x1={2} y1={0} x2={16} y2={0} stroke="#94A3B8" strokeWidth={2} strokeLinecap="round" />
      </g>
      {}
      <g transform="translate(40, 660)">
        <rect x={0} y={0} width={80} height={4} fill="#94A3B8" rx={2} />
        <rect x={0} y={0} width={40} height={4} fill="#64748B" rx={2} />
        <text x={0} y={-4} fill="#64748B" fontSize={9} fontFamily="Inter">0</text>
        <text x={36} y={-4} fill="#64748B" fontSize={9} fontFamily="Inter">500m</text>
        <text x={76} y={-4} fill="#64748B" fontSize={9} fontFamily="Inter">1km</text>
      </g>
    </g>
  );
}
interface DeviceMarkerProps {
  device: Device;
  selected?: boolean;
  onClick?: (d: Device) => void;
}
function DeviceMarker({ device, selected, onClick }: DeviceMarkerProps) {
  const color = STATUS_COLORS[device.status];
  const { mapX: x, mapY: y } = device;
  const isActive = device.status === 'online' || device.status === 'low-battery' || device.status === 'warning';
  return (
    <g onClick={() => onClick?.(device)} style={{ cursor: 'pointer' }}>
      {}
      {isActive && (
        <circle
          cx={x} cy={y} r={16}
          fill={color}
          opacity={0.25}
          style={{
            transformOrigin: `${x}px ${y}px`,
            animation: `markerPing ${device.status === 'warning' ? '1.2s' : '2s'} ease-in-out infinite`,
          }}
        />
      )}
      {}
      {selected && (
        <circle cx={x} cy={y} r={22} fill="none" stroke="#1E40AF" strokeWidth={3} strokeDasharray="4 2" opacity={0.8} />
      )}
      {}
      <circle cx={x} cy={y} r={10} fill={color} stroke="white" strokeWidth={2.5} />
      {}
      <rect x={x + 13} y={y - 12} width={46} height={16} rx={4} fill="white" opacity={0.92} />
      <text x={x + 36} y={y - 1} textAnchor="middle" fill="#0F172A" fontSize={9} fontFamily="Inter" fontWeight={600}>
        {device.id}
      </text>
    </g>
  );
}
type MapMode = 'live' | 'history' | 'geofence';
interface CityMapProps {
  mode?: MapMode;
  selectedDeviceId?: string | null;
  onDeviceClick?: (device: Device) => void;
  filterGroup?: string;
  geofenceZones?: GeofenceZone[];
  historyDeviceId?: string;
  historyProgress?: number;
}
export function CityMap({
  mode = 'live',
  selectedDeviceId,
  onDeviceClick,
  filterGroup = 'All Groups',
  geofenceZones = [],
  historyDeviceId,
  historyProgress = 100,
}: CityMapProps) {
  const [zoom, setZoom] = useState(1);
  const [mapType, setMapType] = useState<'map' | 'satellite'>('map');
  const filteredDevices = allDevices.filter(d =>
    filterGroup === 'All Groups' || d.group === filterGroup
  );
  const progressIndex = Math.max(1, Math.ceil((historyProgress / 100) * historyPath.length));
  const visiblePath = historyPath.slice(0, progressIndex);
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#E8EDF4] rounded-xl">
      {}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
          className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
          style={{ fontSize: 18, fontWeight: 700 }}
        >+</button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
          className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 border border-slate-200 transition-colors"
          style={{ fontSize: 18, fontWeight: 700 }}
        >−</button>
      </div>
      {}
      <div className="absolute top-3 right-3 z-10 flex bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
        {(['map', 'satellite'] as const).map(t => (
          <button
            key={t}
            onClick={() => setMapType(t)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${mapType === t ? 'bg-blue-700 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >{t}</button>
        ))}
      </div>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s ease' }}
      >
        <defs>
          <style>{`
            @keyframes markerPing {
              0% { transform: scale(1); opacity: 0.7; }
              75%, 100% { transform: scale(2.8); opacity: 0; }
            }
          `}</style>
          {mapType === 'satellite' && (
            <filter id="satFilter">
              <feColorMatrix type="saturate" values="1.4" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="0.8" intercept="0.05" />
                <feFuncG type="linear" slope="0.85" intercept="0.03" />
                <feFuncB type="linear" slope="0.7" intercept="0.1" />
              </feComponentTransfer>
            </filter>
          )}
        </defs>
        <g filter={mapType === 'satellite' ? 'url(#satFilter)' : undefined}>
          <CityBackground />
        </g>
        {}
        {mode === 'geofence' && geofenceZones.map(zone => (
          <g key={zone.id} opacity={zone.active ? 1 : 0.4}>
            {zone.type === 'polygon' && zone.points && (
              <>
                <polygon
                  points={zone.points.map(p => `${p.x},${p.y}`).join(' ')}
                  fill={zone.color}
                  fillOpacity={0.12}
                  stroke={zone.color}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                />
                {zone.points && (
                  <text
                    x={zone.points.reduce((s, p) => s + p.x, 0) / zone.points.length}
                    y={zone.points.reduce((s, p) => s + p.y, 0) / zone.points.length}
                    textAnchor="middle"
                    fill={zone.color}
                    fontSize={12}
                    fontFamily="Inter"
                    fontWeight={600}
                  >{zone.name.split(' — ')[0]}</text>
                )}
              </>
            )}
            {zone.type === 'circle' && zone.center && zone.radius && (
              <>
                <circle
                  cx={zone.center.x} cy={zone.center.y}
                  r={zone.radius}
                  fill={zone.color}
                  fillOpacity={0.12}
                  stroke={zone.color}
                  strokeWidth={2}
                  strokeDasharray="6 3"
                />
                <text
                  x={zone.center.x} y={zone.center.y + 4}
                  textAnchor="middle"
                  fill={zone.color}
                  fontSize={12}
                  fontFamily="Inter"
                  fontWeight={600}
                >{zone.name.split(' — ')[0]}</text>
              </>
            )}
          </g>
        ))}
        {}
        {mode === 'history' && visiblePath.length > 1 && (
          <g>
            <polyline
              points={visiblePath.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#1E40AF"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 4"
            />
            {visiblePath.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={5} fill="#1E40AF" stroke="white" strokeWidth={2} />
                {i === 0 && (
                  <>
                    <circle cx={p.x} cy={p.y} r={12} fill="#10B981" fillOpacity={0.2} />
                    <circle cx={p.x} cy={p.y} r={7} fill="#10B981" stroke="white" strokeWidth={2} />
                  </>
                )}
              </g>
            ))}
            {}
            <circle cx={visiblePath[visiblePath.length - 1].x} cy={visiblePath[visiblePath.length - 1].y} r={14} fill="#1E40AF" fillOpacity={0.2} />
            <circle cx={visiblePath[visiblePath.length - 1].x} cy={visiblePath[visiblePath.length - 1].y} r={8} fill="#1E40AF" stroke="white" strokeWidth={2.5} />
            <text
              x={visiblePath[visiblePath.length - 1].x + 14}
              y={visiblePath[visiblePath.length - 1].y - 10}
              fill="#1E40AF"
              fontSize={10}
              fontFamily="Inter"
              fontWeight={600}
            >{visiblePath[visiblePath.length - 1].time}</text>
          </g>
        )}
        {}
        {mode === 'live' && filteredDevices.map(device => (
          <DeviceMarker
            key={device.id}
            device={device}
            selected={device.id === selectedDeviceId}
            onClick={onDeviceClick}
          />
        ))}
        {}
        {mode === 'geofence' && filteredDevices.map(device => (
          <DeviceMarker
            key={device.id}
            device={device}
            selected={device.id === selectedDeviceId}
            onClick={onDeviceClick}
          />
        ))}
      </svg>
    </div>
  );
}
