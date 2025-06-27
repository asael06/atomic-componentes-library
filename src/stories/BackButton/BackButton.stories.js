import BackButton from "../../components/BackButton";

export default {
  title: "Components/BackButton",
  component: BackButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClick: { action: "clicked" },
    variant: {
      control: "select",
      options: ["text", "outlined", "contained"],
    },
    color: {
      control: "select",
      options: [
        "inherit",
        "primary",
        "secondary",
        "success",
        "error",
        "info",
        "warning",
      ],
    },
    label: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    useThemeColors: {
      control: "boolean",
      description: "Use custom theme colors for styling",
    },
  },
};

export const Default = {
  args: {
    label: "Back",
    variant: "outlined",
    color: "primary",
    disabled: false,
  },
};

export const Contained = {
  args: {
    label: "Go Back",
    variant: "contained",
    color: "primary",
    disabled: false,
  },
};

export const Text = {
  args: {
    label: "Back to Home",
    variant: "text",
    color: "primary",
    disabled: false,
  },
};

export const Secondary = {
  args: {
    label: "Back",
    variant: "outlined",
    color: "secondary",
    disabled: false,
  },
};

export const Disabled = {
  args: {
    label: "Back",
    variant: "outlined",
    color: "primary",
    disabled: true,
  },
};

export const CustomLabel = {
  args: {
    label: "Return to Dashboard",
    variant: "contained",
    color: "secondary",
    disabled: false,
  },
};

export const WithThemeColors = {
  args: {
    label: "Back",
    variant: "outlined",
    color: "primary",
    disabled: false,
    useThemeColors: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "BackButton using the custom theme colors defined in the theme palette.",
      },
    },
  },
};
