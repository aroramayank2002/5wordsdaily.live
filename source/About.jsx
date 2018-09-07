import React from 'react';

var imgStyle = {
  listStyleType: "none",
  margin: "0",
  padding: "0",
  marginTop: ".5em",
  width: "7em",
  height: "7em",
  border: ".1em solid gray",
  borderRadius: "1em",
  // borderStyle: "outset"
}

export class About extends React.Component {
  render(){
    return (
        <div>
            <br/>
            <h5>This application is to help language learners to save translations daily when learning Swedish.</h5>
            <br/>
            <h4>Developer</h4>
                       
            {/* <br/> */}
            {/* <a href="http://www.linkedin.com/in/mayankarora1306" target="_blank">Linked in</a>              
            <br/>
            <a href="https://www.facebook.com/mayank.arora.77377692" target="_blank">Facebook</a>
            <br /> */}
            <img style={imgStyle} src="https://avatars1.githubusercontent.com/u/213698?v=4"/> Mayank Arora <br/><br/>
            Project on  <a href="https://github.com/aroramayank2002/5wordsdaily.live">Github</a><br />
            
            Feedback or feature request <a href="mailto:aroramayank2002@gmail.com?Subject=Feedback%20on%205%20words%20daily" target="_top">here</a>
        </div>
    )
  }
}
