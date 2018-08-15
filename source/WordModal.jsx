import React from 'react';
// import ReactDOM from 'react-dom';
import Modal from 'react-modal';
const axios = require('axios');
const instance = axios.create();
instance.defaults.timeout = 4000;

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    textAlign             : "center"
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root')

export class WordModal extends React.Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      word: "Flicka",
      deleteClass: "",
      deleted: "Delete"
    };
    this.spinnerClass =  "fa fa-cog fa-spin";

    this.openModal = this.openModal.bind(this);
    // this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false, deleted: "Delete"});
    this.props.closeModal();
  }

  handleClick = (event) => {
    console.log(`Clicked: ${event.target.name}`);
    let self = this;
    self.setState({deleteClass:this.spinnerClass});
    instance.post('/api/delete', {
      sessionId: this.props.sessionId,
      wordId: this.props.word.id,
    })
    .then(function (response) {
      console.log(response);    
      if(response.data.result.deleted){
        console.log(`Deleted, word: ${self.props.word.id}`);
        self.setState({deleted: "Deleted", deleteClass:""});
        self.props.onDelete();
      }  
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function(){
      self.setState({deleteClass:""});
    });
  }

  render() {
    // console.log(`Should open ${this.props.open} ${this.state.modalIsOpen}`)
    // console.log(`Should open ${JSON.stringify(this.props)}`)
    if(this.props.word){
      return (
        <div>
          <Modal
            isOpen={this.props.open}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Word"
          >
            <button className="btn btn-danger" 
              name="delete"
              // disabled={!this.state.word}
              onClick={this.handleClick} disabled={this.state.deleted==="Deleted"?true:false} >
              {this.state.deleted} <i class={this.state.deleteClass}></i>
              </button>
            <br /><br />
            <h3>{this.props.word.word}</h3>
            <div>{this.props.word.meaning}</div>
            <br/><br/>
            <button className="btn btn-primary" 
                              // disabled={!this.state.word}
                              onClick={this.closeModal}>Close</button>
          </Modal>
        </div>
      );
    }else{
      return (<div></div>);
    }
    
  }
}

// ReactDOM.render(<App />, document.getElementById('root'));