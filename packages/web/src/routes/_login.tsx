import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import owl from '../assets/owls/owl_1.jpg'

import Logo from "../assets/OWL_Mark_v3.svg?react"
export const Route = createFileRoute('/_login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-1 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-bold">
            <Logo className="fill-primary flex size-10 items-center justify-center bg-zinc-200 rounded" aria-hidden />
            OWL
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center max-h-3/4">
          <Outlet />
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={owl}
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          aria-hidden
        />
      </div>
    </div>
  )
}
