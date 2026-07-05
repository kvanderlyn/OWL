import { useAuthStore } from "@/store/authStore"
import { router } from "../router"
import { Button } from "@owl/lib/components/button"

export default function LogoutButton() {
    const { logout } = useAuthStore()
    function handleLogout() {
        logout().then(() => {
            router.invalidate()
        })
    }
    return (
        <Button type='button' onClick={handleLogout} variant={"link"}>Log Out</Button>
    )
}
