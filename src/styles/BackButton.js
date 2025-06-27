const getBackButtonStyles = (theme) => ({
  BackButton: {
    border: "0",
    p: "0 6px",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: 600,
    "&:hover": {
      color: "primary.dark",
      backgroundColor: "transparent",
    },
    [theme.breakpoints.down("sm")]: {
      p: "24px",
      m: 0,
    },
  },
  BackButtonArrow: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    width: "20px",
    height: "20px",

    borderRadius: "50%",
    backgroundColor: "goBack.background",
    cursor: "pointer",
  },
  BackButtonText: {
    color: "text.back",
    fontSize: "18px",
    paddingLeft: "20px",
    fontWeight: 400,
  },
});

export default getBackButtonStyles;
