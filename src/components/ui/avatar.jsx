import * as AvatarPrimitive from "@radix-ui/react-avatar"

const Avatar = (({ className, ...props }) => (
  <AvatarPrimitive.Root
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = (({ className, ...props }) => (
  <AvatarPrimitive.Image
    className={`aspect-square h-full w-full ${className}`}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = (({ className, ...props }) => (
  <AvatarPrimitive.Fallback
    className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
