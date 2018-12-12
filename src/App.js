import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import classnames from 'classnames';
import Sound from 'react-sound';
import soundfile from './sound/271984__ajexk__beheading-sfx.mp3';
import soundfileYay from './sound/239594__xtrgamr__unimpressedyay-01.wav';


const bodyParts= ['head','neck','corpus', 'right-arm', 'left-arm', 'right-hand', 'left-hand', 'right-leg', 'left-leg', 'right-foot', 'left-foot'];

class Game extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
           wordToGuess : '',
           currentWord : ' ',
           key: '',
           badTries: 0,
           badLetters : []
       }
   }

    componentDidMount() {

        window.addEventListener('keypress', this.checkLetter);

        axios.get('https://polishwordsapi.herokuapp.com/words')
            .then((res) => {
                this.setState({
                    wordToGuess: res.data.randomWord,
                    currentWord : res.data.randomWord.split('').map(i => ' ').join('')
                })
            })
        }


    checkLetter = (e) => {

       const letter = e.key

        if(this.state.wordToGuess.includes(letter) || letter === ' ') {
            for(let i = 0; i < this.state.wordToGuess.length; i++) {

                if(this.state.wordToGuess[i] === letter) {
                    this.setState({
                        currentWord : this.state.currentWord.substring(0, i) + letter + this.state.currentWord.substring(i + 1)
                    })
                }
            }
        } else {
            console.log(letter);
            this.setState({
                badTries: this.state.badTries + 1,
                badLetters : [...this.state.badLetters, letter]
            })
        }
    }

    render(){


       if(this.state.badTries > 12) {
           window.removeEventListener('keypress', this.checkLetter)
       }

        let bodyDivs = bodyParts.map((e,i) => {
            return <div key={i} className={e}
                        style={{
                            visibility: (this.state.badTries > i)
                                ? 'visible'
                            :'hidden'}}
                    ></div>
        })

        let goodDivs = this.state.currentWord.split('').map((e,i)=>{
            return <div key={i}>{e}</div>
        })


        const gameOverClasses = classnames(
            'game-over',
            {
                active: this.state.badTries > 12
            }
        );


        return (
            <>
                <div className='container'>
                    <div className="hangman-container">
                        <div className='hangman'>
                            {bodyDivs}
                            <div className='bar'></div>
                        </div>
                        <div className='bad-letters'>
                            <p>YOU MISSED:</p>
                            {this.state.badLetters}</div>
                    </div>
                    <div className='square-container'>
                        <div className='good-letters'>{goodDivs}</div>
                        <div className="squares">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                </div>

                <div className={gameOverClasses}
                     style={{
                         display: (this.state.badTries> 12)
                             ? 'flex'
                             : 'none'
                     }}>
                    <span className='game-over-text'>GAME OVER</span>
                        <p>sorry, the word was...
                            {this.state.wordToGuess}</p>
                    <button onClick={this.newGame}>NEW GAME</button>
                </div>
                <div className='game-won'
                     style={{
                         display: (this.state.currentWord=== this.state.wordToGuess)
                             ? 'flex'
                             : 'none'
                     }}>
                    <span className='game-won-text'>YOU WON!</span>
                    <p>PLAY AGAIN!</p>
                    <button onClick={this.newGame}>NEW GAME</button>
                </div>
                <Sound
                    url={soundfile}
                    playStatus={this.state.badTries > 12 && Sound.status.PLAYING}
                />
                <Sound
                    url={soundfileYay}
                    playStatus={(this.state.currentWord=== this.state.wordToGuess) && Sound.status.PLAYING}
                />
            </>
        )
    }

    newGame(){
       window.location.reload()
    }
}

class App extends Component {

        render() {
            return (
                <div
                    className="App"
                >
                    <Game/>
                </div>
            );
        }

}

export default App;
