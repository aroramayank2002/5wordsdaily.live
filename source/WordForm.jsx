import React from 'react';
const axios = require('axios');
const styles = require('./util/styles.js');
const restUtil = require('./util/restUtil.js');
import { CalendarModal } from './CalandarModal.jsx';

const instance = axios.create();
instance.defaults.timeout = 4000;

let inputText = {
    margin: "0 auto",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: ".5em",
    marginBottom: ".5em",
    maxWidth: "20em"
};

let divStyle = {
    margin: "0 auto",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "20em"
};

const Heading = (props) => {
    return (
        <div className="text-center">
            <h4>Add word</h4>
        </div>
    );
};

const spanStyle = {
    padding: ".3em",
    borderColor: "#aaa",
    borderRadius: '.2em'
};

const divBorder = {
    display: "inline-block",
    backgroundColor: "#ddd",
    borderRadius: '.3em',
    margin: ".1em"
};

const inputStyle = {
    padding: ".3em",
    border: "thin solid #ddd",
    borderRadius: '.5em',
    margin: ".5em",
    fontSize: "1em",
};

export class Suggest extends React.Component {
    state = {
        options: null,
    }

    render() {
        if (this.props.options) {
            return (
                <div>
                    {this.props.options}
                </div>
            )
        } else {
            return (
                <div />
            );
        }
    }
}


export class WordForm extends React.Component {
    state = {
        word: "",
        meaning: "",
        wordsToday: "",
        translationClass: "",
        savingClass: "",
        options: null,
        openModal: false,
        style: styles.spanStyle
    }
    spinnerClass = "fa fa-cog fa-spin";

    handleClick = (event) => {
        console.log("Sessin id: " + this.props.sessionId);
        event.preventDefault();
        let self = this;

        console.log(`Clicked ${event.target.name || event.target.id}`);
        if (event.target.name === 'getTranslation') {
            console.log(`getTr`);
            self.setState({ translationClass: this.spinnerClass });
            instance.post('/api/translate', {
                sessionId: this.props.sessionId,
                word: this.state.word.trim(),
            })
                .then(function (response) {
                    console.log(response);
                    let mmg = [];
                    if (response.data.result.meaning && response.data.result.meaning.length > 0) {
                        response.data.result.meaning.forEach(function (element) {
                            mmg.push(element.meaning);
                        });
                    } else {
                        console.log(`Meaning not found.`)
                    }
                    // console.log(`Meaning ${mmg}`)
                    self.setState({ meaning: mmg.join(), translationClass: "" })

                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                    self.setState({ translationClass: "" });
                });
        } else if (event.target.name === 'saveTranslation') {
            console.log(`save`);
            self.setState({ savingClass: this.spinnerClass });
            instance.put('/api/meaning', {
                sessionId: this.props.sessionId,
                word: this.state.word,
                meaning: this.state.meaning,
            })
                .then(function (response) {
                    // console.log(response);
                    console.log(`Words today: ${response.data.result.totalWordsToday}`);
                    self.setState({ wordsToday: response.data.result.totalWordsToday, savingClass: "", word: "", meaning: "" });
                })
                .catch(function (error) {
                    console.log(error);
                })
                .finally(function () {
                    self.setState({ savingClass: "" });
                });
        } else if (event.target.id === 'showWords') {
            const date = new Date();
            date.setDate(date.getDate() - 1);
            this.getWordsForDate(date.toISOString());
            this.setState({ style: styles.spanStyleClicked });
        }
        else {
            console.log(`No event for click on this target, name: '${event.target.name}' id: '${event.target.id}'`);
        }

    };

    fetchSuggessions(key) {
        // console.log(`fetchSuggessions ${key}`)
        let self = this;
        instance.get('/api/suggest', {
            params: {
                word: key
            }
        })
            .then(function (response) {
                // console.log(response);
                console.log(response.data.result);
                let id = 0;
                const listItems = response.data.result.data.map((option) =>
                    // Wrong! The key should have been specified here:
                    //   <span key={id++} id={option} onClick={self.props.suggest}>{option}</span>
                    <div style={divBorder} key={id++}>
                        <span style={spanStyle} id={option.word} onClick={self.suggest}>{option.word}</span>
                    </div>
                );
                self.setState({ options: listItems })
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    handleChange = (e) => {
        // console.log("Text:"+ e.target.value);
        // console.log("Text:"+ e.target.name);
        let val = e.target.value.trim();
        (e.target.name == "word") ? this.setState(prevState => {
            if (val.length >= 3) {
                if (prevState.word != val) {
                    this.fetchSuggessions(val);
                    return { word: val }
                }
                return { word: val };
            } else {
                return { word: val };
            }

        }) : "";
        (e.target.name == "meaning") ? this.setState({ meaning: e.target.value }) : "";
    }

    suggest = (event) => {
        // console.log(`span clicked: ${event.target} ${event.target.id}`);
        this.setState({ word: event.target.id, options: null });
    };

    getWordsForDate = (selectedDate) => {
        // console.log(`selectedDate: ${selectedDate}`)
        let self = this;
        restUtil.getWordsForDate(this.props.sessionId, selectedDate)
            .then(function (words) {
                // console.log(words);
                // console.log(words);
                self.setState({ words: words, openModal: true });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    closeModal = () => {
        this.setState({ openModal: false, style: styles.spanStyle });
      }

    render() {
        return (
            <div class="container">
                <Heading />
                <form>
                    <input style={inputStyle} type="text" name="word" placeholder="Word to be translated" value={this.state.word} onChange={this.handleChange} />
                    <button
                        className="btn btn-primary"
                        name="getTranslation"
                        disabled={!this.state.word}
                        onClick={this.handleClick}>Translate <i class={this.state.translationClass}></i></button>
                    <br />
                    <Suggest suggest={this.suggest} options={this.state.options} />
                    <textarea class="form-control form-rounded" style={inputText} type="text" name="meaning" placeholder="Meaning" value={this.state.meaning} onChange={this.handleChange} />
                    <button className="btn btn-primary"
                        name="saveTranslation"
                        disabled={!(this.state.word && this.state.meaning)}
                        onClick={this.handleClick}>Save<i class={this.state.savingClass}></i></button>

                    <div>
                        <span style={this.state.style} id="showWords" 
                            onClick={this.handleClick} 
                            // showModal={this.showModal} 
                            // modalState={this.state.openModal}
                            >
                                {this.state.wordsToday ? this.state.wordsToday + " words today" : ""}
                        </span>
                    </div>
                    
                </form>
                <CalendarModal words={this.state.words} open={this.state.openModal} closeModal={this.closeModal} sessionId={this.props.sessionId} />
            </div>
        );
    }
}
