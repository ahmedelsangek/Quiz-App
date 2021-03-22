/* ----------------------- Start login Slides -------------------------*/
/*------------- Set Variables -------------*/
//Login Name slide variables
let proceedButton = document.querySelector(".proceed-button");
let loginName = document.querySelector(".quiz-app .login-name");
let loginPassword = document.querySelector(".quiz-app .login-password");
let questionForm = document.querySelector(".login-password h2");
let inputName = document.querySelector(".input-name");

//Login Password slide variables
let lockIcon = document.querySelector(".finger-print");
let inputPassword = document.querySelector(".input-pass");
let confirmButton = document.querySelector(".confirm-button");
let mySympol = Symbol.for("11223344");

//incorrect Password slide variables
let incorrectLoginpass = document.querySelector(".incorrect-password");
let dismissButton = document.querySelector(".dismiss-button");

//Start Quiz Slide
let countdownElement = document.querySelector(".timer");
let startQuizSlide = document.querySelector(".start-quiz");
let startQuizButton = document.querySelector(".start-quiz .button-start");
let questionSlide = document.querySelector(".questions-slide");
let qCount;

//Result Slide
let resultSlide = document.querySelector(".result-slide");
let persntageNumber = document.querySelector(".result-slide .percentage");
let circleColor = document.querySelector(".result-slide .circle");
let resultFeedBack = document.querySelector(".result-slide h2");
let rightAnswerCount = document.querySelector(".result-slide h3 span");
let retakeButton = document.querySelector(".retake-quiz");
let rightAnswer = 0;
let correctAnswer = 0;

//Exite Button
let exiteButton = document.querySelector(".exite");
exiteButton.onclick = function () {
    localStorage.removeItem("name");
    location.reload();
};

//Start Local Stoarge
let localValue = localStorage.getItem("name");
if (localValue !== null) {
    slideShow("none", "block", "none", "none", "none", "none");
    questionForm.innerText = `${localValue}, Please Provide Your Key`;
    exiteButton.style.display = "block";
}

/*---------------------- When User Procced Button ---------------------*/
proceedButton.addEventListener("click", () => {
    proceedLogin();
});
inputName.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        proceedLogin();
    }
});
function proceedLogin() {
    //Show Login Password slide
    slideShow("none", "block", "none", "none", "none", "none");
    //Set User Name
    if (inputName.value === "") {
        questionForm.innerText = `Buddy, Please Provide Your Key`;
        localStorage.setItem("name", "Buddy");
    } else {
        questionForm.innerText = `${inputName.value}, Please Provide Your Key`;
        localStorage.setItem("name", inputName.value);
        exiteButton.style.display = "block";
    }
};

//Change Icon and Button color When Key Up On Input
inputPassword.onkeyup = function () {
    lockIcon.style.color = "#007BFF";
    confirmButton.style.backgroundColor = "#0069D9";
    confirmButton.style.pointerEvents = "auto";
};

/*--------------When User Check Password---------------*/
confirmButton.addEventListener("click", () => {
    confirmLogin();
});
inputPassword.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
        confirmLogin();
    }
});
function confirmLogin() {
    confirmButton.innerHTML = "<i class='fas fa-sync-alt fa-pulse'></i>";
    let rotate = setTimeout(function () {
        if (inputPassword.value === Symbol.keyFor(mySympol)) {
            //Show Quiz Slide
            slideShow("none", "none", "none", "block", "none", "none");
        } else {
            //Show Incorrect Slide
            slideShow("none", "none", "block", "none", "none", "none");
            confirmButton.innerHTML = "Confirm Identity"
        }
    }, 2000);
};

/*-------------- When Dismiss Button ---------------*/
dismissButton.addEventListener("click", () => {
    //Show incorrect Password slide
    slideShow("none", "block", "none", "none", "none", "none");
});

/*-------------- When Start Quiz Button ---------------*/
startQuizButton.addEventListener("click", () => {
    countDown(20, qCount);
    //Show incorrect Password slide
    slideShow("none", "none", "none", "none", "block", "none");
});

/*----------------- When Start Quiz Button -------------------*/
retakeButton.addEventListener("click", () => {
    location.reload();
});

//--------------------------------------Functions
//Hide And Show Slide Function
function slideShow (nameSlide, passSlide, incorrectSlide, quizSlide, quizBoard, result) {
    loginName.style.display = nameSlide;
    loginPassword.style.display = passSlide;
    incorrectLoginpass.style.display = incorrectSlide;
    startQuizSlide.style.display = quizSlide;
    questionSlide.style.display = quizBoard;
    resultSlide.style.display = result;
};
/* ----------------------- End login Slides -------------------------*/

/*------------------- Start Questions Slide ------------*/
let questionTitle = document.querySelector(".questions-slide .question");
let answersParent = document.querySelector(".questions-slide .answers");
let nextQuestion = document.querySelector(".next-question");
let currentIndex = 0;

