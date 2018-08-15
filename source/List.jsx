import React from 'react';
const axios = require('axios');
import { WordModal } from './WordModal.jsx';
const styles = require('./util/styles.js');

const Heading = (props) => {
  return (
  <div className="text-center">
      <h4>You are a champ!</h4>
  </div>);
}

export class Word extends React.Component {
  state = {
    word : this.props.word,
    style: styles.spanStyle
  }

  handleClick = (e) => {
    // console.log(`handle click: ${e.target.id} for ${this.props.word}`);
    let self = this;
    this.setState({style:styles.spanStyleClicked});
    axios.post('/api/wordMeaning', {
      sessionId: this.props.sessionId,
      wordId: this.props.id
    })
    .then(function (response) {
      // console.log(response);
      // console.log(response.data.result.meaning);
      if(response.data.result.meaning){
        let mmg = [];
        if(response.data.result.meaning && response.data.result.meaning.length>0){
            response.data.result.meaning.forEach(function(element) {
                mmg.push(element.meaning);
              });
        }else{
            console.log(`Meaning not found.`)
        }
        // console.log(`Meaning ${mmg}`)
        // self.setState({meaning: mmg.join()})
        // alert(`${mmg.join()}`);
        
        self.props.showModal({id: self.props.id, word:self.props.word, meaning:mmg.join()})
      }else{
        console.log("No meaning found")
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(()=>{
      // self.setState({style:styles.spanStyle});
    });
  }

  render() {
    // console.log(`this.props.modalState ${this.props.modalState}`)
    return(
        <span style={(this.props.modalState === false)?styles.spanStyle:this.state.style} id={"word"} key={this.props.id} onClick={this.handleClick}>{this.props.word}</span>
        
    )
  }
}

export class List extends React.Component {
  state = {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    words: null,
    wordClicked: null,
    openModal: false
  }

  componentWillMount() {
    // console.log(`List sessionId: ${this.props.sessionId}`);
    let self = this;
    axios.post('/api/allWords', {
      sessionId: this.props.sessionId
    })
    .then(function (response) {
      console.log(response);
      console.log(response.data.result.words);
      if(response.data.result.words){
        self.setState({words: response.data.result.words});
      }else{
        console.log("No words found")
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handldClick = (event) =>{
    if(event.target.name === "current"){
      this.setState(prevState => {
        return {month: new Date().getMonth(), year: new Date().getFullYear()};
      });
    }
  }

  showModal = (attr) => {
    // console.log(`wordClicked: ${JSON.stringify(attr)}`);
    this.setState({wordClicked: attr, openModal:true});
  }

  closeModal = () => {
    // console.log(`close modal called`);
    this.setState({openModal : false});
  }

  onDelete = () => {
    //Rerender
    this.componentWillMount();
  }

  render(){
    if(this.state.words){
      return (
        <div class="container">
            <Heading />
            <div class="container-fluid">
            {this.state.words.map(word => <Word key={word.id} {...word} showModal={this.showModal} modalState={this.state.openModal}/>)}
            <WordModal word={this.state.wordClicked} open={this.state.openModal} closeModal={this.closeModal} sessionId={this.props.sessionId}
            onDelete={this.onDelete}/>
            {/* <WordModal/> */}
            </div>
        </div>
        )
    }else{
      return (
        <div class="container">
            <Heading />
        </div>
        )
    }
      
  }
}
