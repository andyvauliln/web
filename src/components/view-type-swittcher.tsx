import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"


type ContentTypeSwittcherProps = {
  value: string;
  onChange: () => void
};

export default function ContentTypeSwittcher({ value, onChange }: ContentTypeSwittcherProps): JSX.Element {

  return (
    <div className="flex items-center absolute bottom-2 right-2 space-x-2" onClick={onChange}>
      <Switch id={value} onCheckedChange={onChange} checked={value === 'Map'} />
      <Label className={`${value === 'Map' ? 'text-white' : 'text-gray-800'}`} htmlFor={value}>{'Map'}</Label>
    </div>
  )
}
