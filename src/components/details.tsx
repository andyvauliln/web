'use client'
import { Button } from "~/components/ui/button"
import { SheetTrigger, SheetTitle, SheetDescription, SheetHeader, SheetClose, SheetFooter, SheetContent, Sheet } from "~/components/ui/sheet"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { useState } from 'react'

export default function Details({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (value: boolean) => void}) {
  const [name, setName] = useState('Pedro Duarte')
  const [username, setUsername] = useState('@peduarte')

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Name
            </Label>
            <Input className="col-span-3" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="username">
              Username
            </Label>
            <Input className="col-span-3" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
