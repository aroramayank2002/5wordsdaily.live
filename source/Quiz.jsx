import React from 'react';
const axios = require('axios');
// import { WordModal } from './WordModal.jsx';

const instance = axios.create();
instance.defaults.timeout = 4000;

const Heading = (props) => {
  return (
    <div className="text-center">
      <h4>Are you good !</h4>
    </div>);

}

let wordClass = {
  // margin: "2em",
  // padding: "2em",
};
let tdRadio = {
  textAlign: "right",
  padding: "0em",
  paddingRight: ".5em",
  // marginTop: "1em" doesn't change anything
};

let tdClass = {
  // This causes the allignment of text on the questions
  maxWidth: "3em",
  textAlign: "left",
  padding: "0em",
};


export class Questions extends React.Component {
  state = {
    sessionId: this.props.sessionId,
    marked: true,
    submitClass: ""
    
  }

  spinnerClass = "fa fa-cog fa-spin";

  handleClick = (event) => {
    console.log("Sessin id: " + this.props.sessionId);
    event.preventDefault();
    let self = this;

    console.log(`Clicked ${event.target.name}`);
    if (event.target.name === 'submitQuiz') {
      console.log(`submitClass`);
      self.setState({ submitClass: this.spinnerClass });
      instance.post('/api/submitQuiz', {
        sessionId: this.props.sessionId,
        result: { 23: "correct", 21: "incorrect", 24: "correct", 32: "incorrect", "43": "correct" }
      })
        .then(function (response) {
          console.log(response);
          self.setState({submitClass: "" })

        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          self.setState({ submitClass: "" });
        });
    } else {
      console.log(`No event for click on this target: ` + event.target.name);
    }
  }

  shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  getFormattedData = (questions) => {
    console.log(JSON.stringify(questions));
    let content = [];
    for (let i = 0; i < questions.length; i++) {
      let question = [];

      question.push(<tr key={questions[i].id}><th style={tdRadio}>{i+1}. </th><th style={tdClass}><span>{questions[i].word}</span></th></tr>);
      let options = questions[i].optional_meanings.split(":");
      options.push(questions[i].meaning);
      this.shuffleArray(options);

      for (let j = 0; j < options.length; j++) {
        let optionId = "word" + i + "-" + j;
        question.push(
          <tr key={optionId} >
            <td style={tdRadio}><input type="radio" id={optionId} name={questions[i].word} /></td>
            <td style={tdClass}><label for={optionId}>{options[j]}</label></td>
          </tr>
        );
      }

      content.push(question);
    }

    return (
      <div>
        <table className="table table-sm"><tbody>{content}</tbody></table>
        <button className="btn btn-primary"
                        name="submitQuiz"
                        disabled={!(this.state.marked)}
                        onClick={this.handleClick}>Submit<i class={this.state.submitClass}></i></button>
        <br/><br/>
      </div>
    );
  }

  render() {
    return (
      <div>
        <form>
          {this.getFormattedData(this.props.questions)}
        </form>
      </div>
    );
  }
}

export class Quiz extends React.Component {
  state = {
    data: null
  }

  componentWillMount() {
    let self = this;
    axios.get('/api/quiz', {
      params: {
        sessionId: self.props.sessionId
      }
    })
      .then(function (response) {
        console.log(response);
        //   console.log(response.data.result);
        self.setState({ data: response.data.result.data });
        //   self.createTableRows();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    if (this.state.data) {
      return (
        <div class="container">
          <Heading />
          {/* <div>Content</div> */}
          <br/>
          <Questions sessionId={this.props.sessionId} questions={this.state.data} />
        </div>
      )
    } else {
      return (
        <div class="container">
          <Heading />
          <div>Fetching</div>
        </div>
      )
    }
  }
}