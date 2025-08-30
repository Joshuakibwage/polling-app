import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { User, LogOut, Settings, Plus } from "lucide-react"

export default function Header() {
  // Mock user state - replace with actual auth state
  const isAuthenticated = false
  const user = { name: "John Doe", email: "john@example.com" }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            PollApp
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/polls" className="text-gray-600 hover:text-gray-900">
              Browse Polls
            </Link>
            <Link href="/polls/create" className="text-gray-600 hover:text-gray-900">
              Create Poll
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/polls/create">
                  <Button size="sm" className="hidden md:flex">
                    <Plus className="h-4 w-4 mr-2" />
                    New Poll
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/avatars/01.png" alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
