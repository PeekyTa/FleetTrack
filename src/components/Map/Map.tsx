import React from 'react';
import { NavLink } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { CityMap } from '../../app/components/CityMap';
export function Map() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-800 font-semibold" style={{ fontSize: 15 }}>Live Fleet Location</h3>
        <NavLink to="/map" className="text-blue-600 flex items-center gap-1 hover:text-blue-700" style={{ fontSize: 12 }}>
          Expand map <ChevronRight size={14} />
        </NavLink>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden relative">
        <CityMap mode="live" filterGroup="All Groups" />
      </div>
    </div>
  );
}
