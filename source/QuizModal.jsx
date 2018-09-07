import React from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root')

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
  
  export class QuizModal extends React.Component {
    constructor(props) {
      super();
  
      this.state = {
        modalIsOpen: false,
        words: props.words,
      };
      
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
    }
  
    openModal() {
      this.setState({modalIsOpen: true});
    }
  
    closeModal() {
      this.setState({modalIsOpen: false, deleted: "Delete"});
      this.props.closeModal();
    }
  
    getWords(){
      let words = this.props.words;  
      let content=[];
      let keys=0;
      for(let i=0;i<words.length; i++){
        content.push( <div key={keys++}>
            <div><b>{words[i].word}</b>: {words[i].meaning} <span class={words[i].class}></span></div>
          </div>);
      }
      return content;
    }
  
    render() {
      // console.log(`Should open ${this.props.open} ${this.state.modalIsOpen}`)
      // console.log(`Should open ${JSON.stringify(this.props)}`)
      if(this.props.words){
        return (
          <div>
            <Modal
              isOpen={this.props.open}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Words"
            >
              {this.getWords()}
              <br/>
              <button className="btn btn-primary" 
                                onClick={this.closeModal}>Close</button>
            </Modal>
          </div>
        );
      }else{
        return (<div></div>);
      }
      
    }
  }