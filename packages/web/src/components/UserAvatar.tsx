import { Avatar, AvatarFallback, AvatarImage } from "@owl/lib/components/avatar";

export default function UserAvatar(props: { userId?: string; userName?: string; size?: "sm" | "default" | "lg" }) {
      const { userId, userName, size } = props;
      const initials = userName ? userName.split(" ").map((word) => word[0]) : "U";
      return (
            <Avatar size={size} className="after:border-none">
                  <AvatarImage
                        src={`https://api.dicebear.com/10.x/critters/svg?scale=1.59&rotate=20,-20&seed=${userId}`}
                        alt={String(userName)}
                        className={"rounded-lg mt-0"}
                  />
                  <AvatarFallback className={"rounded-lg bg-indigo-600 text-white"}>{initials}</AvatarFallback>
            </Avatar>
      );
}
