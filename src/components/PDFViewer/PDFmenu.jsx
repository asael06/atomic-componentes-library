import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { MenuItem, Box, Typography, Button, Divider } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import ResponsiveVisibility from "../../utils/ResponsiveVisibility";
import { PDFPrewiewerStyles } from "../../styles";
import { useTheme } from "@mui/material/styles";

import {
  Search as SearchIcon,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Fullscreen,
  Download as DownloadIcon,
  Upload,
  Print as PrintIcon,
  RotateRight,
  RotateLeft,
} from "@mui/icons-material";

const PDFmenu = ({
  search = true,
  fullScreen = true,
  download = true,
  openFile = false,
  print = true,
  rotate = true,
  handleOnClick,
  handleFullScreen,
  handleDownload,
  handleOpenFile,
  handlePrint,
  handleRotateBackward,
  handleRotateForward,
  handleSearch,
  setPageNumber,
  pageNumber,
  numPages,
}) => {
  const theme = useTheme();
  const styles = PDFPrewiewerStyles(theme);
  const [anchorEl, setAnchorEl] = useState();
  const open = anchorEl;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (handler) => {
    setAnchorEl(null);
    if (handler) {
      handler();
    }
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ p: 0 }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              width: "30ch",
            },
          },
          list: {
            "aria-labelledby": "long-button",
          },
        }}
      >
        {search && handleSearch && (
          <ResponsiveVisibility showFrom="xs" showUntil="sm">
            <MenuItem sx={styles.menuItem || {}}>
              <Box sx={styles.menuButton || {}}>
                <Button
                  onClick={(e) => {
                    handleOnClick && handleOnClick(e);
                    setAnchorEl(null);
                  }}
                >
                  <SearchIcon />
                  <Typography>Buscar en el documento</Typography>
                </Button>
              </Box>
            </MenuItem>
            <Divider sx={styles.divider || {}} />
          </ResponsiveVisibility>
        )}

        <MenuItem sx={styles.menuItem || {}}>
          <Box sx={styles.menuButton || {}}>
            <Button
              onClick={() => handleMenuItemClick(() => setPageNumber(1))}
              disabled={pageNumber <= 1}
            >
              <KeyboardArrowUp />
              <Typography>Primera página</Typography>
            </Button>
          </Box>
        </MenuItem>

        <MenuItem sx={styles.menuItem || {}}>
          <Box sx={styles.menuButton || {}}>
            <Button
              onClick={() => handleMenuItemClick(() => setPageNumber(numPages))}
              disabled={pageNumber >= numPages}
            >
              <KeyboardArrowDown />
              <Typography>Última página</Typography>
            </Button>
          </Box>
        </MenuItem>

        {fullScreen && handleFullScreen && (
          <ResponsiveVisibility showFrom="xs" showUntil="sm">
            <Divider sx={styles.divider || {}} />
            <MenuItem sx={styles.menuItem || {}}>
              <Box sx={styles.menuButton || {}}>
                <Button onClick={() => handleMenuItemClick(handleFullScreen)}>
                  <Fullscreen />
                  <Typography>Pantalla Completa</Typography>
                </Button>
              </Box>
            </MenuItem>
          </ResponsiveVisibility>
        )}

        {rotate && (handleRotateBackward || handleRotateForward) && (
          <ResponsiveVisibility showFrom="xs" showUntil="sm">
            <Divider sx={styles.divider || {}} />
            {handleRotateForward && (
              <MenuItem sx={styles.menuItem || {}}>
                <Box sx={styles.menuButton || {}}>
                  <Button
                    onClick={() => handleMenuItemClick(handleRotateForward)}
                  >
                    <RotateRight />
                    <Typography>Rotar a la derecha</Typography>
                  </Button>
                </Box>
              </MenuItem>
            )}
            {handleRotateBackward && (
              <MenuItem sx={styles.menuItem || {}}>
                <Box sx={styles.menuButton || {}}>
                  <Button
                    onClick={() => handleMenuItemClick(handleRotateBackward)}
                  >
                    <RotateLeft />
                    <Typography>Rotar a la izquierda</Typography>
                  </Button>
                </Box>
              </MenuItem>
            )}
          </ResponsiveVisibility>
        )}

        {(openFile || download) && (handleOpenFile || handleDownload) && (
          <ResponsiveVisibility showFrom="xs" showUntil="sm">
            <Divider sx={styles.divider || {}} />
          </ResponsiveVisibility>
        )}

        {openFile && handleOpenFile && (
          <ResponsiveVisibility showFrom="xs" showUntil="sm">
            <MenuItem sx={styles.menuItem || {}}>
              <Box sx={styles.menuButton || {}}>
                <Button onClick={() => handleMenuItemClick(handleOpenFile)}>
                  <Upload />
                  <Typography>Abrir archivo</Typography>
                </Button>
              </Box>
            </MenuItem>
          </ResponsiveVisibility>
        )}

        {download && handleDownload && (
          <ResponsiveVisibility showFrom="xs" showUntil="sm">
            <MenuItem sx={styles.menuItem || {}}>
              <Box sx={styles.menuButton || {}}>
                <Button onClick={() => handleMenuItemClick(handleDownload)}>
                  <DownloadIcon />
                  <Typography>Descargar PDF</Typography>
                </Button>
              </Box>
            </MenuItem>
          </ResponsiveVisibility>
        )}

        {print && handlePrint && (
          <ResponsiveVisibility showFrom="xs" showUntil="sm">
            <Divider sx={styles.divider || {}} />
            <MenuItem sx={styles.menuItem || {}}>
              <Box sx={styles.menuButton || {}}>
                <Button onClick={() => handleMenuItemClick(handlePrint)}>
                  <PrintIcon />
                  <Typography>Imprimir PDF</Typography>
                </Button>
              </Box>
            </MenuItem>
          </ResponsiveVisibility>
        )}
      </Menu>
    </div>
  );
};

export default PDFmenu;
