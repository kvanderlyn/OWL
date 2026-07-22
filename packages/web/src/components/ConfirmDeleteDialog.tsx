import { Button } from "@owl/lib/components/button";
import {
      Dialog,
      DialogClose,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogTitle,
} from "@owl/lib/components/dialog";

export default function ConfirmDeleteDialog(props: {
      isOpen: boolean;
      setIsOpen: React.Dispatch<boolean>;
      onConfirm: () => void;
      confirmText?: string;
      onCancel?: () => void;
}) {
      const { onConfirm, confirmText, isOpen, setIsOpen } = props;
      return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogContent>
                        <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                    {confirmText || "Are you sure you wish to delete this item?"}
                              </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                              <DialogClose render={<Button variant="link" />}>Cancel</DialogClose>
                              <Button onClick={onConfirm} variant="destructive">
                                    Yes, Delete
                              </Button>
                        </DialogFooter>
                  </DialogContent>
            </Dialog>
      );
}
