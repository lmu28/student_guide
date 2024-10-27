
document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("camera");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.play();
                startImageRecognition(video); // Передаем video как аргумент
            })
            .catch(err => console.error("Error accessing camera: " + err));
    } else {
        console.error("getUserMedia is not supported in this browser.");
    }
});

function startImageRecognition(video) {
    // Проверяем, что video действительно определено
    if (!video) {
        console.error("Video element is not defined.");
        return;
    }

    // Интервал для отправки изображений на модель распознавания
    setInterval(() => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Проверяем размеры видео
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error("Video dimensions are not valid.");
            return;
        }
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/png');
        recognizeTextFromImage(imageData)
        // sendToRecognitionModel2(imageData);
    }, 5000); // Отправка изображения каждые 3 секунды
}


function sendToRecognitionModel2(imageData) {
    const link = document.createElement('a');
    link.href = imageData; // Присваиваем ссылке Data URL
    link.download = 'capturedImage.png'; // Имя файла для скачивания

    document.body.appendChild(link); // Добавляем ссылку в DOM
    link.click(); // Имитируем клик для скачивания
    document.body.removeChild(link); // Удаляем ссылку после скачивания
    console.log("OK");
}

