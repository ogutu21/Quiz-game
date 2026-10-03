// ========================================
// QUIZ GAME
// ONLINE RANDOM QUESTIONS
// ========================================


// ========================================
// ELEMENTS
// ========================================

const questionNumberElement =
    document.getElementById("questionNumber");

const scoreElement =
    document.getElementById("score");

const progressBar =
    document.getElementById("progressBar");

const questionElement =
    document.getElementById("question");

const answersElement =
    document.getElementById("answers");

const feedbackElement =
    document.getElementById("feedback");

const nextButton =
    document.getElementById("nextButton");

const resultElement =
    document.getElementById("result");

const finalScoreElement =
    document.getElementById("finalScore");

const resultMessageElement =
    document.getElementById("resultMessage");

const restartButton =
    document.getElementById("restartButton");

const themeButton =
    document.getElementById("themeButton");


// ========================================
// QUIZ SETTINGS
// ========================================

const TOTAL_QUESTIONS = 10;

const API_URL =
    "https://opentdb.com/api.php?amount=10&type=multiple";


// ========================================
// QUIZ VARIABLES
// ========================================

let questions = [];

let currentQuestion = 0;

let score = 0;

let answered = false;


// ========================================
// DECODE HTML
// ========================================

function decodeHTML(text) {

    const textArea =
        document.createElement("textarea");

    textArea.innerHTML = text;

    return textArea.value;
}


// ========================================
// SHUFFLE ARRAY
// ========================================

function shuffle(array) {

    return array.sort(() => Math.random() - 0.5);

}


// ========================================
// LOAD QUESTIONS
// ========================================

async function loadQuestions() {

    questionElement.textContent =
        "Loading questions...";

    answersElement.innerHTML = "";

    feedbackElement.textContent = "";

    nextButton.style.display = "none";


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "Unable to connect to the quiz server."
            );
        }


        const data =
            await response.json();


        if (
            data.response_code !== 0 ||
            !data.results ||
            data.results.length === 0
        ) {

            throw new Error(
                "No questions were received."
            );
        }


        questions =
            data.results.map(question => {

                const correctAnswer =
                    decodeHTML(
                        question.correct_answer
                    );

                const incorrectAnswers =
                    question.incorrect_answers.map(
                        answer => decodeHTML(answer)
                    );


                const answers =
                    shuffle([
                        correctAnswer,
                        ...incorrectAnswers
                    ]);


                return {
                    question:
                        decodeHTML(question.question),

                    correctAnswer,

                    answers,

                    category:
                        decodeHTML(question.category)
                };

            });


        currentQuestion = 0;

        score = 0;

        scoreElement.textContent =
            "Score: 0";


        resultElement.classList.add("hidden");

        document.querySelector(".question-card")
            .classList.remove("hidden");


        document.querySelector(".quiz-info")
            .style.display = "flex";


        document.querySelector(".progress-container")
            .style.display = "block";


        displayQuestion();


    } catch (error) {

        questionElement.textContent =
            "Unable to load questions.";

        answersElement.innerHTML = `
            <p style="
                grid-column: 1 / -1;
                text-align: center;
                color: #dc3545;
                line-height: 1.6;
            ">
                ${error.message}
                <br><br>
                Check your internet connection
                and try again.
            </p>
        `;

        feedbackElement.textContent = "";

        nextButton.style.display = "none";
    }
}


// ========================================
// DISPLAY QUESTION
// ========================================

function displayQuestion() {

    answered = false;

    const question =
        questions[currentQuestion];


    // Question number

    questionNumberElement.textContent =
        `Question ${currentQuestion + 1} of ${TOTAL_QUESTIONS}`;


    // Progress

    const progress =
        ((currentQuestion + 1) / TOTAL_QUESTIONS) * 100;

    progressBar.style.width =
        `${progress}%`;


    // Question

    questionElement.textContent =
        question.question;


    // Clear old answers

    answersElement.innerHTML = "";


    // Clear feedback

    feedbackElement.textContent = "";


    // Create answers

    question.answers.forEach(answer => {

        const button =
            document.createElement("button");


        button.classList.add("answer-button");

        button.textContent = answer;


        button.addEventListener(
            "click",
            () => checkAnswer(button, answer)
        );


        answersElement.appendChild(button);

    });


    // Hide next button

    nextButton.style.display =
        "none";
}


