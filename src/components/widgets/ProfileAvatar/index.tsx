import { Tooltip } from "@material-ui/core";
import clsx from "clsx";
import React, { MouseEvent, MouseEventHandler } from "react";

export interface ProfileAvatarProps {
  text: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  classes?: {
    avatar?: string;
    badge?: string;
  };
  className?: string;
  hasBadge?: boolean;
  bagdeComponent?: JSX.Element;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = (props) => {
  const { text, onClick, classes, hasBadge, className, bagdeComponent } = props;
  const textArr = text.split(" ");
  const textInitials = textArr.map((textItem) => textItem[0]).join("");
  return (
    <div
      className={clsx("profile-avatar", {
        [className || ""]: !!className,
      })}
      onClick={onClick}
    >
      <span>{textInitials}</span>
      {hasBadge || bagdeComponent ? (
        bagdeComponent ? (
          bagdeComponent
        ) : (
          <span
            className={clsx("profile-avatar__badge", {
              [classes?.badge || ""]: !!classes?.badge,
            })}
          ></span>
        )
      ) : null}
    </div>
  );
};

export default ProfileAvatar;
