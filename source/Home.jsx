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
    padding: ".3em",
    margin: ".2em",
    marginLeft: "4em",
    color: "blue"
}

const info = {
    textAlign: "left",
    padding: "1em"
}

export class Home extends React.Component {

    render() {
        return (
            <div>

                <Heading />
                <table style={tableAlignment}>
                    <thead>
                        <tr><td colSpan="2" style={info}>A small application to save new swedish words daily</td></tr></thead>
                    <tbody>
                        <tr><td><div style={iStyle}><i class="fa fa-plus-square" /></div></td>
                            <td style={textAlign}>Add a word</td>
                        </tr>
                        <tr><td><div style={iStyle}><i class="fa fa-list" /></div></td>
                            <td style={textAlign}>View saved words</td>
                        </tr>
                        <tr><td><div style={iStyle}><i class="fa fa-calendar-o" /></div></td>
                            <td style={textAlign}>Monthly statistics</td>
                        </tr>
                        <tr><td><div style={iStyle}><i class="fa fa-heart" /></div></td>
                            <td style={textAlign}>Do a quiz and improve</td>
                        </tr>
                        <tr><td><div style={iStyle}><i class="fa fa-cog" /></div></td>
                            <td style={textAlign}>About and feature requests</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
