import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@material-ui/core";

export type IConfirmationActionConfig = {
  label: string;
  className?: string;
  onClick: () => void;
}[];

export interface ConfirmationDialogProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  confirmationText?: string;
  actionConfig?: IConfirmationActionConfig;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
  const { open, onClose, actionConfig, title, confirmationText } = props;
  return (
    <Dialog open={open} onClose={onClose} PaperComponent={Paper}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{confirmationText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {actionConfig?.map((button) => (
          <Button className={button.className} onClick={button.onClick}>
            {button.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
