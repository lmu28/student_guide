function recognizeTextFromImage(imageData) {
    // Убираем префикс data URL, если он есть
    const base64String = imageData.split(',')[1];

    // Подготовка данных для отправки
    const data = {
        image: base64String // Убедитесь, что сервер ожидает именно такой формат
    };

    fetch('https://your-external-server.com/api/recognize', { // Замените на ваш URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Получаем ответ в формате JSON
    })
    .then(data => {
        // Извлекаем текст из ответа
        const recognizedText = data.text; // Предполагаем, что ваш сервер возвращает объект с полем 'text'
        console.log('Recognized text:', recognizedText);
    })
    .catch(error => {
        console.error('Error during recognition:', error);
    });
}