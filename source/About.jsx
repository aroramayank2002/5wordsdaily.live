import React from 'react';

export class About extends React.Component {
  render(){
    return (
        <div>
            <br/>
            <h5>This application is to help language learners to save translations daily when learning Swedish.</h5>
            <br/><br/>
            <h4>Developer</h4>
            Mayank Arora            
            <br/>
            {/* <a href="http://www.linkedin.com/in/mayankarora1306" target="_blank">Linked in</a>              
            <br/>
            <a href="https://www.facebook.com/mayank.arora.77377692" target="_blank">Facebook</a>
            <br /> */}
            Feedback or feature request <a href="mailto:aroramayank2002@gmail.com?Subject=Feedback%20on%205%20words%20daily" target="_top">here</a>
        </div>
    )
  }
}
