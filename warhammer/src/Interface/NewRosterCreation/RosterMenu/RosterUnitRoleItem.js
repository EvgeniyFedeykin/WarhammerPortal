import React, {Component} from "react";
import * as utils from "../../../Scripts/CommonFunctions.js";
import RosterUnitItem from "./RosterUnitItem.js";
import { CSSTransitionGroup } from 'react-transition-group';

class RosterUnitRoleItem extends Component{
    constructor(props) {
        super(props);
    }

    render = () => {
        let Units = this.props.Units.map((unit,idx) =>
            <RosterUnitItem 
                key = {idx} 
                RosterUnit = {unit}
                Active = {this.props.ActiveDetach && unit.id == this.props.ActiveUnitId} 
                AllowedCopy = {this.props.AllowedCopy} 
                EditClick = {this.props.EditClick} 
                CopyClick = {this.props.CopyClick} 
                DeleteClick = {this.props.DeleteClick} 
                Detachment = {this.props.Detachment}
            />
        );
        let DetachmentUnitsListByRole = 
            <ul className = "RosterMenu__DetachmentUnitsList">
                <CSSTransitionGroup 
                        transitionName="RosterMenu__Transition" 
                        transitionAppear={true}
                        transitionAppearTimeout={300}
                        transitionEnterTimeout={300} 
                        transitionLeaveTimeout = {300}
                    >
                    {Units}
                </CSSTransitionGroup>
            </ul>

        return(
            <li>
                <div className = "RosterMenu__RoleCategory">{this.props.RoleName}</div>
                {DetachmentUnitsListByRole}
            </li>
        )
    }
}

export default RosterUnitRoleItem;