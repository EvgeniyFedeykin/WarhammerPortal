import React, {Component} from "react";
import * as utils from "../../../Scripts/CommonFunctions.js";
import RosterUnitRoleItem from "./RosterUnitRoleItem.js";
import EditButtonImage from "../../../Data/RosterMenuIcons/EditIcon.png";
import CopyButtonImage from "../../../Data/RosterMenuIcons/CopyIcon.png";
import DeleteButtonImage from "../../../Data/RosterMenuIcons/DeleteIcon.png";
import { CSSTransitionGroup } from 'react-transition-group';

class RosterDetachmentItem extends Component{
    constructor(props) {
        super(props);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleCopyClick = this.handleCopyClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.NewUnitClick = this.NewUnitClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (event) => {
        (event.target.className != "RosterMenu__ButtonImage") && (this.props.EditDetachmentClick(this.props.RosterDetachment));
    }

    handleEditClick = () => {
        this.props.EditDetachmentClick(this.props.RosterDetachment);
    }

    handleCopyClick = () => {
        this.props.CopyDetachmentClick(this.props.RosterDetachment);
    }

    handleDeleteClick = () => {
        this.props.DeleteDetachmentClick(this.props.RosterDetachment);
    }

    NewUnitClick = () => {
        this.props.NewUnitClick(this.props.RosterDetachment);
    }

    render = () => {
        let UnitRoles = [];
        let UnitList = [];
        let NewButton = (!_.isEmpty(this.props.RosterDetachment.Faction) && !_.isEmpty(this.props.RosterDetachment.Detachment)) ? (<li className = "RosterMenu__UnitListNewButton" onClick = {this.NewUnitClick}>+ New unit</li>) : null;
        if(!_.isEmpty(this.props.RosterDetachment.RosterUnits)) {
            UnitRoles = utils.GetDetachmentUnitsRoles(this.props.RosterDetachment.RosterUnits);
        }

        if(!_.isEmpty(UnitRoles)) {
            UnitRoles = UnitRoles.map((role) => 
                <RosterUnitRoleItem 
                    key = {role.id} 
                    ActiveDetach = {this.props.Active}
                    ActiveUnitId = {this.props.ActiveUnitId}
                    AllowedCopy = {utils.CheckDetachmentOptionFull(this.props.RosterDetachment.RosterUnits, role, this.props.RosterDetachment.Detachment)} 
                    EditClick = {this.props.EditClick} CopyClick = {this.props.CopyClick} DeleteClick = {this.props.DeleteClick} RoleName = {role.Name} 
                    Detachment = {this.props.RosterDetachment} Units = {utils.GetRosterUnitsByRole(this.props.RosterDetachment.RosterUnits, role.id)}
                />
            );
        }
        UnitList = 
        <ul className = "RosterMenu__DetachmentRolesList">
            <CSSTransitionGroup 
                transitionName="RosterMenu__Transition" 
                transitionAppear={true}
                transitionAppearTimeout={300}
                transitionEnterTimeout={300} 
                transitionLeaveTimeout = {300}
            >
                {UnitRoles}
                {NewButton}
            </CSSTransitionGroup>
        </ul>;
        const ElementClass = (this.props.Active) ? "RosterMenu__DetachmentListItem ActiveBrightning" : "RosterMenu__DetachmentListItem"; 
        return(
            <li>
                <div className = {ElementClass}  onClick = {this.handleClick}>
                    <span className = "RosterMenu__UnitItemName">{"["+this.props.RosterDetachment.TotalDetachCost+" pts] "+((!!this.props.RosterDetachment.Detachment) ? this.props.RosterDetachment.Detachment.Name : "New Detachment")}</span>
                    <div className = "RosterMenu__ButtonBlock">
                        <img className = "RosterMenu__ButtonImage" onClick = {this.handleEditClick} src = {EditButtonImage} alt = "Edit"/>
                        <img className = "RosterMenu__ButtonImage" onClick = {this.handleCopyClick} src = {CopyButtonImage} alt = "Copy"/>
                        <img className = "RosterMenu__ButtonImage" onClick = {this.handleDeleteClick} src = {DeleteButtonImage} alt = "Delete"/>
                    </div>
                </div>
                {UnitList}
            </li>
        )
    }

}

export default RosterDetachmentItem;