import React, {Component} from "react";
import "./RosterEditing.css";
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import * as ActionCreators from "../../../Store/ActionsCreators.js";

class RosterEditing extends Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleMaxPLChange = this.handleMaxPLChange.bind(this);
        this.handleMaxPTSChange = this.handleMaxPTSChange.bind(this);
    }

    handleNameChange = (event) => {
        const Roster = Object.assign({}, this.props.Roster, {Name: event.target.value});
        //this.props.RosterName(event.target.value);
        this.props.UpdateRoster(Roster);
    }

    handleMaxPLChange = (event) => {
        const MaxPL = event.target.value.replace(/[^0-9]/gim,'');
        const Roster = Object.assign({}, this.props.Roster, {MaxPL: MaxPL});
        this.props.UpdateRoster(Roster);
        //this.props.RosterMaxPL(MaxPL);
    }

    handleMaxPTSChange = (event) => {
        const MaxPTS = event.target.value.replace(/[^0-9]/gim,'');
        const Roster = Object.assign({}, this.props.Roster, {MaxPTS: MaxPTS});
        this.props.UpdateRoster(Roster);
        //this.props.RosterMaxPTS(MaxPTS);
    }

    render = () => {
        return(
            <div className = "RosterEditing__Div">
                <h1 className = "RosterEditing__Header">Edit Roster's parameters</h1>
                <label className = "RosterEditing__Label">
                    Roster Name:
                    <input  className = "RosterEditing__InputField RosterEditing__NameField" type="text" value={this.props.Name} onChange={this.handleNameChange} />
                </label>
                <br />
                <label className = "RosterEditing__Label">
                    Roster Maximum Power Level:
                    <input className = "RosterEditing__InputField" type="text" value={this.props.MaxPL} onChange={this.handleMaxPLChange} />
                </label>
                <br />
                <label className = "RosterEditing__Label">
                    Roster Maximum PTS:
                    <input className = "RosterEditing__InputField RosterEditing__PTSField" type="text" value={this.props.MaxPTS} onChange={this.handleMaxPTSChange} />
                </label>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        Name: state.RosterEditing.Roster.Name,
        MaxPL: state.RosterEditing.Roster.MaxPL,
        MaxPTS: state.RosterEditing.Roster.MaxPTS,
        Roster: state.RosterEditing.Roster
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        /*
        RosterName: (RosterName) => dispatch(ActionCreators.RosterName(RosterName)),
        RosterMaxPL: (RosterMaxPL) => dispatch(ActionCreators.RosterMaxPL(RosterMaxPL)),
        RosterMaxPTS: (RosterMaxPTS) => dispatch(ActionCreators.RosterMaxPTS(RosterMaxPTS))
        */
       UpdateRoster: (Roster) => dispatch(ActionCreators.UpdateRoster(Roster))
    }
}

const containerRosterEditing = connect(
    mapStateToProps,
    mapDispatchToProps
  )(RosterEditing);

export default containerRosterEditing;