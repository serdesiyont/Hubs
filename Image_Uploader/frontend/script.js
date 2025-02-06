const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const uploadedImage = document.getElementById("uploadedImage");
const message = document.createElement("p");
document.body.appendChild(message);

dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    const file = e.dataTransfer.files[0];
    uploadFile(file);
});
fileInput.addEventListener("change", (e) => uploadFile(e.target.files[0]));

function uploadFile(file) {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    fetch("/upload", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.url) {
                uploadedImage.src = data.url;
                uploadedImage.style.display = "block";
                message.textContent = "Upload succeeded!";
                message.style.color = "green";
            } else {
                message.textContent = "Upload failed!";
                message.style.color = "red";
            }
        })
        .catch(err => {
            console.error("Upload failed:", err);
            message.textContent = "Upload failed!";
            message.style.color = "red";
        });
}
