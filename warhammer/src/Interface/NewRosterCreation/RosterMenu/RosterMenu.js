import React, {Component} from "react";
import * as utils from "../../../Scripts/CommonFunctions.js";
import RosterDetachmentItem from "./RosterDetachmentItem.js";
import EditButtonImage from "../../../Data/RosterMenuIcons/EditIcon.png";
import "./RosterMenu.css";
import { CSSTransitionGroup } from 'react-transition-group';

class RosterMenu extends Component{
    constructor(props) {
        super(props);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleNewClick = this.handleNewClick.bind(this);
    }

    handleEditClick = () => {
        this.props.EditRosterClick();
    }

    handleNewClick = () => {
        this.props.NewDetachmentClick();
    }

    
    render = () => {
        let DetachmentsList;
        let Detachments = [];
        let MaxPTS = (this.props.Roster.MaxPTS) ? (<text>/{this.props.Roster.MaxPTS}</text>) : null;
        let MaxPL = (this.props.Roster.MaxPL) ? (<text>/{this.props.Roster.MaxPL}</text>) : null;
        let NewButton = <li key = {0} className = "RosterMenu__DetachmentListNewButton" onClick = {this.handleNewClick}>+ New Detachment</li>
        if(!_.isEmpty(this.props.Roster.RosterDetachments)) {
            Detachments = this.props.Roster.RosterDetachments.map((detachment) => 
                <RosterDetachmentItem 
                    key = {detachment.id} 
                    RosterDetachment = {detachment}
                    Active = {detachment.id == this.props.ActiveDetachmentId} 
                    ActiveUnitId = {this.props.ActiveUnitId}
                    EditClick = {this.props.EditClick} 
                    CopyClick = {this.props.CopyClick} 
                    DeleteClick = {this.props.DeleteClick} 
                    NewUnitClick = {this.props.NewUnitClick}
                    EditDetachmentClick = {this.props.EditDetachmentClick}
                    CopyDetachmentClick = {this.props.CopyDetachmentClick}
                    DeleteDetachmentClick = {this.props.DeleteDetachmentClick}
                />
            );
        }
        DetachmentsList = 
            <ul className = "RosterMenu__DetachmentList">
                <CSSTransitionGroup 
                    transitionName="RosterMenu__Transition" 
                    transitionAppear={false} 
                    transitionEnterTimeout={300} 
                    transitionLeaveTimeout = {300}
                >
                    {Detachments}
                    {NewButton}
                </CSSTransitionGroup>
            </ul>
        return (
            <div className = "RosterMenu">
                <div className = "RosterMenu__HeaderDiv">
                    <div className = "RosterMenu__HeaderNameDiv">
                        <span className = "RosterMenu__HeaderName">{this.props.Roster.Name}</span>
                        <img className = "RosterMenu__ButtonImage" onClick = {this.handleEditClick} src = {EditButtonImage} alt = "Edit"/>
                    </div>
                    <p className = "RosterMenu__RosterParameters">
                        <span>Total PTS&nbsp;: {this.props.Roster.TotalPTS}</span>{MaxPTS}<br/>
                        <span>Total PL&nbsp;&nbsp;&nbsp;: {this.props.Roster.TotalPL}</span>{MaxPL}<br/>
                        <span>Total CP&nbsp;&nbsp;&nbsp;: {this.props.Roster.TotalCP}</span><br/>
                    </p>
                </div>
                {DetachmentsList}
            </div>
        )
    }
}

export default RosterMenu;