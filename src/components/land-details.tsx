'use client'
import React from 'react';
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import { SheetTitle } from "~/components/ui/sheet"
import { Button } from "~/components/ui/button"
import { getRandomLand, getIsDetails, getIsOwner } from '~/components/mocks';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    AccordionTriggerCustom,
    ActionArrowIcon
} from "~/components/ui/accordion"


export default function LandDetails({ data }: { data: any }) {
    console.log(data, "data")
    data["land"] = getRandomLand()
    const isDetails = getIsDetails()
    const isOwner = getIsOwner()

    return (
        <div className='w-[20rem]'>
            <SheetTitle>Land Details</SheetTitle>
            {data["land"].land_bools.is_details ? <LandWithoutDetails data={data} /> :
                data["land"].land_bools.is_user_owner ? <OwnerLandView data={data} /> : <UserLandView data={data} />}
        </div>
    )
}

function OwnerLandView(data: any) {
    return <div></div>
}
function UserLandView(data: any) {
    return <div></div>
}


function LandWithoutDetails(data: any) {
    const land = getRandomLand()

    return <>
        <div className=' w-auto border-gray-200 py-2 grid grid-cols-3 gap-2'>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">{land?.land_size}</span>
            <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400">{land?.region?.name}</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">No Details</span>
        </div>

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className='hover:border-t hover:border-green-700'>
                <AccordionTriggerCustom className='hover:text-green-700' >
                    <span className='font-bold '>Ownership Type:</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">{land?.ownership_type?.name}</span>
                </AccordionTriggerCustom>
                <AccordionContent>
                    {land?.ownership_type?.description}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className='hover:border-t hover:border-green-700'>
                <AccordionTriggerCustom className='hover:text-green-700' >
                    <span className='font-bold '>Land Zone:</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">{land?.land_zone?.title}</span>
                </AccordionTriggerCustom>
                <AccordionContent>
                    {land?.land_zone?.description}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className='hover:border-t hover:border-green-700'>
                <AccordionTriggerCustom className='hover:text-green-700' >
                    <span className='font-bold '>Request Land:</span>
                    <ActionArrowIcon />
                </AccordionTriggerCustom>
                <AccordionContent>
                    <div>Information for Request Land</div>
                    <div className="flex justify-end">
                        <Button className='mt-2'>Process</Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className='hover:border-t hover:border-green-700'>
                <AccordionTriggerCustom className='hover:text-green-700' >
                    <span className='font-bold '>Request Drone Video:</span>
                    <ActionArrowIcon />
                </AccordionTriggerCustom>
                <AccordionContent>
                    <div>Information for Request Drone Video</div>
                    <div className="flex justify-end">
                        <Button className='mt-2'>Process</Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className='hover:border-t hover:border-green-700'>
                <AccordionTriggerCustom className='hover:text-green-700' >
                    <span className='font-bold '>Request Land Ownership:</span>
                    <ActionArrowIcon />
                </AccordionTriggerCustom>
                <AccordionContent>
                    <div>Information for Request Drone Video</div>
                    <div className="flex justify-end">
                        <Button className='mt-2'>Process</Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </>
}

