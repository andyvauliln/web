import React from 'react';
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import { SheetTitle } from "~/components/ui/sheet"

const landFilters = atomWithStorage<string[]>('land_filters', ["all"])

const filterOptions = [
  { title: "All Lands", value: "all", className: "border-b border-gray-500 pb-2" },
  { title: "Lends For Buy", value: "buy", className: "" },
  { title: "Lends For Rent", value: "rent", className: "border-b border-gray-500 pb-2" },
  { title: "Yellow Zone", value: "yellow_zone", className: "text-yellow-500" },
  { title: "Green Zone", value: "green_zone", className: "text-green-500" },
  { title: "Red Zone", value: "red_zone", className: "text-red-500" },
  { title: "Pink Zone", value: "pink_zone", className: "text-pink-500" },
  { title: "Orange Zone", value: "orange_zone", className: "text-orange-500" },
  { title: "Special Economic Zone", value: "special_zone", className: "border-b border-gray-500 pb-2" },
  { title: "Low Price", value: "price_low" },
  { title: "Market Price", value: "price_medium" },
  { title: "High Price", value: "price_high", className: "border-b border-gray-500 pb-2" },
  { title: "Lands From Agent", value: "agent" },
  { title: "Lands From Owner", value: "owner", className: "border-b border-gray-500 pb-2" },
  { title: "With Due Deligence", value: "due_deligence" },
  { title: "With Photo", value: "photo" },
  { title: "With Video", value: "video", className: "border-b border-gray-500 pb-2" },
  { title: "With Mountain View", value: "mountain_view" },
  { title: "With Ocean View", value: "ocean_view" },
  { title: "With Rice Field View", value: "rice_field_view" },
  { title: "With Valley View", value: "vallay_view" },
  { title: "Near Ocean", value: "near_ocean" },
  { title: "Near River", value: "near_river", className: "border-b border-gray-500 pb-2" },
  { title: "With Road Access", value: "road_access" },
  { title: "With Electricity", value: "electricity" },
  { title: "With Water", value: "water", className: "border-b border-gray-500 pb-2" },
  { title: "Sold Lands", value: "sold" },

];


export default function LandFilters() {
  const [checkedValues, setCheckedValues] = useAtom(landFilters)

  const handleChange = (newValue: string) => {
    if (newValue === "all") {
      setCheckedValues(["all"]);
    } else {
      if (checkedValues.includes(newValue)) {
        setCheckedValues(checkedValues.filter(item => item !== newValue));
      } else {
        setCheckedValues([...checkedValues.filter(item => item !== "all"), newValue]);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col py-2 w-full h-full px-2 overflow-auto">
        {filterOptions.map(option => (
          <div key={option.value} className={"flex items-center me-4 my-1 cursor-pointer " + option.className}>
            <div className="checkbox-wrapper-8">
              <input className="tgl tgl-skewed" id={option.value} onChange={() => handleChange(option.value)} type="checkbox" checked={checkedValues.includes(option.value)} />
              <label className="tgl-btn" data-tg-off="OFF" data-tg-on="ON" htmlFor={option.value}></label>
            </div>
            <label htmlFor={option.value} className="cursor-pointer hover:text-white font-bold ms-3 text-base text-gray-400" onChange={() => handleChange(option.value)}>{option.title}</label>
          </div>
        ))}
      </div>
    </>
  )
}


