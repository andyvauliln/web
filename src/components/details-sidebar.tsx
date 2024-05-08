'use client'
import { SheetContent, Sheet } from "~/components/ui/sheet"
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import LandFilters from "~/components/land-filters"
import MapSettings from "~/components/property-map-settings"
import LandDetails from "~/components/land-details"

export const detailsSidebarAtom = atomWithStorage<any>('details_sidebar_data', null)

export default function DetailsSidebar() {
  const [detailsSidebarData, setDetailsSidebarData] = useAtom(detailsSidebarAtom)

  return (
    <Sheet open={detailsSidebarData?.isOpen} onOpenChange={e => setDetailsSidebarData({ ...detailsSidebarData, isOpen: !detailsSidebarData?.isOpen })}>
      <SheetContent className={`${detailsSidebarData?.bg || 'bg-transparent'} border-none w-auto ${detailsSidebarData?.size || 'h-full'}`} side={detailsSidebarData?.side}>
        {(() => {
          switch (detailsSidebarData?.content) {
            case 'land-filter':
              return <LandFilters />;
            case 'map-settings':
              return <MapSettings />;
            case 'land-details':
              return <LandDetails data={detailsSidebarData?.data} />;
            default:
              return <div>Sorry No Content Found.</div>;
          }
        })()}
      </SheetContent>
    </Sheet>
  )
}


{/* <SheetHeader>
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
<SheetFooter> */}
{/* <SheetClose asChild>
  <Button type="submit">Save changes</Button>
</SheetClose> 

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


*/}

