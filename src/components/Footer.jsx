import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

export default function Footer() {
  return (
    <footer className="flex items-center justify-center h-32 w-full">
      <a className="inline-flex items-center gap-2 text-xs md:text-sm" href="https://github.com/lj140542/odin-where-is-waldo">
        <Avatar className='w-4 h-4 md:w-6 md:h-6'>
          <AvatarImage src='github.png'></AvatarImage>
          <AvatarFallback>GH</AvatarFallback>
        </Avatar>
        Jonathan Lefebvre
      </a>
    </footer>
  )
}