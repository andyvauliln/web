import React from 'react';
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

const landFilters = atomWithStorage<string[]>('land_filters', ["all"])

const filterOptions = [
  { title: "All", value: "all" },
  { title: "Buy", value: "buy" },
  { title: "Rent", value: "rent" },
  // { title: "Sold", value: "sold" },
  { title: "Agent", value: "agent" },
  { title: "Owner", value: "owner" },
  { title: "Due Deligence", value: "due_deligence" },
  { title: "Photo", value: "photo" },
  { title: "Video", value: "video" },
  { title: "View", value: "view" },
  { title: "Ocean", value: "near_ocean" },
  { title: "River", value: "near_river" },
  { title: "Road", value: "road_access" },
  { title: "Electricity", value: "electricity" },
  { title: "Water", value: "water" },
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
    <div className="inline-flex flex-wrap py-2 items-center justify-between w-full px-2 ">
      <div className="shadow-sm shadow-gray-500  ">
        {filterOptions.map(option => (
          <label key={option.value} className={`cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium ${checkedValues.includes(option.value) ? 'text-blue-700 bg-gray-100' : 'text-gray-900 bg-white'} border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:text-white`}>
            <input type="checkbox" className="hidden" value={option.value} onChange={() => handleChange(option.value)} checked={checkedValues.includes(option.value)} />
            <span className="ml-2">{option.title}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <LandZoneFilter />
        <LandPriceFilter />
      </div>
    </div>
  )
}




function LandZoneFilter() {
  return (
    <Select>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Land Zone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="yellow">Yellow</SelectItem>
          <SelectItem value="green">Green</SelectItem>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="pink">Pink</SelectItem>
          <SelectItem value="purple">Orange</SelectItem>
          <SelectItem value="special">Special</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
function LandPriceFilter() {
  return (
    <Select>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Price" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
