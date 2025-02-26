const socket = io(); // Conectar al servidor WebSocket

let currentQuestionIndex = 0;
let lives = 3;
let position = 0;
let score = 0;
let questions = [];
const stonePositions = [180, 310, 430, 560];
let selectedAnswerIndex = -1;

async function startGame() {
    const boy = document.getElementById('boy');
    boy.style.left = '40px';
    boy.style.bottom = '80px';
    boy.style.zIndex = '10';
    const audio = document.getElementById('backgroundMusic');
    audio.play()
    .catch(error => {
        console.log("El navegador bloqueó la reproducción automática de audio.");
    });

    document.getElementById('startButton').style.display = 'none';
    document.getElementById('saltos-de-ciencia').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('boy').style.display = 'block';
    document.getElementById('cat').style.display = 'block';
    document.getElementById('stones').style.display = 'flex';
    document.getElementById('lives').style.display = 'block';
    document.getElementById('progress').style.display = 'block';
    document.getElementById('score').style.display = 'block';

    await fetchQuestions();
    displayQuestion();
}

async function fetchQuestions() {
    try {
        const response = await fetch('/preguntas');
        questions = await response.json();
        shuffleArray(questions);  //Mezcla las preguntas
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

// Función para mezclar el array de preguntas usando el algoritmo de Fisher-Yates
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Intercambia elementos
    }
}

function displayQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        
        let optionsHtml = question.options.map((option, index) => `
            <label class="answer" data-index="${index}">
                <input type="radio" name="answer" value="${option.option}" onclick="checkAnswer('${option.option}')">
                ${option.option}. ${option.text || 'Opción sin texto'}
            </label>
        `).join('');

        questionContainer.innerHTML = `
            <h2>${question.question}</h2>
            <div class="options">
                ${optionsHtml}
            </div>
        `;

        document.getElementById('moveButton').style.display = 'none';
        document.getElementById('progress').innerText = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;
        document.getElementById('feedback').innerText = '';
        
        // Reiniciar la selección
        selectedAnswerIndex = -1;
        highlightAnswer();
    } else {
        questionContainer.innerHTML = '<h2>¡Has completado todas las preguntas!</h2>';
    }
}

function checkAnswer(selectedOption) {
    const feedbackElement = document.getElementById('feedback');
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selectedOption === correctAnswer) {
        score += 20;
        feedbackElement.innerHTML = '<i class="fas fa-check-circle"></i> ¡Respuesta correcta!';
        feedbackElement.classList.add('correct');
        document.getElementById('score').innerText = `Puntos: ${score}`;

        // Habilitar el botón "Mover"
        const moveButton = document.getElementById('moveButton');
        moveButton.style.display = 'block';

        // **Enfocar automáticamente el botón "Mover"**
        moveButton.focus();

        // Opcional: Agregar un efecto visual al botón
        moveButton.classList.add('highlight');
        setTimeout(() => moveButton.classList.remove('highlight'), 1000);
        
    } else {
        //score -= 20;
        // Restar 20 puntos pero asegurarse de que el puntaje no sea menor a 0
        score = Math.max(0, score - 20);
        
        feedbackElement.innerHTML = '<i class="fas fa-times-circle"></i> Respuesta incorrecta. Inténtalo de nuevo.';
        feedbackElement.classList.add('incorrect');
        document.getElementById('score').innerText = `Puntos: ${score}`;
        lives--;
        updateLives();

        setTimeout(() => {
            feedbackElement.classList.remove('incorrect');
            feedbackElement.innerHTML = '';

            // Eliminar la pregunta actual del array y mostrar otra aleatoria
            questions.splice(currentQuestionIndex, 1);

            if (questions.length > 0) {
                currentQuestionIndex = Math.floor(Math.random() * questions.length);
                displayQuestion();
            } else {
                document.getElementById('questionContainer').innerHTML = '<h2>¡No quedan más preguntas!</h2>';
            }
        }, 1000);

        if (lives === 0) {
            showRetryModal();
        }
    }
}


function saltar() {
    const feedbackElement = document.querySelector('.feedback');
    if (feedbackElement) {
        feedbackElement.classList.remove('correct');
        feedbackElement.classList.remove('incorrect'); // Oculta el feedback
    }
    const stones = document.querySelectorAll('.stone');
    const boy = document.getElementById('boy');

    if (position < stones.length) {
        const targetStone = stones[position];
        const targetLeft = stonePositions[position];
        const stoneWidth = targetStone.offsetWidth;

        // Calcular la posición frontal de la piedra
        const frontPosition = targetLeft + (stoneWidth * 0.0); // Ajusta este valor según necesites

        // Realizar el salto
        boy.style.transition = 'left 0.5s ease-in-out, bottom 0.25s ease-in-out';
        boy.style.left = `${frontPosition}px`;
        boy.style.bottom = '150px'; // Sube el niño
        boy.style.zIndex = '10'; // Asegura que el niño esté por encima de la piedra

        setTimeout(() => {
            boy.style.bottom = '70px'; // Baja el niño después de 250ms
        }, 250);

        // Actualizar la posición y cargar la siguiente pregunta
        setTimeout(() => {
            position++;
            document.getElementById('moveButton').style.display = 'none';
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length ) {
                displayQuestion(); //
                
            } else {
                moveToCat();
            }
        }, 600);
    } else {
        // Este es el último salto, directamente al gato
        moveToCat();
    }
}

