import React, { useEffect, useState } from "react"
import Style from "./Style.css"
import Home from "./Home"
import Question from "./Question"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    let persist;
    let details;
    let theme = localStorage.getItem("mode")

    if (localStorage.getItem("Restart") === null) {
        persist = true;
    } else {
        persist = false;
    }

    if (!localStorage.getItem("data")) {
        details = {
            category: "",
            number: "",
            difficulty: ""
        }
    } else {
        details = JSON.parse(localStorage.getItem("data"))
    }

    const [start, setStart] = React.useState(persist)
    const [quiz, setQuiz] = React.useState([])
    const [reset, setReset] = React.useState(true)
    const [showAnswers, setShowAnswers] = React.useState(false)
    const [formData, setFormData] = React.useState(details)
    const [mode, setMode] = useState(theme)
    const [confirm, setConfirm] = useState(false)


    localStorage.setItem("data", JSON.stringify(formData))

    useEffect(() => {

        let apiUrl;

        if (formData.category === 'Any Category') {
            apiUrl = `https://opentdb.com/api.php?amount=${formData.number}`
        } else {
            apiUrl = `https://opentdb.com/api.php?amount=${formData.number}&category=${formData.category}&difficulty=${formData.difficulty}`
        }

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => setQuiz(() => {
                return data.results.map(details => {
                    // Answer options
                    let wrong = details.incorrect_answers.map(answer => {
                        return {
                            id: nanoid(),
                            value: answer,
                            isHeld: false
                        };
                    })

                    let right = {
                        id: nanoid(),
                        value: details.correct_answer,
                        isHeld: false
                    }

                    let options = shuffle(
                        [...wrong, right]
                    )

                    // True/False Logic
                    if (details.type === 'boolean') {
                        if (right.value === 'True') {
                            options = [right, wrong[0]]
                        } else {
                            options = [wrong[0], right]
                        }
                    }
                    return { ...details, id: nanoid(), answers: options }
                })
            }))
            .catch(error => console.log(error))
    }, [reset, formData.number, formData.difficulty, formData.category])

    // Function to mix correct/incorrect functions
    function shuffle(array) {
        let currentIndex = array.length;
        let randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]]
        }
        return array;
    }

    // Logic to keep score
    let score = 0;
    if (showAnswers) {
        quiz.map(prevQuiz => {
            return prevQuiz.answers.map(answer => {
                return answer.isHeld && answer.value === prevQuiz.correct_answer ?
                    score++ : score;

            })
        })
    }

    let percentage = (score / formData.number) * 100;

    // Confetti display Logic
    let perfect = false;
    if (showAnswers) {
        if (score == formData.number) {
            perfect = true
        }
    }

    // startGame function
    function startQuiz() {
        setStart(false)
    }

    // endGame function
    function endGame() {
        setStart(true)
        setFormData(prevData => {
            return {
                category: "",
                number: "",
                difficulty: ""
            }
        })
        setShowAnswers(false)
        setConfirm(false)
        localStorage.removeItem("Restart")
    }

    // Customize questions
    function handleChange(event) {
        const { name, value } = event.target

        console.log(name.value)
        setFormData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
        setShowAnswers(false)
        localStorage.setItem("Restart", start)
    }

    // DialogBox function
    function handleDialog(choose) {
        function enable() {
            window.onscroll = function () { };
        }

        if (choose) {
            setShowAnswers(true)
            setConfirm(false)
            enable()
        } else {
            setShowAnswers(false)
            setConfirm(false)
            enable()
        }
    }

    // Check results
    function checkAnswer() {

        const values = quiz.map(prev => {
            return prev.answers.map(opt => opt.isHeld)
        })

        const checkOut = values.map(opt => {
            return opt.every(opt => opt === false)
        })

        const held = checkOut.every(Boolean)

        function disable() {
            // To get the scroll position of current webpage
            const TopScroll = window.pageYOffset
            const LeftScroll = window.pageXOffset

            // if scroll happens, set it to the previous value
            window.onscroll = function () {
                window.scrollTo(LeftScroll, TopScroll);
            }
        }

        if (held === true) {
            setConfirm(true)
            disable()
        } else {
            setShowAnswers(true)
        }
    }

    // playAgain function
    function resetQuiz() {
        setShowAnswers(false)
        setReset(prev => !prev)
        window.scrollTo({ top: 0 })
    }

    // Logic for rendering the submit/reset buttons
    const buttonElement = showAnswers ?
        <div className="btn-container">
            <span className="result">You got {score} out of {formData.number} answers correctly ({percentage}%)</span>
            <button className={`main-btn btn ${mode}`} onClick={resetQuiz}>Play Again</button>
        </div>
        :
        <div className="btn-container">
            <button className={`main-btn btn ${mode}`} onClick={checkAnswer}>Check Answers</button>
        </div>

    // Customize questions
    const customDisplay =
        <div className="custom">
            <label htmlFor="category">Category</label>
            <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}

            >
                <option value="">-Choose-</option>
                <option value="Any Category">Any Category</option>
                <option value="9">General Knowledge</option>
                <option value="11">Film</option>
                <option value="12">Music</option>
                <option value="14">Television</option>
                <option value="21">Sports</option>
                <option value="22">Geography</option>
                <option value="17">Science & Nature</option>
                <option value="27">Animals</option>
                <option value="23">History</option>
                <option value="24">Politics</option>
                <option value="28">Vehicles</option>
            </select>
            <label htmlFor="difficulty">Difficulty</label>
            <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
            >
                <option value="">-Choose-</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <label htmlFor="number">Questions</label>
            <select
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
            >
                <option value="">-Choose-</option>
                <option value="5">5</option>
                <option value="10">10</option>
            </select>
            {/* <input
                type="radio"
                id="easy"
                name="difficulty"
                value="easy"
                checked={formData.difficulty === "easy"}
                onChange={handleChange}
            />
            <label htmlFor="easy">Easy</label>
            <input
                type="radio"
                id="medium"
                name="difficulty"
                value="medium"
                checked={formData.difficulty === "medium"}
                onChange={handleChange}
            />
            <label htmlFor="medium">Medium</label>
            <input
                type="radio"
                id="hard"
                name="difficulty"
                value="hard"
                checked={formData.difficulty === "hard"}
                onChange={handleChange}
            />
            <label htmlFor="hard">Hard</label> */}
            <div >
                <img src="power-switch.png" alt="icon.png"
                    className={`power-btn ${mode}`}
                    onClick={endGame}
                />
            </div>
            <div >
                <img src={mode ? "sun.png" : "moon.png"} alt="icon.png"
                    className={`mode-btn ${mode}`}
                    onClick={changeMode}
                />
            </div>
            <hr />
        </div>

    // Function for answer selections
    function isSelected(id, aId) {

        const make = quiz.map(prevData => {
            const pls = prevData.answers.map(ans => {
                return ans.id === id ?
                    { ...ans, isHeld: !ans.isHeld }
                    : { ...ans, isHeld: false }
            })
            return prevData.id === aId ?
                { ...prevData, answers: pls }
                : prevData
        })
        setQuiz(make)
    }

    // Question component
    const questions = quiz.map(question => {
        return (
            <Question
                key={nanoid()}
                id={question.id}
                questions={question.question}
                answers={question.answers}
                selected={isSelected}
                showAnswer={showAnswers}
                correct={question.correct_answer}
                mode={mode}
                dialog={confirm}
            />
        )
    })

    // Logic for rendering buttonElement
    const show = () => {
        let res = true
        if (formData.number === "") {
            res = false
        }
        return res
    }

    // Function for mode change
    function changeMode() {
        if (theme === "" || theme === null) {
            theme = "dark"
        } else {
            theme = ""
        }
        setMode(theme)
        localStorage.setItem("mode", theme)
    }

    // Display dialog component
    const dialogBox =
        <div className={`dialog-container ${mode}`}>
            <div className="dialog custom">
                <h2 style={{ color: "red" }}>You answered no questions!</h2>
                <span>Do you wish to proceed?</span>
                <div className="btn-container">
                    <button className={`main-btn btn ${mode}`}
                        onClick={() => handleDialog(false)}
                    >
                        Cancel
                    </button>
                    <button className={`main-btn btn ${mode}`}
                        onClick={() => handleDialog(true)}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>

    // Logic for switching body color during mode change
    if (mode) {
        document.body.style.backgroundColor = "black";
        document.body.style.color = "#F5F7FB";
    } else {
        document.body.style.backgroundColor = "#F5F7FB";
        document.body.style.color = "#293264";
    }

    let styles;
    if (mode) {
        styles = {
            backgroundColor: "black"
        }
    } else {
        styles = {
            backgroundColor: "#F5F7FB"
        }
    }


    return (
        <main >
            {start ?
                <Home start={startQuiz} toggle={changeMode} mode={mode} />
                :
                <>
                    {perfect &&
                        <div className={`congrats container ${mode}`} id="holder">
                            <h2 className="perfect">CONGRATULATIONS!</h2>
                            <h3 className="perfect1">You had perfect score!</h3>
                        </div>

                    }
                    {perfect && <Confetti height={window.outerHeight} />}
                    {customDisplay}
                    {questions}
                    {!show() ?
                        <div className={`placeholder ${mode}`}
                            style={styles}
                        >
                            <h2>Please<br />choose your quiz<br />type</h2>
                        </div>
                        : buttonElement
                    }
                    {confirm && dialogBox}
                </>
            }
            <img src="../images/blob-yellow.png" className="yellow" alt="blob.png" />
            <img src="../images/blob-blue.png" className="blue" alt="blob.png" />
        </main >
    )
}
