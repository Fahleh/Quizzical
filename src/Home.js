import React from "react"

export default function Home(props) {
    
    return (
        <div className= "container">
            <h1 className= "home-title">Quizzical</h1>
            <p  className= "home-desc">A fun way that tests your knowledge</p>
            <button className= {`home-btn ${props.mode}`} onClick= {props.start}>Start quiz</button>
            <div >
                <img src= {props.mode ?  "sun.png" : "moon.png"} alt="icon.png" 
                    className={`mode-btn ${props.mode}`}
                    onClick={props.toggle}
                />
            </div>
        </div> 
    )
}