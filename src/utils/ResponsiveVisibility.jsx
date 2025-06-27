// MUI Components
import { useMediaQuery, useTheme } from "@mui/material";

// PropTypes
import PropTypes from "prop-types";

const visibilityStrategies = {
  SHOW_FROM: (isUp) => isUp,
  SHOW_UNTIL: (_isUp, isDown) => isDown,
  SHOW_BETWEEN: (isUp, isDown) => isUp && isDown,
  DEFAULT: () => true,
};

const getStrategyKey = (showFrom, showUntil) => {
  if (showFrom && !showUntil) return "SHOW_FROM";
  if (!showFrom && showUntil) return "SHOW_UNTIL";
  if (showFrom && showUntil) return "SHOW_BETWEEN";
  return "DEFAULT";
};

/**
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.showFrom] - Muestra el contenido DESDE este breakpoint HACIA ARRIBA.
 * @param {'xs' | 'sm' | 'md' | 'lg'} [props.showUntil] - Muestra el contenido HASTA este breakpoint (inclusive).
 * @returns {React.ReactElement | null} El contenido si es visible, o null si está oculto.
 */
const ResponsiveVisibility = ({ children, showFrom, showUntil }) => {
  const theme = useTheme();

  const isUp = useMediaQuery(theme.breakpoints.up(showFrom || "xs"));
  const isDown = useMediaQuery(theme.breakpoints.down(showUntil || "xl"));
  const strategyKey = getStrategyKey(showFrom, showUntil);

  const isVisible = visibilityStrategies[strategyKey](isUp, isDown);

  return isVisible ? <>{children}</> : null;
};

ResponsiveVisibility.propTypes = {
  children: PropTypes.node.isRequired,
  showFrom: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  showUntil: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
};

export default ResponsiveVisibility;
