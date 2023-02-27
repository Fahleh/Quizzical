import React, { useEffect, useState } from "react"
import Style from "./Style.css"
import Home from "./Home"
import Question from "./Question"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    let persist;
    let details;
    let theme = localStorage.getItem("mode")

    if(localStorage.getItem("Restart") === null) {
        persist = true;
    } else {
        persist = false;
    }

    if(!localStorage.getItem("data")) {
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

    localStorage.setItem("data", JSON.stringify(formData))

    React.useEffect(() => {
        
        let apiUrl;
        
        if(formData.category === 'Any Category') {
            apiUrl = `https://opentdb.com/api.php?amount=${formData.number}`
        } else {
            apiUrl =`https://opentdb.com/api.php?amount=${formData.number}&category=${formData.category}&difficulty=${formData.difficulty}`
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
                    if(details.type === 'boolean'){
                        if(right.value === 'True') {
                            options = [right, wrong[0]]
                        } else {
                            options = [wrong[0], right]
                        }
                    }
                    return {...details, id: nanoid(), answers: options}
                })
            }))
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
    if(showAnswers) {
        quiz.map(prevQuiz => {
           return prevQuiz.answers.map(answer => {
               return answer.isHeld && answer.value === prevQuiz.correct_answer ?
               score++ : score;  
               
            })
        })
    }
 
    // Confetti Logic
    let perfect = false;
   if(showAnswers) {
        if(score == formData.number) {  
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
        localStorage.clear()
    }

    // Customize questions
    function handleChange(event) {
        const {name, value} = event.target
        setFormData(prevData => {
            return {
                ...prevData,
                [name]: value
            }
        })
        setShowAnswers(false)
        localStorage.setItem("Restart", start)
    }

    // Check results
    function checkAnswer() {
        setShowAnswers(true)
    }
    
    // playAgain function
    function resetQuiz() {
        setShowAnswers(false)
        setReset(prev => !prev)
        window.scrollTo({top: 0})
    }
    
    // Logic for rendering the submit/reset buttons
    const buttonElement = showAnswers ?
        <div className= "btn-container">
            <span>You scored {score}/{formData.number} correct answers</span>
            <button className= {`main-btn btn ${mode}`} onClick = {resetQuiz}>Play Again</button>
        </div>
        :
        <div className= "btn-container">
            <button className= {`main-btn btn ${mode}`} onClick = {checkAnswer}>Check Answers</button>
        </div>
        
    // Customize questions
    const customDisplay = 
        <div className="custom">
            <label htmlFor="category">Category</label>
                <select
                    id = "category"
                    name = "category"
                    value = {formData.category}
                    onChange = {handleChange}
                    
                >
                    <option value = "">-Choose-</option>
                    <option value = "Any Category">Any Category</option>
                    <option value = "9">General Knowledge</option>
                    <option value = "23">History</option>
                    <option value = "21">Sports</option>
                    <option value = "24">Politics</option>
                </select>
            <label htmlFor="number">Questions</label>
            <select
                id = "number"
                name = "number"
                value = {formData.number}
                onChange = {handleChange}
            >
                <option value = "">-Choose-</option>
                <option value = "5">5</option>
                <option value = "10">10</option>
            </select>
            <input 
                    type = "radio"
                    id = "easy"
                    name = "difficulty"
                    value = "easy"
                    checked = {formData.difficulty === "easy"}
                    onChange = {handleChange}
                />
            <label htmlFor="easy">Easy</label>
            <input 
                type="radio"
                id="medium"
                name="difficulty"
                value="medium"
                checked = {formData.difficulty === "medium"}
                onChange = {handleChange}
            />
            <label htmlFor="medium">Medium</label>
            <input 
                type="radio"
                id="hard"
                name="difficulty"
                value="hard"
                checked = {formData.difficulty === "hard"}
                onChange = {handleChange}
            />
            <label htmlFor="hard">Hard</label>
            <div >
                <img src= "power-switch.png" alt="icon.png" 
                    className={`power-btn ${mode}`}
                    onClick={endGame}
                />
            </div>
            <div >
                <img src= {mode ? "sun-icon.png" : "moon.png"} alt="icon.png" 
                    className={`mode-btn ${mode}`}
                    onClick={changeMode}
                />
            </div>
            <hr/>
        </div>
    
    // Function for answer selections
    function isSelected(id, aId) {
        
        const make = quiz.map(prevData => {
            const pls = prevData.answers.map(ans => {
                return ans.id === id ?
            {...ans, isHeld: !ans.isHeld}
            : {...ans, isHeld: false}
            })
            return prevData.id === aId ? 
            {...prevData, answers: pls}
            : prevData
        })
        setQuiz(make)
    }
   
    // Question component
    const questions = quiz.map(question => {
        return (
            <Question 
                key = {nanoid()}
                id = {question.id}
                questions = {question.question}
                answers = {question.answers}
                selected = {isSelected}
                showAnswer = {showAnswers}
                correct = {question.correct_answer}
                mode= {mode}
            />
        )
    })

    // Logic for rendering buttonElement
    const show = () => { 
        let res = true
        if(formData.number === "") {
            res = false 
        }
           return res
    }

    // Function for mode change
    function changeMode() {
        if(theme === "" || theme === null) {
            theme = "dark" 
        } else {
            theme = ""
        }
        setMode(theme)
        localStorage.setItem("mode", theme)
    }
    console.log(mode)

    // Logic for switching body color during mode change
    if(mode) {
        document.body.style.backgroundColor = "black";
    } else {
        document.body.style.backgroundColor = "#F5F7FB";
    }
   
    return (
        <main className={mode ? "darkmode" : ""}>
            {start ? 
                <Home start= {startQuiz} toggle= {changeMode} mode= {mode}/>
                :
                <>
                {perfect &&
                    <div className = "congrats container">
                        <h1 className = "perfect">CONGRATULATIONS!</h1>
                        <h3 >You had perfect score!</h3>
                    </div>
                }
                {perfect && <Confetti height = {window.outerHeight}/>}
                {customDisplay}
                {questions}
                {!show() ? <div  className={`placeholder ${mode}`}><h2>Please<br/>choose your quiz type</h2></div> : buttonElement}
                </>
            }  
            <img src= "../images/blob-yellow.png" className= "yellow" alt= "blob.png"/>
            <img src= "../images/blob-blue.png" className= "blue" alt= "blob.png"/>
        </main>
    )
}
