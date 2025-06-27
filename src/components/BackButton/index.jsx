import { Button, Typography, Box } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import getBackButtonStyles from "../../styles/BackButton";

const BackButton = ({
  onClick,
  label = "Back",
  variant = "outlined",
  color = "primary",
  disabled = false,
  useRouter = false,
  sx,
}) => {
  const theme = useTheme();
  const styles = getBackButtonStyles(theme);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (useRouter && typeof window !== "undefined") {
      // Simple fallback navigation - users should provide their own onClick for router integration
      window.history.back();
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      disabled={disabled}
      sx={{ ...styles.BackButton, ...sx }}
      onClick={handleClick}
    >
      <Box sx={styles.BackButtonArrow}>
        <ChevronLeft />
      </Box>
      <Typography component="span" sx={styles.BackButtonText}>
        {label}
      </Typography>
    </Button>
  );
};

BackButton.propTypes = {
  onClick: PropTypes.func,
  backTo: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf(["text", "outlined", "contained"]),
  color: PropTypes.oneOf([
    "inherit",
    "primary",
    "secondary",
    "success",
    "error",
    "info",
    "warning",
  ]),
  disabled: PropTypes.bool,
  useRouter: PropTypes.bool,
  sx: PropTypes.object,
};

export default BackButton;