function movePointerToAnswer(answerIndex) {
    const answers = document.querySelectorAll('.answer'); // Todas las respuestas
    
    if (answers.length > answerIndex) {
        const targetAnswer = answers[answerIndex]; // La respuesta específica
        targetAnswer.querySelector('input').click(); // Selecciona la respuesta
        scrollToElement(targetAnswer); // Desplaza el puntero al elemento visualmente
    }
}

function scrollToElement(element) {
    const rect = element.getBoundingClientRect(); // Posición del elemento
    window.scrollTo({
        top: rect.top + window.scrollY - 100, // Ajusta el desplazamiento según necesites
        behavior: 'smooth'
    });
}

function moveToCat() {
    const boy = document.getElementById('boy');
    const cat = document.getElementById('cat');
    const catLeft = cat.offsetLeft - 50; // Mover al niño a la izquierda del gato

    // Animación del último salto
    boy.style.transition = 'left 0.8s ease-in-out, bottom 0.4s ease-in-out';
    boy.style.left = `${catLeft}px`;
    boy.style.bottom = '150px'; // Sube el niño

    setTimeout(() => {
        boy.style.bottom = '80px'; // Baja el niño después de 400ms
    }, 400);

    setTimeout(() => {
        showVictoryAnimation();
    }, 900);
}

function updateLives() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        livesContainer.innerHTML += '❤️';
    }
    if (lives > 0 && lives < 3) {
        livesContainer.classList.add('lives-animation');
        setTimeout(() => livesContainer.classList.remove('lives-animation'), 1000);
    }
}

function showRetryModal() {
    document.getElementById('retryModal').style.display = 'flex';
}

function showVictoryAnimation() {
    const boy = document.getElementById('boy');
    boy.style.left = '685px';
    setTimeout(() => {
        // Mostrar el modal de victoria
        document.getElementById('victoryModal').style.display = 'flex';
    }, 1000);
}

document.addEventListener('keydown', function(event) {
    const answers = document.querySelectorAll('.answer');
    
    switch(event.key) {
        case 'ArrowUp':
            event.preventDefault();
            if (selectedAnswerIndex > 0) {
                selectedAnswerIndex--;
                highlightAnswer();
            }
            break;
        case 'ArrowDown':
            event.preventDefault();
            if (selectedAnswerIndex < answers.length - 1) {
                selectedAnswerIndex++;
                highlightAnswer();
            }
            break;
        case 'Enter':
            event.preventDefault();
            if (selectedAnswerIndex !== -1) {
                const selectedInput = answers[selectedAnswerIndex].querySelector('input');
                if (selectedInput) {
                    selectedInput.click();
                }
            }
            break;
        case ' ':
            event.preventDefault();
            const moveButton = document.getElementById('moveButton');
            if (moveButton.style.display !== 'none') {
                saltar();
            }
            break;
    }
});

function highlightAnswer() {
    const answers = document.querySelectorAll('.answer');
    answers.forEach((answer, index) => {
        if (index === selectedAnswerIndex) {
            answer.classList.add('selected');
        } else {
            answer.classList.remove('selected');
        }
    });
}

function resetGame() {
    const feedbackElement = document.querySelector('.feedback');
    if (feedbackElement) {
        feedbackElement.classList.remove('correct');
        feedbackElement.classList.remove('incorrect'); // Oculta el feedback
    }
    document.getElementById('retryModal').style.display = 'none';
    document.getElementById('victoryModal').style.display = 'none';
    currentQuestionIndex = 0;
    selectedAnswerIndex = -1;
    lives = 3;
    position = 0;
    score = 0; // Restablecer la puntuación a 0 al reiniciar el juego
    document.getElementById('boy').style.left = '40px';
    document.getElementById('boy').style.bottom = '80px';
    document.getElementById('score').innerText = `Puntos: ${score}`; // Restablecer la visualización de la puntuación
    updateLives();
    displayQuestion();
}

async function exitGame() {
    try {
        const response = await fetch('/usuario/updateScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ score: score }) // score es tu variable global del juego
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el puntaje');
        }

        const data = await response.json();
        console.log('Puntaje actualizado:', data.body.puntaje);
        
        // Guardar en localStorage si aún lo necesitas
        localStorage.setItem('score', score);
        
        // Redirigir a la página de tabla
        window.location.href = 'Tabla.html';
    } catch (error) {
        console.error('Error:', error);
        // Redireccionar de todas formas
        window.location.href = 'Tabla.html';
    }
}

// Escuchar eventos de botones presionados
socket.on('botonPresionado', (data) => {
    console.log(`Botón presionado: ${data.boton}`);

    switch (data.boton) {
        case 'respuesta1':
            movePointerToAnswer(0); // Selecciona la primera respuesta
            break;
        case 'respuesta2':
            movePointerToAnswer(1); // Selecciona la segunda respuesta
            break;
        case 'respuesta3':
            movePointerToAnswer(2); // Selecciona la tercera respuesta
            break;
        case 'saltar':
            saltar(); // Realiza el salto
            break;
        case 'salir':
            exitGame(); // Sale del juego
            break;
        case 'cancelar':
            resetGame();
            console.log("Cancelar presionado");
            break;
        }
});

document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("startButton");
    const gameImage = document.getElementById("game-image");

    startButton.addEventListener("click", function () {
        gameImage.style.display = "none";  // Oculta la imagen al hacer clic en el botón
    });
});