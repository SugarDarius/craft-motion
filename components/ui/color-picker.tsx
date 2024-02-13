'use client'

import useEvent from 'react-use-event-hook'

import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const solids = [
  '#000000', // Black
  '#FF0000', // Red
  '#00FF00', // Lime
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#00FFFF', // Aqua/Cyan
  '#FF00FF', // Fuchsia/Magenta
  '#C0C0C0', // Silver
  '#808080', // Gray
  '#800000', // Maroon
  '#808000', // Olive
  '#800080', // Purple
  '#008000', // Green
  '#008080', // Teal
  '#000080', // Navy
  '#FFA500', // Orange
  '#A52A2A', // Brown
  '#DEB887', // BurlyWood
  '#5F9EA0', // CadetBlue
  '#7FFF00', // Chartreuse
  '#D2691E', // Chocolate
  '#FF7F50', // Coral
  '#6495ED', // CornflowerBlue
  '#DC143C', // Crimson
  '#00FFFF', // Cyan
  '#00008B', // DarkBlue
  '#008B8B', // DarkCyan
  '#B8860B', // DarkGoldenRod
  '#A9A9A9', // DarkGray
  '#006400', // DarkGreen
  '#BDB76B', // DarkKhaki
  '#8B008B', // DarkMagenta
]

export function ColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const handleInputChange = useEvent(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      onChange(e.target.value)
    }
  )

  const handleSolidColorClick = useEvent((value: string): void => {
    onChange(value)
  })

  return (
    <div className='flex flex-row items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button size='icon' variant='outline' className='shrink-0 p-2'>
            <div
              className='h-full w-full rounded-sm'
              style={{ backgroundColor: value }}
            ></div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-fit p-2'>
          <div className='flex max-h-[320px] max-w-[252px] flex-row flex-wrap gap-1 overflow-y-auto'>
            {solids.map((solid) => (
              <div
                key={solid}
                style={{ backgroundColor: solid }}
                className='h-6 w-6 cursor-pointer rounded-md active:scale-105'
                onClick={() => handleSolidColorClick(solid)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Input type='text' value={value} onChange={handleInputChange} />
    </div>
  )
}
