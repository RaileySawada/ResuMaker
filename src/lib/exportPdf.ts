/**
 * Triggers the browser's native print dialog, which lets users
 * save the resume as a PDF. The print styles in index.css ensure
 * only the resume preview is visible when printing.
 */
export const printResume = (name?: string): void => {
  const originalTitle = document.title;
  document.title = name || "Resume";
  
  window.print();
  
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
};
