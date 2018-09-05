import React from 'react';

const Heading = (props) => {
    return (
        <div className="text-center">
            <h4>Let's learn some words!</h4>
        </div>);
}

const tableAlignment = {
    // border: "1px solid red",
    marginLeft: "auto",
    marginRight: "auto",
}

const textAlign = {
    textAlign: "left",
    paddingLeft: "1em",
}

const iStyle = {
    border: ".06em solid black",
    borderRadius: ".4em",
    padding: ".5em",
    paddingLeft: "1em",
    paddingRight: "1em",
    margin: ".2em",
    marginLeft: "4em",
    color: "blue"
}

const info = {
    textAlign: "left",
    padding: "1em"
}

export class Home extends React.Component {

    handleClick = (event) => {
        event.preventDefault();
        console.log(`Home.jsx ${event.target.id}`);
        // plus, list, calendar, heart, cog
        this.props.navigateTo(event.target.id);
      }
    
    render() {
        return (
            <div>

                <Heading />
                <table style={tableAlignment}>
                    <thead>
                        <tr><td colSpan="2" style={info}>A small application to save new swedish words daily</td></tr></thead>
                    <tbody>
                        <tr><td>
                                <button onClick={this.handleClick} id="plus" class="fa fa-plus-square" style={iStyle}/>
                            </td>
                            <td style={textAlign}>Add a word</td>
                        </tr>
                        <tr><td>
                            <button onClick={this.handleClick} id="list" class="fa fa-list" style={iStyle}/>
                            {/* <div style={iStyle}><i class="fa fa-list" /></div> */}
                            </td>
                            <td style={textAlign}>View saved words</td>
                        </tr>
                        <tr><td>
                            <button onClick={this.handleClick} id="calendar" class="fa fa-calendar-o" style={iStyle}/>
                            {/* <div style={iStyle}><i class="fa fa-calendar-o" /></div> */}
                            </td>
                            <td style={textAlign}>Monthly statistics</td>
                        </tr>
                        <tr><td>
                            <button onClick={this.handleClick} id="heart" class="fa fa-heart" style={iStyle}/>
                            {/* <div style={iStyle}><i class="fa fa-heart" /></div> */}
                            </td>
                            <td style={textAlign}>Do a quiz and improve</td>
                        </tr>
                        <tr><td>
                            <button onClick={this.handleClick} id="cog" class="fa fa-cog" style={iStyle}/>
                            {/* <div style={iStyle}><i class="fa fa-cog" /></div> */}
                        </td>
                            <td style={textAlign}>About and feature requests</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
