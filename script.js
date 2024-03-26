// Function to read file as Data URL
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Async function to convert images to PDF
async function convertImagesToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const files = document.getElementById("image-input").files;
  if (files.length === 0) return;

  for (const file of files) {
    const imageUrl = await readFileAsDataURL(file);
    const img = new Image();
    img.src = imageUrl;
    await new Promise((resolve) => (img.onload = resolve));

    // This will add the image to the PDF. Adjust dimensions as necessary.
    doc.addImage(img, "JPEG", 10, 10, 180, 160);
    doc.addPage();
  }

  // Remove the last added empty page
  if (doc.internal.pages.length > 1) doc.deletePage(doc.internal.pages.length);

  // Generate PDF download
  document.getElementById("download-link").href = doc.output("bloburl");
  document.getElementById("download-link").download = "converted_images.pdf";
  document.getElementById("download-link").style.display = "inline";
  document.getElementById("download-link").click();
}

// Event listener to update UI with file names upon file selection
document.getElementById("image-input").addEventListener("change", function () {
  const fileList = document.getElementById("file-list");
  fileList.innerHTML = ""; // Clear the current file list
  Array.from(this.files).forEach((file, index) => {
    const fileElement = document.createElement("div");
    fileElement.textContent = `${index + 1}. ${file.name}`; // Display file names
    fileList.appendChild(fileElement);
  });
});
