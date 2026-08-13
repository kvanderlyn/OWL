import { faEllipsis, faPencil, faTrash } from "@awesome.me/kit-25b3efc452/icons/classic/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuGroup,
      DropdownMenuItem,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
} from "@owl/lib/components/dropdown-menu";
import type { dbItemType } from "../../../db/src";

export default function EditItemMenu(props: {
      item: dbItemType;
      onEdit: (item: dbItemType) => void;
      onDelete: (item: dbItemType) => void;
}) {
      const { item, onEdit, onDelete } = props;
      return (
            <DropdownMenu>
                  <DropdownMenuTrigger title="Wishlist Options" className="text-indigo-600 focus:bg-white">
                        <FontAwesomeIcon icon={faEllipsis} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuGroup>
                              <DropdownMenuItem className="hover:cursor-pointer" onClick={() => onEdit(item)}>
                                    <FontAwesomeIcon icon={faPencil} />
                                    Edit Item {`${item.id}`}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="hover:cursor-pointer" onClick={() => onDelete(item)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                    Delete Item
                              </DropdownMenuItem>
                        </DropdownMenuGroup>
                  </DropdownMenuContent>
            </DropdownMenu>
      );
}
