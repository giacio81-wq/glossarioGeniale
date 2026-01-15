function pngToBase64(imagePath) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            resolve(canvas.toDataURL("image/png"));
        };

        img.onerror = function () {
            reject("Errore nel caricamento dell'immagine: " + imagePath);
        };

        img.src = imagePath;
    });
}

// Rendi la funzione globale
window.pngToBase64 = pngToBase64;