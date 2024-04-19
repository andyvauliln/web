//import { SignedIn, SignedOut } from "@clerk/nextjs";
//import Images from "./_components/images";
import GoogleMap from "../components/maps/google";
//import DeckMap from "./_components/maps/deck";
import TopTabs from "~/components/top_tabs";

export const dynamic = "force-dynamic";


export default async function HomePage() {
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