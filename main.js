

document.addEventListener("DOMContentLoaded", () => {
  
    
    const video = document.getElementById("camera");
    const canvas = document.createElement("canvas");

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" } 
        })
        .then(stream => {
            video.srcObject = stream;
            video.play();

            


                setInterval(async () => {
                    try {
                        var base64Content = captureFrame(video,canvas);

                        console.log(base64Content);

                        const data = await sendBase64Image(base64Content); // Дожидаемся результата
                        processData(data); // Обрабатываем данные
                    } catch (error) {
                        console.error("Error processing data:", error); // Обрабатываем ошибку
                    }
                    console.log("Через 3 секунды");
                }, 3000);

    
               
                
            })
            .catch(err => console.error("Error accessing camera: " + err));
    } else {
        console.error("getUserMedia is not supported in this browser.");
    }
});




function placeTextAtCoordinates(x, y, text) {
    const video = document.getElementById("camera");
    const resultsContainer = document.getElementById("results");
    const videoRect = video.getBoundingClientRect();


    const scaledX = videoRect.left + (x * videoRect.width) / video.videoWidth;
    const scaledY = videoRect.top + (y * videoRect.height) / video.videoHeight;

   
    const textElement = document.createElement("div");
    textElement.textContent = text;
    

    textElement.style.position = "absolute";
    textElement.style.left = `${scaledX}px`;
    textElement.style.top = `${scaledY}px`;
    textElement.style.color = "white";
    textElement.style.background = "rgba(0, 0, 0, 0.7)";
    textElement.style.padding = "5px";
    textElement.style.borderRadius = "5px";
    textElement.style.fontSize = "16px";


    resultsContainer.appendChild(textElement);
}


function captureFrame(video, canvas) {
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/png");

    return base64Image;

}


async function sendBase64Image(base64Image) {
    const url = "https://89.223.68.28:8443/api/v1/recognition";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ base64Content: base64Image }),
        });

        if (response.ok) {
            const data = await response.json(); // Ждем получения JSON-ответа
            // processData(data); // Обрабатываем данные
            return data; // Возвращаем данные
        } else {
            console.error('Server returned an error:', response.status);
            return null; // Возвращаем null в случае ошибки
        }
    } catch (error) {
        console.error('Error while sending the request:', error);
        return null; // Возвращаем null в случае исключения
    }
}



const processData = (data) => {
    // console.log(data + "\n\n\n");
    data.forEach(line => {
        line.Words.forEach(word => {
            placeTextAtCoordinates(word.Left, word.Top, word.WordText); 
        });
    });
};







