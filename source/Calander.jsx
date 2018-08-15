import React from 'react';
import calendar from 'node-calendar';
const axios = require('axios');
import { CalendarModal } from './CalandarModal.jsx';
const restUtil = require('./util/restUtil.js');

const navStyle = {
  listStyleType: "none",
  margin: "0",
  padding: "0",
};

const listStyle = {
  display: "inline",
  margin: "1em",
  padding: ".1em"
};

const spanStyle = {
  display: "inline-block",
  marginBottom: ".5em",
  paddingLeft: ".5em",
  paddingRight: ".5em",
  textAlign: "center",
  backgroundColor: "#fff",
  borderRadius: '50%',
};

const spanStyleEmpty = {
  display: "inline-block",
  marginBottom: ".5em",
  paddingLeft: ".5em",
  paddingRight: ".5em",
  textAlign: "center",
  backgroundColor: "#fff",
  borderRadius: '50%',
};

const cellStyle = {
  padding: "1px",
  backgroundColor: "#ccc",
};

const dayStyle = {
  margin: "0em",
  padding: "0em",
  width: '100%',
  height: '100%',
  border: '0px',
  borderRadius: '3px',
  backgroundColor: "#ccc"
};

const marginRight = {
  marginRight: ".5em",
};

const monthLabel = {
  backgroundColor: "#fff",
};

const Heading = (props) => {
  return (
    <div className="text-center">
      <h4>Monthly view</h4>
    </div>);
};

class Data extends React.Component {
  constructor(props) {
    super();
    this.getWordsForDate = this.getWordsForDate.bind(this);
    this.createTableRows = this.createTableRows.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      data: null,
      month: props.month,
      rows: null,
      fetching: false,
      onLoad: false,
      words: null,
      openModal: false,
      translationClass:""
    }

