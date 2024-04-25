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

const propertyTypeFilter = atomWithStorage<string>('property_type_filters', "land")
const propertyTypes = [
    { value: 'land', label: 'Lands' },
    { value: 'property', label: 'Properties' },
    { value: 'contractors', label: 'Contractors' },
    { value: 'mine', label: 'Mine' },
    { value: 'saved', label: 'Saved' },
    { value: 'info', label: 'Info' }
];
export function PropertyTypeFilter() {
    const [currentTab, setCurrentTab] = useAtom(propertyTypeFilter)
    console.log(currentTab, "value")
    const handleChange = (newValue: string) => {
        setCurrentTab(newValue);
    }

    return (
        <footer className='flex items-center justify-between w-full'>
            <nav className="inline-flex rounded-md shadow-sm" role="group">
                {propertyTypes.map((type, index) => (
                    <button
                        key={type.value}
                        type="button"
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium  border  ${type.value != currentTab ? 'hover:text-gray-800 hover:bg-gray-50' : ''}  ${currentTab === type.value ? 'bg-green-700 text-white border-green-800' : ' bg-white text-gray-900 border-gray-200'} ${index === 0 ? 'rounded-s-lg' : ''} ${index === propertyTypes.length - 1 ? 'rounded-e-lg' : ''}`}
                        onClick={() => handleChange(type.value)}
                    >
                        <Icons key={type.value} value={type.value} isActive={currentTab === type.value} />
                        {type.label}
                    </button>
                ))
                }
            </nav >

            <LanguageSwitcher />

        </footer>
    )
}

function LanguageSwitcher() {
    return (
        <Select defaultValue="en">
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ind">Indonesian</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="id">Indian</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function Icons({ isActive, value }: { isActive: boolean, value: string }) {
    const svgStyles = `w-5 h-5 me-2 ${isActive ? 'bg-green-700 text-white' : "hover:text-gray-800 hover:bg-gray-50 bg-white text-gray-900"}`
    switch (value) {
        case 'land':
            return (
                <svg className={svgStyles} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z" clipRule="evenodd" />
                </svg>
            );
        case 'property':
            return (
                <svg className={svgStyles} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
                </svg>
            );
        case 'contractors':
            return (
                <svg className={svgStyles} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd" />
                </svg>
            );
        case 'mine':
            return (
                <svg className={svgStyles} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
                </svg>
            );
        case 'saved':
            return (
                <svg className={svgStyles} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z" />
                </svg>
            );
        case 'info':
            return (
                <svg className={svgStyles} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
                </svg>
            )
        default:
            return null;
    }
};

