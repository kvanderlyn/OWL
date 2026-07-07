import { useAuthStore } from "@/store/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@awesome.me/kit-25b3efc452/icons/vellum/solid";
import { Button } from "@owl/lib/components/button";

export default function AuthSideNav() {
    const { user } = useAuthStore()
    const data = {
        user: {
            name: user?.name,
            email: user?.email,
        }
    }
    return (
        <div>
            <Button type="button" variant={"ghost"} size={"icon"}>
                <FontAwesomeIcon icon={faCircleUser} />
            </Button>
        </div>
    )
}