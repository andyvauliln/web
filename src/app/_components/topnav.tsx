import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { SimpleUploadButton } from "./simple-upload-button";
import Image from "next/image";
import { Button } from "~/components/ui/button"

export function TopNav() {
  return (
    <header className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold border-gray-200">
      <div className="flex items-center gap-2">
        <Image src="/maba_bali_2.svg" alt="Mama Bali" width={60} height={60} style={{ marginTop: -20, marginBottom: -20 }} />
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Today Views: 653</span>
          <span className="text-sm text-gray-500">Today New: 15</span>
        </div>
      </div>

      <nav className="flex flex-row items-center gap-4">
        <SignedOut>
          <SignInButton>
            <Button variant="greenborder">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SimpleUploadButton />
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
}

