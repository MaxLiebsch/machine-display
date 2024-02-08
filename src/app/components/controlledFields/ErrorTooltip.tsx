import { Tooltip, TooltipProps, styled, tooltipClasses } from "@mui/material";

const ErrorTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    placement="bottom"
    arrow
    classes={{ popper: `whitespace-break-spaces ${className}` }}
  />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "red",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "red",
  },
}));

export default ErrorTooltip;
