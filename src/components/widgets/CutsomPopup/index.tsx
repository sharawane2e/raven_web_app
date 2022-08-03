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
  //console.log('questionText', questionText);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      // aria-labelledby="alert-dialog-title"
      // aria-describedby="alert-dialog-description"
      className="user-cache user-cache-custom-popup"
      sx={{ backgroundColor: 'rgba(255 ,255, 255, .1 )' }}
    >
      <div className="user-cache-hedding">
        {StaticText}
        {/* <div className="user-cache-questiontext">{questionText}</div> */}
      </div>

      <DialogActions className="btn-group">
        <Button onClick={handleClose} className="button--secondary">
          Disagree
        </Button>
        <Button onClick={userCache} autoFocus className="button--primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomPopup;