    this.spinnerClass = "fa fa-cog fa-spin";
  }


  handleClick(event) {
    // event.preventDefault();
    //Will use id for span element click as name not visible
    // console.log(`Event name: ${event.target} ${event.target.tagName} ${event.target.id}`);
    if (event.target.tagName === 'SPAN') {
      // console.log(`Date from span: parent: ${event.target.parentElement}, id: ${event.target.parentElement.id}`);
      // console.log(`Get words for date:  ${event.target.parentElement.id}`);
      this.getWordsForDate(event.target.parentElement.id);
      // console.log(this);
    } else if (event.target.tagName === 'BUTTON') {
      // console.log(`Date from button: child-count: ${event.target.childNodes.length}, date: ${event.target.id}` );
      if (3 === event.target.childNodes.length && event.target.childNodes[2].textContent != "") {
        // console.log(`${event.target.childNodes[0].textContent}, ${event.target.childNodes[1].textContent}, ${event.target.childNodes[2].textContent}` );
        // console.log(`Get words for date:  ${event.target.id}`);
        this.setState({ translationClass: this.spinnerClass });
        this.getWordsForDate(event.target.id);
      } else {
        console.log(`This date has no saved words`);
      }
    } else {
      console.log(`Event to be handled ${event.target}`)
    }
  }

  getWordsForDate = (selectedDate) => {
    console.log(`selectedDate: ${selectedDate}`)
    let self = this;
    restUtil.getWordsForDate(this.props.sessionId, selectedDate)
      .then(function (words) {
        // console.log(words);
        console.log(words);
        self.setState({ words: words, openModal: true, translationClass: "" });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getCountForDate(date) {
    // let count = 0;
    let data = this.state.data;
    for (let i = 0; i < data.length; i++) {
      // console.log(`comparing ${new Date(date).getDate()} ${new Date(data[i].date).getDate()}`);
      if (new Date(date).getDate() === new Date(data[i].date).getDate()
        && new Date(date).getMonth() === new Date(data[i].date).getMonth()
        && new Date(date).getYear() === new Date(data[i].date).getYear()) {
        console.log(`Matched`);
        return data[i].count;
      }
    }
    return 0;
  }

  createTableRows() {
    let d = new Date(this.props.year, this.props.month, 1);
    let arr1 = new calendar.Calendar(0).itermonthdates(d.getFullYear(), this.props.month + 1);
    let value = [];
    let row = [];
    let head = [];

    let arr2 = calendar.day_name
    for (let i = 0; i < arr2.length; i++) {
      value.push(<th key={i}>{arr2[i].substring(0, 3)} </th>);
    }
    row.push(<tr key={10}>{value}</tr>);
    value = [];

    for (let i = 0; i < arr1.length; i++) {
      // console.log(`${new Date(arr1[i])}${new Date()} ${new Date(arr1[i]).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)}`);
      // Highlight current date
      let cl = (new Date(arr1[i]).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) ? "bg-success" : "";
      let date = new Date(arr1[i]);
      let randomValue = Math.floor(Math.random() * Math.floor(6));
      let count = this.getCountForDate(date);
      value.push(
        <td style={cellStyle}
          key={i} onClick={this.handleClick}>
          <i class={this.state.translationClass}></i>
          <button style={dayStyle} className={cl} id={date.toISOString()} >
            {date.getDate()}<br />
            {(0 != count) ? <span id={date.toISOString()} style={spanStyle}>{count}</span> : ""}
          </button>

        </td>);
      if (i % 7 == 6) {
        row.push(<tr key={i}>{value}</tr>);
        value = [];
      }
    }
    this.setState({ rows: row });
  }

  reloadData(month, year) {
    this.setState({ rows: null, fetching: true, onLoad: true });
    console.log(`reloadData : month, year: ${month} ${year}`)
    // console.log(`List month details: ${this.props.sessionId} ${this.props.month} ${this.props.year}`);

    let self = this;
    axios.post('/api/monthlyWords', {
      sessionId: this.props.sessionId,
      month: month,
      year: year,
    })
      .then(function (response) {
        // console.log(response);
        console.log(response.data.result);
        self.setState({ data: response.data.result.data });
        self.createTableRows();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  closeModal = () => {
    this.setState({ openModal: false });
  }

  render() {
    // console.log(`render in child, props.month ${this.props.month} ${this.props.year}`);

    if (this.state.rows) {
      return (<div>
        <i class={this.state.translationClass}></i>
        <table className="table table-sm table-bordered"><tbody>{this.state.rows}</tbody></table>
        <CalendarModal words={this.state.words} open={this.state.openModal} closeModal={this.closeModal} sessionId={this.props.sessionId} />
      </div>);
    }
    if (this.props.month && !this.state.fetching) {
      if (!this.state.onLoad) {
        this.reloadData(this.props.month, this.props.year)
      }
      return ("");
    } else {
      return (<div>Loading...</div>);
    }

  }
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export class Calanader extends React.Component {
  state = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  }

  handldClick = (event) => {
    event.preventDefault();
    // console.log(`Event Name: ${event.target.name}`);
    if (event.target.name === "previous") {
      this.setState(prevState => {
        let nextMonth = prevState.month;
        let nextYear = prevState.year;
        if (nextMonth - 1 === -1) {
          nextMonth = 11;
          nextYear = nextYear - 1;
        } else {
          nextMonth = nextMonth - 1;
        }
        // console.log(`PrevMonth: ${prevState.month}, Next: ${nextMonth}`)
        this.refs.data.reloadData(nextMonth, nextYear);
        return { month: nextMonth, year: nextYear };
      });
    }

    if (event.target.name === "next") {

      this.setState(prevState => {
        let nextMonth = prevState.month;
        let nextYear = prevState.year;
        if (nextMonth + 1 === 12) {
          nextMonth = 0;
          nextYear = nextYear + 1;
        } else {
          nextMonth = nextMonth + 1;
        }
        this.refs.data.reloadData(nextMonth, nextYear);
        return { month: nextMonth, year: nextYear };
      });
    }

    if (event.target.name === "current") {
      this.setState(prevState => {
        this.refs.data.reloadData(new Date().getMonth(), new Date().getFullYear());
        return { month: new Date().getMonth(), year: new Date().getFullYear() };
      });
    }

    // console.log(`Parent (Month, Year): ${this.state.month} ${this.state.year}`)
    // this.refs.data.reloadData(this.state.month, this.state.year);
  }

  render() {
    // console.log(`Parent month: ${this.state.month}`)
    return (
      <div class="container">
        <Heading />
        <span>{this.state.year} {monthNames[this.state.month]}</span>
        <nav>
          <ul style={navStyle}>
            <li style={listStyle}><a href="#" name="previous" onClick={this.handldClick}>Previous
                    {/* <span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span> */}
            </a></li>
            <li style={listStyle}><a href="#" style={marginRight} name="current" onClick={this.handldClick}>
              Current
                  </a></li>
            <li style={listStyle}><a href="#" name="next" onClick={this.handldClick}>Next
                 {/* <span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span> */}
            </a></li>

          </ul>
          <br />
          <Data month={this.state.month} year={this.state.year} sessionId={this.props.sessionId} ref="data" />
        </nav>
      </div>
    )
  }
}
