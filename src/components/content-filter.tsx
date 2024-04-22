import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"

export function ContentFilter() {
    return (
        <RadioGroup className="flex justify-between" defaultValue="search">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="search" id="r1" />
                <Label htmlFor="r1">Search</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="mine" id="r2" />
                <Label htmlFor="r2">Mine</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="saved" id="r3" />
                <Label htmlFor="r3">Saved</Label>
            </div>
        </RadioGroup>
    )
}
