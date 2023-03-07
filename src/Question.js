import React from "react"
import he from "he"

export default function Question(props) {

    let mode = props.mode ? "darkmode" : "";

    const answerElements = props.answers.map(opt => {

        // Highlight selected options
        let styles;
        if (!props.mode) {
            styles = {
                backgroundColor: `${!opt.isHeld ? "#F5F7FB" : "#D6DBF5"}`,
                border: "1px solid #4D5B9E"
            }
        } else {
            styles = {
                backgroundColor: `${!opt.isHeld ? "" : "#4D5B9E"}`,
                color: "#F5F7FB"
            }
        }

        // Logic to highlight right/wrong answers
        if (props.showAnswer && !props.mode) {
            if (opt.isHeld && opt.value === props.correct) {
                styles = { backgroundColor: "#94D7A2", border: "none" }
            }
            else if (opt.isHeld && opt.value !== props.correct) {
                styles = { backgroundColor: "#F8BCBC", border: "none" }
            }
            else if (opt.value === props.correct) {
                styles = { backgroundColor: "#94D7A2", border: "none" }
            }
        }
        else
            if (props.showAnswer && props.mode) {
                if (opt.isHeld && opt.value === props.correct) {
                    styles = { backgroundColor: "#59dd76", border: "none" }
                }
                else if (opt.isHeld && opt.value !== props.correct) {
                    styles = { backgroundColor: "#e92121", border: "none" }
                }
                else if (opt.value === props.correct) {
                    styles = { backgroundColor: "#59dd76", border: "none" }
                }
            }

        return (
            <button key={opt.id}
                onClick={() => props.selected(opt.id, props.id)}
                className={`options btn ${mode}`}
                style={styles}
            >
                {he.decode(opt.value)}
            </button>
        )
    })
    return (
        <div className="main-container">
            <h3 key={props.id}>{he.decode(props.questions)}</h3>
            <div className="option-case">
                {answerElements}
            </div>
            <hr />
        </div>
    )
}