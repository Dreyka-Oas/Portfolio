// js/cv-script.js

// --- CV Specific JS ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("CV Specific script executing.");

    // Calculate and display age on CV
    const ageElementCv = document.getElementById("age-cv");
    if (ageElementCv) {
        try {
            const birthdate = "2003-08-30";
            const birth = new Date(birthdate);
            const now = new Date();
            let age = now.getFullYear() - birth.getFullYear();
            const m = now.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
                age--;
            }
            ageElementCv.textContent = `${age >= 0 ? age : '??'} ans`; // Display age or placeholder
        } catch (e) {
            console.error("CV Age calculation error:", e);
            ageElementCv.textContent = "N/A"; // Display error indicator
        }
    } else {
        console.warn("Element #age-cv not found in cv.html.");
    }

    // Download PDF Button Handler
    const downloadBtn = document.getElementById('download-cv-pdf-btn');
    const cvElementToCapture = document.getElementById('cv-content-area'); // The element to capture

    // Check if necessary elements and libraries are available
    const html2canvasAvailable = typeof html2canvas === 'function';
    // jsPDF uses a constructor inside the jspdf object in UMD build
    const jsPdfAvailable = typeof window.jspdf?.jsPDF === 'function';

    if (downloadBtn && cvElementToCapture && html2canvasAvailable && jsPdfAvailable) {
        console.log("PDF download elements and libraries are ready.");
        const jsPDFConstructor = window.jspdf.jsPDF; // Access the constructor correctly

        // Enable the button (it could be initially disabled)
        downloadBtn.disabled = false;
        downloadBtn.title = "Télécharger comme PDF";
        downloadBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Télécharger PDF';

        // Add click event listener to the button
        downloadBtn.addEventListener('click', () => {
            console.log("--- PDF DOWNLOAD START ---");

            // Temporarily hide the download button itself so it's not in the screenshot
            downloadBtn.style.display = 'none';

            // Force style recalculation before capture (can sometimes help with rendering)
            window.getComputedStyle(cvElementToCapture).height;

            console.log("Attempting html2canvas capture on element:", cvElementToCapture);

            // Options for html2canvas capture
            const canvasOptions = {
                scale: 2, // Increase scale for better resolution/quality
                useCORS: true, // Allow loading cross-origin images (like GitHub avatar)
                logging: true, // Enable html2canvas logs for debugging
                backgroundColor: '#ffffff', // Ensure a solid white background for the capture
                // --- Important: Try to capture the full scroll dimensions ---
                // These might help capture content that extends beyond the initial viewport,
                // especially if print styles aren't perfectly mimicking the layout.
                width: cvElementToCapture.scrollWidth,
                height: cvElementToCapture.scrollHeight,
                windowWidth: cvElementToCapture.scrollWidth, // Simulate a window width matching content
                windowHeight: cvElementToCapture.scrollHeight // Simulate a window height matching content
            };
            console.log("   html2canvas options:", canvasOptions);

            // --- Perform the screenshot ---
            html2canvas(cvElementToCapture, canvasOptions).then(canvas => {
                console.log(">>> html2canvas SUCCESS");
                console.log("   Captured Canvas RAW dimensions (pixels):", canvas.width, "x", canvas.height);

                // --- Generate PDF using jsPDF ---
                try {
                    console.log(">>> jsPDF Generation START");
                    const imgData = canvas.toDataURL('image/png'); // Convert canvas to base64 PNG

                    // --- Define PDF page settings (A4 dimensions in mm) ---
                    const pdfWidth = 210; // A4 width in mm
                    const pdfHeight = 297; // A4 height in mm
                    // Match margins defined in @page CSS rule (15mm was used)
                    const pageMargin = 15; // Margin in mm
                    console.log(`   PDF Page: ${pdfWidth}x${pdfHeight}mm, Margin: ${pageMargin}mm`);

                    // Calculate the usable area within the margins
                    const usablePdfWidth = pdfWidth - (2 * pageMargin);
                    const usablePdfHeight = pdfHeight - (2 * pageMargin);
                    console.log(`   Calculated Usable Area: ${usablePdfWidth.toFixed(2)}x${usablePdfHeight.toFixed(2)}mm`);

                    // --- Create jsPDF instance ---
                    const pdf = new jsPDFConstructor({
                        orientation: 'portrait', // 'p' or 'portrait'
                        unit: 'mm',             // units: 'mm', 'cm', 'in', 'px', 'pt', 'pc'
                        format: 'a4'            // page format: 'a4', 'letter', etc.
                    });
                    console.log("   jsPDF instance created.");

                    // --- Add the captured image to the PDF ---
                    // We place the image starting at the margin coordinates (x, y)
                    // and scale it to fit exactly within the usable width and height.
                    const xPos = pageMargin;
                    const yPos = pageMargin;
                    const targetWidth = usablePdfWidth;
                    const targetHeight = usablePdfHeight;

                    console.log(`   Parameters for pdf.addImage: format=PNG, x=${xPos.toFixed(2)}, y=${yPos.toFixed(2)}, width=${targetWidth.toFixed(2)}, height=${targetHeight.toFixed(2)}`);
                    // Add the image, stretching/compressing it to fit the usable area precisely
                    pdf.addImage(imgData, 'PNG', xPos, yPos, targetWidth, targetHeight);
                    console.log("   pdf.addImage called.");

                    // --- Save the generated PDF ---
                    console.log("   Saving PDF document...");
                    pdf.save('CV_Leterme_Florent_A4_ForcedFit.pdf'); // Define the output filename
                    console.log("   pdf.save() called.");
                    console.log(">>> jsPDF Generation END (Success)");

                } catch (pdfError) {
                    // --- Handle jsPDF errors ---
                    console.error(">>> jsPDF Generation FAILED", pdfError);
                    alert("Erreur lors de la création ou sauvegarde du PDF. Vérifiez la console pour les détails.");
                } finally {
                    // --- Always re-display the button ---
                    downloadBtn.style.display = 'flex'; // Or 'block'/'inline-flex' depending on original style
                    console.log("   Download button re-displayed.");
                }

            }).catch(err => {
                // --- Handle html2canvas errors ---
                console.error(">>> html2canvas FAILED", err);
                alert("Erreur lors de la capture de l'élément pour le PDF (html2canvas). Vérifiez la console pour les détails.");
                // Re-display the button even if capture failed
                downloadBtn.style.display = 'flex';
            });

            console.log("--- PDF DOWNLOAD Triggered ---");
        }); // End of button click listener

    } else {
         // --- Setup Failed: Log errors and disable button ---
         console.error("PDF Download Setup failed. Check if elements exist and libraries (html2canvas, jsPDF) are loaded correctly.");
        if (!downloadBtn) console.error("   Download PDF button (#download-cv-pdf-btn) not found.");
        if (!cvElementToCapture) console.error("   CV content area (#cv-content-area) not found.");
        if (!html2canvasAvailable) console.error("   html2canvas library is not loaded or not available.");
        if (!jsPdfAvailable) console.error("   jsPDF constructor (window.jspdf.jsPDF) is not available.");

        // Disable the button and provide feedback if it exists
        if(downloadBtn) {
            downloadBtn.disabled = true;
            downloadBtn.title = "Fonctionnalité PDF indisponible (erreur de chargement)";
            downloadBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> PDF Indisp.'; // Short error message
        }
    }

}); // End DOMContentLoaded listener