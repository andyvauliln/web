//import { SignedIn, SignedOut } from "@clerk/nextjs";
'use client'
import TopTabs from "~/components/top-tabs";
export const dynamic = "force-dynamic";


export default function HomePage() {
 
  return (
    <>
     <TopTabs />
   
    </>
  );
}

// <SignedOut>
// <div className="h-full w-full text-center text-2xl">
//   Please sign in above
// </div>
// </SignedOut>
// <SignedIn>
// <Images />
// </SignedIn>