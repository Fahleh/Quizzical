# Quizzical
 This is a web application for a trivia game that tests users' knowledge across a variety of subjects. 
 
 ## INTRODUCTION
 This is the final solo project of the __*Scrimba: Learn React*__ course. 
 This project was built using my knowledge of HTML, CSS, JavaScript and React Js.
 
 #### FEATURES
 * Home - Introduces you to the app and lets you switch between a light & dark mode.
 * Questions -  Affords you the opportunity to customize your question choices with category, difficulty and number options. 
 Each question comes with its list of options from which you can select one.
 * Scoring - After answer selections, users can click the __*Check Answers*__ button to see their performance. This highlights
 the selected answers marked as either correct or incorrect through a colour coded system. In the case of incorrect asnswers, the
 correct options are equally highlighted.
 
 
 ## IMPLEMENTATION
 * Hooks:
    - useState(): The useState hook was used to store and update the states of a number of objects. 
    - useEffect(): I used the useEffect hook for data fetching from the API into state & handle other side effects including 
 the IsLoading state.
 * Dependencies - I employed the use of several dependencies such as *He* library for decoding HTML entities, *nanoid* for the 
 creation of unique IDs when rendering questions, and *Confetti* for the celebratory display in the case of users achieving a 
 perfect score.
 * Conditional Rendering - I implemented conditionl rendering for the display of certain objects such as the home, question & loading screens, 
 Check Answers & lay Again buttons, e.t.c.
 
 ## KNOWN BUGS
 * Able to submit without selecting any questions. - Fixed (Still possible but I added a modal screen with a warning).
 * Able to select answers after submission. - Fixed.
 * Loss of color mode when app is powered off. - Fixed.
 
 
