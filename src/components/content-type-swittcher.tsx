import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"

// Define a type for the props
type ContentTypeSwittcherProps = {
  value: string;
  onChange: () => void
};

export default function ContentTypeSwittcher({ value, onChange }: ContentTypeSwittcherProps): JSX.Element {

  return (
    <div className="flex items-center space-x-2" onClick={onChange}>
      <Switch id={value} onClick={onChange} checked={value === "map"} />
      <Label htmlFor={value}>{value}</Label>
    </div>
  )
}
