'use client'
import { Button } from "~/components/ui/button"
import { SheetTrigger, SheetTitle, SheetDescription, SheetHeader, SheetClose, SheetFooter, SheetContent, Sheet } from "~/components/ui/sheet"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { useState } from 'react'
import { Feature } from 'geojson'
//import { SignedIn, SignedOut } from "@clerk/nextjs";

type LandDetailsProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  currentLand: Feature | null | undefined;
};

export default function LandDetails({ isOpen, setIsOpen, currentLand }: LandDetailsProps) {
  const [name, setName] = useState('Pedro Duarte')
  const [username, setUsername] = useState('@peduarte')

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Land Profile</SheetTitle>

        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
            <Label className="text-right" htmlFor="name">
              Name
            </Label>
            <Input className="col-span-3" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
// Actions
// If currentLand land owner id is equal to user id then show edit button else hide
// Button to request Ownership
// Button to Request Land Details
// Button to  Request Dron Shooting
// Make Appointment to see the land
// Request Due Deligence
// Subscibe with whatsapp/telegram to land updates
// Ask Question to owner

// Fields

// Land Details
// Size
// Zone
// Type of ownership
// Content Certificates
// Content Photos
// Content Videous
// sold/rented/for rent/for buy
// Price
// Price per square meter
// Price per square meter per year
// For Rent or For Buy
// Full Land or Partial Land
// Views Count
// Saves Count
// Comments
// Price Low, Price High, Price Average
// Is Negotiable
// Coordinates
// Sutable for what?
// Nearest Attractions
// Nearest Restaurants
// Nearest Hotels
// Nearest Schools
// Nearest Universities
// Nearest Shops
// Is it View
// Due Diligence Field
// Pluses 
// Minuses 
// Region
// City
// ZipCode
// Description 

// Owner Details
// Owner Name
// Owner Email
// Owner Phone
// Is on Whatsapp
// Another Lands
// Is Subscribed for Updates with Whats up
// Updates Notifications
// Is Agent



// Buyer Details
// Buyer Name
// Buyer Email
// Buyer Phone
// Buyer Whatsapp
// Buyer Telegram
// Is Subscribed for Updates with Whats up
// Updates Notifications
// Asking Price
// Purpose of Asking


// Filter with opena AI no moderate messages
// Language Support
// Generate Video for Instagram/Facebook
// Post Video on Instagram/Facebook
// Draggable Coordinates


// User Stories


// Owner Stores







