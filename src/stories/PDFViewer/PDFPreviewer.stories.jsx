import { PDFViewer } from "../../components/PDFViewer/index";

export default {
  title: "components/PDFViewer",
  component: PDFViewer,

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    // Add any default args for the PDFViewer component here
    file: "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf",
    zoomControls: true,
    search: true,
    pagesControl: true,
    fullScreen: false,
    openFile: true,
  },
};
