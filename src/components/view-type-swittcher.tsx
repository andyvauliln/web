import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"

// Define a type for the props
type ContentTypeSwittcherProps = {
  value: string;
  onChange: () => void
};

export default function ContentTypeSwittcher({ value, onChange }: ContentTypeSwittcherProps): JSX.Element {

  return (
    <div className="flex items-center absolute bottom-2 right-2 space-x-2" onClick={onChange}>
      <Switch id={value} onClick={onChange} />
      <Label className={`${value === 'Map' ? 'text-white' : 'text-gray-800'}`} htmlFor={value}>{value === 'Map' ? 'List' : 'Map'}</Label>
    </div>
  )
}
