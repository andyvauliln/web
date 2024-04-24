import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { SimpleUploadButton } from "./simple-upload-button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <div>
        <Image src="/maba_bali_2.svg" alt="Mama Bali" width={60} height={60} style={{ marginTop: -20, marginBottom: -20 }} />
      </div>

      <div className="flex flex-row items-center gap-4">
        <LanguageSwitcher />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <SimpleUploadButton />
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

function LanguageSwitcher() {
  return (
    <Select>
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