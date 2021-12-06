import { Button, Grid, Tooltip } from "@material-ui/core";
import clsx from "clsx";

export interface ButtonGroupConfig {
  label?: string;
  renderChild?: () => JSX.Element;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  tooltip?: string;
  disableClick?:()=>void;
}

export interface ButtonGroupProps {
  groupTitle?: string;
  className?: string;
  buttonConfig?: ButtonGroupConfig[];
}

const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
  const { groupTitle, buttonConfig = [], className } = props;
  return (
    <Grid
      container
      className={clsx("button-group", {
        [props?.className || ""]: props.className,
      })}
    >
      {groupTitle && (
        <Grid item className="button-group__group-title">
          {groupTitle}
        </Grid>
      )}
      <Grid item className="button-group__button-wrapper">
        {buttonConfig.map((button, index) => (
          <div key={index} onClick={button.disabled===true?button.disableClick:undefined}>
            <Tooltip title={button.tooltip || ""} arrow placement="top">
              <Button
                variant="outlined"
                disabled={button.disabled}
                className={clsx("button-group__button", {
                  [button?.className || ""]: button.className,
                  active: button.active,
                })}
                onClick={button.onClick}
              >
                {button.renderChild ? button.renderChild() : button.label}
              </Button>
            </Tooltip>
          </div>
        ))}
      </Grid>
    </Grid>
  );
};

export default ButtonGroup;