function handleJsonData() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            qCount = questionsObject.length;
            let theRightAnswer;
            questionTitle.innerHTML = questionsObject[currentIndex].title;
            getNextQuestions(questionsObject[currentIndex], qCount);
            handleAnswerSpans();

            nextQuestion.addEventListener("click", () => {
                clearInterval(countDownInterVal);
                currentIndex++;
                theRightAnswer = questionsObject[currentIndex - 1].right_answer;
                checkAnswer(theRightAnswer);
                answersParent.innerHTML = "";
                nextQuestion.style.pointerEvents = "none";
                nextQuestion.style.opacity = ".5";
                countDown(20, qCount);
                getNextQuestions(questionsObject[currentIndex], qCount);
                handleSpans();
                handleAnswerSpans();
                showResultSlide(qCount);
                theResult();
            });
        }
    };
    myRequest.open("GET", "../js/html_questions.json", true);
    myRequest.send();
};
handleJsonData();





//Set Dtat To Slide When Click On Next Question
function getNextQuestions(qObj, count) {
    if (currentIndex < count) {
        questionTitle.innerHTML = qObj.title;
        for (i = 1; i <= 4; i++) {
            //Craete Answer Div
            let answerDiv = document.createElement("div");
            answerDiv.className = "answer";

            //Craete Radio Span
            let radioSpan = document.createElement("span");
            radioSpan.className = "radio";
            radioSpan.dataset.answer = qObj[`answer_${i}`];
            answerDiv.appendChild(radioSpan);

            //Craete Answer Head
            let answerHead = document.createElement("h4");
            let answerHeadText = document.createTextNode(qObj[`answer_${i}`])
            answerHead.appendChild(answerHeadText);
            answerDiv.appendChild(answerHead);

            //Append Answers Div To Question Slide
            answersParent.appendChild(answerDiv);
        };
    };
};

//Set Color To Span Depend On Question number
function handleSpans() {
    let allSpans = document.querySelectorAll(".questions-slide .spans span");
    allSpans.forEach((span, index) => {
        if (currentIndex === index) {
            span.classList.add("on");
        }
    });
}

//Set Active Class On Span at Question Slide
let allAnswerSpans;
function handleAnswerSpans() {
    allAnswerSpans = document.querySelectorAll(".questions-slide .radio");
    allAnswerSpans.forEach((span) => {
        span.addEventListener("click", () => {
            allAnswerSpans.forEach((span) => {
                span.classList.remove("active");
            })
            span.classList.add("active");
            nextQuestion.style.pointerEvents = "auto";
            nextQuestion.style.opacity = "1";
        })
    });
};

function checkAnswer(rAnswer) {
    let spansArray = Array.from(allAnswerSpans);
    spansArray.forEach((span) => {
        if (span.classList.contains("active")) {
            if (span.dataset.answer === rAnswer) {
                rightAnswer = rightAnswer + 10;
                correctAnswer++
            }
        }
    })
};

function showResultSlide(count) {
    if (currentIndex === count - 1) {
        nextQuestion.innerText = "Submit";
    }
    if (currentIndex === count) {
        slideShow("none", "none", "none", "none", "none", "block");
        clearInterval(countDownInterVal);
    }
};


function theResult() {
    rightAnswerCount.innerText = correctAnswer;
    persntageNumber.innerHTML = `${rightAnswer}%`;
    circleColor.setAttribute("stroke-dasharray", `${rightAnswer}, 100`);
    if (correctAnswer <= 4) {
        resultFeedBack.innerHTML = "Oh No! Your Are Failed...<br>Better Luck Next Time";
        circleColor.style.stroke = "red";
    } else if (correctAnswer > 4 && correctAnswer <= 6) {
        resultFeedBack.innerText = "You Are Passed!";
        circleColor.style.stroke = "#ff9f00";
    } else if (correctAnswer === 7) {
        resultFeedBack.innerText = "Good Effort, You Are Pass.";
        circleColor.style.stroke = "#3c9ee5";
    } else if (correctAnswer > 7 && correctAnswer <= 9) {
        resultFeedBack.innerText = "Congrats! You Are Pass.";
        circleColor.style.stroke = "#3c9ee5";
    } else if (correctAnswer === 10) {
        resultFeedBack.innerText = "Wohoo.. Great, You Are Pass!";
        circleColor.style.stroke = "#4cc790";
    }
};

function countDown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countDownInterVal = setInterval(() => {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownElement.innerHTML = `<span>${minutes} : <span>${seconds}</span>`;

            if  (--duration < 0) {
                clearInterval(countDownInterVal);
                nextQuestion.click();
            }
        }, 1000);
    }
}
/*------------------- End Questions Slide --------------*/