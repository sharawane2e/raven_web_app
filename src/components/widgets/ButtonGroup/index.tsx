import { Button, Grid } from "@material-ui/core";
import clsx from "clsx";

export interface ButtonGroupConfig {
  label?: string;
  renderChild?: () => JSX.Element;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

export interface ButtonGroupProps {
  groupTitle?: string;
  buttonConfig?: ButtonGroupConfig[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
  const { groupTitle, buttonConfig = [] } = props;
  return (
    <Grid container className="button-group">
      {groupTitle && <Grid item>{groupTitle}</Grid>}
      {buttonConfig.map((button, index) => (
        <Grid key={index}>
          <Button
            variant="outlined"
            disabled={button.disabled}
            className={clsx("button-group__button", {
              [button?.className || ""]: button.className,
              active: button.active,
            })}
          >
            {button.renderChild ? button.renderChild() : button.label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default ButtonGroup;