// ========================================
// CHECK ANSWER
// ========================================

function checkAnswer(button, selectedAnswer) {

    if (answered) {
        return;
    }


    answered = true;


    const question =
        questions[currentQuestion];


    const allButtons =
        document.querySelectorAll(
            ".answer-button"
        );


    // Disable every answer

    allButtons.forEach(answerButton => {

        answerButton.disabled = true;

    });


    // Correct answer

    if (
        selectedAnswer ===
        question.correctAnswer
    ) {

        button.classList.add("correct");

        feedbackElement.textContent =
            "Correct! 🎉";

        score++;

        scoreElement.textContent =
            `Score: ${score}`;


    } else {

        // Wrong answer

        button.classList.add("wrong");

        feedbackElement.textContent =
            `Wrong! The correct answer is: ${question.correctAnswer}`;


        // Show correct answer

        allButtons.forEach(answerButton => {

            if (
                answerButton.textContent ===
                question.correctAnswer
            ) {

                answerButton.classList.add(
                    "correct"
                );

            }

        });

    }


    // Show next button

    nextButton.style.display =
        "block";


    // Last question

    if (
        currentQuestion ===
        questions.length - 1
    ) {

        nextButton.textContent =
            "Show Results";

    } else {

        nextButton.textContent =
            "Next Question";

    }
}


// ========================================
// NEXT QUESTION
// ========================================

nextButton.addEventListener(
    "click",
    function () {

        currentQuestion++;


        if (
            currentQuestion >=
            questions.length
        ) {

            showResults();

        } else {

            displayQuestion();

        }

    }
);


// ========================================
// SHOW RESULTS
// ========================================

function showResults() {

    document.querySelector(".question-card")
        .classList.add("hidden");


    document.querySelector(".quiz-info")
        .style.display = "none";


    document.querySelector(".progress-container")
        .style.display = "none";


    nextButton.style.display =
        "none";


    feedbackElement.textContent =
        "";


    resultElement.classList.remove(
        "hidden"
    );


    finalScoreElement.textContent =
        `${score} / ${questions.length}`;


    const percentage =
        (score / questions.length) * 100;


    if (percentage === 100) {

        resultMessageElement.textContent =
            "Perfect score! Excellent work! 🏆";

    } else if (percentage >= 80) {

        resultMessageElement.textContent =
            "Great job! You know your stuff! 🎉";

    } else if (percentage >= 60) {

        resultMessageElement.textContent =
            "Good work! Keep practicing! 👍";

    } else if (percentage >= 40) {

        resultMessageElement.textContent =
            "Not bad! A little more practice will help.";

    } else {

        resultMessageElement.textContent =
            "Keep learning and try again! 💪";
    }
}


// ========================================
// RESTART QUIZ
// ========================================

restartButton.addEventListener(
    "click",
    function () {

        loadQuestions();

    }
);


// ========================================
// DARK MODE
// ========================================

themeButton.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark-mode"
        );


        if (
            document.body.classList.contains(
                "dark-mode"
            )
        ) {

            themeButton.textContent = "☀️";

            localStorage.setItem(
                "quizTheme",
                "dark"
            );

        } else {

            themeButton.textContent = "🌙";

            localStorage.setItem(
                "quizTheme",
                "light"
            );
        }

    }
);


// ========================================
// LOAD SAVED THEME
// ========================================

const savedTheme =
    localStorage.getItem("quizTheme");


if (savedTheme === "dark") {

    document.body.classList.add(
        "dark-mode"
    );

    themeButton.textContent = "☀️";

} else {

    themeButton.textContent = "🌙";
}


// ========================================
// START QUIZ
// ========================================

loadQuestions();