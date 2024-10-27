async function processFile() {
    const fileInput = document.getElementById("fileInput");
    const statusMessage = document.getElementById("statusMessage");

    if (!fileInput.files.length) {
        statusMessage.innerText = "Please upload an image or PDF file.";
        return;
    }

    statusMessage.innerText = "Processing your file...";

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function() {
        const base64Content = reader.result.split(",")[1];

        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY_HERE`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requests: [
                        {
                            image: { content: base64Content },
                            features: [{ type: "DOCUMENT_TEXT_DETECTION" }]
                        }
                    ]
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            const text = data.responses[0].fullTextAnnotation.text;
            generateTextDoc(text);
            statusMessage.innerText = "OCR completed! Click to download the text document.";
        } else {
            statusMessage.innerText = "Error performing OCR. Please try again.";
        }
    };

    reader.readAsDataURL(file);
}

function generateTextDoc(text) {
    const downloadBtn = document.getElementById("downloadBtn");
    
    // Create a new Blob for the text file
    const blob = new Blob([text], { type: "text/plain" });
    
    // Create a URL for the Blob and set the download attributes
    downloadBtn.href = URL.createObjectURL(blob);
    downloadBtn.download = "OCR_Result.txt"; // Name of the downloaded file
    downloadBtn.disabled = false; // Enable the download button
}

function downloadTextDoc() {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.innerText = "Text document downloaded!";
}
