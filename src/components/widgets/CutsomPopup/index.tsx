import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

export interface CustomPopup {
  handleClose?: (value: any) => void;
  open: boolean;
  StaticText: string;
  questionText: any;
  userCache?: (value: any) => void;
}

const CustomPopup: React.FC<CustomPopup> = (props) => {
  const { handleClose, open, StaticText, questionText, userCache } = props;

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      className="user-cache user-cache-custom-popup"
      sx={{ backgroundColor: 'rgba(255 ,255, 255, .1 )' }}
    >
      <div className="user-cache-hedding">
        {StaticText}

        {/* {questionText.map((quesText: any) => {
          return (
            <div className="user-cache-questiontext">{quesText?.qText}</div>
          );
        })} */}
      </div>

      <DialogActions className="btn-group">
        <Button onClick={handleClose} className="button--secondary">
          Cancel
        </Button>
        <Button onClick={userCache} autoFocus className="button--primary">
          Yes, delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomPopup;
