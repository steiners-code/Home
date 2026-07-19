// 'use client';

// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
// import { ChevronDown, LogOut, User2 } from 'lucide-react';
// import { ThemeToggle } from '../providers/ThemeToggle';
// import { useQuery } from '@tanstack/react-query';
// import { getUserData } from './actions';
// import Link from 'next/link';
// import { Button } from '../ui/button';

// const UserButton = () => {
//     const { data: user, isPending } = useQuery({
//         queryKey: ['currentUser'],
//         queryFn: async () => {
//             return await getUserData();
//         },
//     });

//     return (
//         <div className="hidden md:flex items-center gap-3" >
//             <ThemeToggle />

//             {isPending ? (
//                 <div className="bg-foreground/5 hover:bg-foreground/10 rounded-full size-9 p-2 cursor-pointer transition-colors animate-caret-blink" />
//             ) : user ? (
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="sm" className="gap-2">
//                             <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
//                                 {user?.email?.charAt(0).toUpperCase() || "U"}
//                             </div>
//                             <ChevronDown className="size-4" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-48">
//                         <div className="px-2 py-1.5">
//                             <p className="text-xs text-muted-foreground truncate">
//                                 {user?.email}
//                             </p>
//                         </div>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem asChild>
//                             <Link href="/user/stores">Dashboard</Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem asChild>
//                             <Link href="/user/profile">Profile</Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuItem asChild>
//                             <Link href="/user/settings">Settings</Link>
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem asChild>
//                             <Link href="/auth/logout">
//                                 <LogOut className="size-4 mr-2" />
//                                 Logout
//                             </Link>
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             ) : (
//                 <>
//                     <Button variant="outline" size="default" asChild>
//                         <Link href="/auth/login">Log In</Link>
//                     </Button>
//                     <Button variant="default" size="default" asChild>
//                         <Link href="/auth/signup">Get Started</Link>
//                     </Button>
//                 </>
//             )}
//         </div >
//     )
// }

// export default UserButton
