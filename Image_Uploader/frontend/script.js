const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const previewArea = document.getElementById('preview-area');
const uploadForm = document.getElementById('uploadForm');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
e.preventDefault()
e.stopPropagation()
}

// Highlight drop area when dragging over it
['dragenter', 'dragover'].forEach(eventName => {
dropArea.addEventListener(eventName, highlight, false)
})

['dragleave', 'drop'].forEach(eventName => {
dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
dropArea.classList.add('highlight')
}

function unhighlight(e) {
dropArea.classList.remove('highlight')
}

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
let dt = e.dataTransfer
let files = dt.files
handleFiles(files)
}

// Handle file selection via input
fileElem.addEventListener('change', (e) => {
handleFiles(e.target.files);
});


function handleFiles(files) {
for (let i = 0; i < files.length; i++) {
    let file = files[i];

    // Check if the file is an image.
    if (!file.type.startsWith('image/')) {
        console.error("File is not an image:", file.name);
        continue; // Skip to the next file.
    }

    let reader = new FileReader();

    reader.onloadend = (e) => {
        let img = document.createElement('img');
        img.src = e.target.result;
        img.alt = file.name;
        let previewDiv = document.createElement('div');
        previewDiv.classList.add('image-preview');
        previewDiv.appendChild(img);
        previewArea.appendChild(previewDiv);
    }

    reader.readAsDataURL(file);
}
}


uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    console.log(result.filePath); // path to file
  });


