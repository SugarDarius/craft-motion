'use client'

import { useState } from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import useEvent from 'react-use-event-hook'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'
import { eases } from '@/lib/animations'

const remap = (ease: string): string => {
  const corresponding = eases.find((easeKey) => easeKey.toLowerCase() === ease)
  return corresponding ?? 'linear'
}

export function EaseComboBox({
  value,
  onSelect,
  isDisabled,
}: {
  value: string
  onSelect: (ease: string) => void
  isDisabled: boolean
}) {
  const [isOpen, setOpenState] = useState<boolean>(false)

  const handleSelect = useEvent((ease: string): void => {
    onSelect(remap(ease))
    setOpenState(false)
  })

  return (
    <Popover open={isOpen} onOpenChange={setOpenState}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={isOpen}
          className='w-full justify-between'
          disabled={isDisabled}
        >
          {value ?? 'Select ease...'}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='max-h-[400px] w-[252px] overflow-y-auto p-0'>
        <Command>
          <CommandInput placeholder='Search ease...' className='h-9' />
          <CommandEmpty>No ease found.</CommandEmpty>
          <CommandGroup>
            {eases.map((ease) => (
              <CommandItem key={ease} value={ease} onSelect={handleSelect}>
                {ease}
                <CheckIcon
                  className={cn(
                    'ml-auto h-4 w-4',
                    value === ease ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
