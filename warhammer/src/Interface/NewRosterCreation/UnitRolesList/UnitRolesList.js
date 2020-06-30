import React, {Component} from "react";
import "./UnitRolesList.css";
import GetAvailableRoles from "../../../Scripts/GetAvailableRoles.js";
import * as utils from "../../../Scripts/CommonFunctions.js";

class UnitRolesList extends Component {
    constructor(props) {
        super(props);
        this.ScrollToUnitsByRole = this.props.ScrollToUnitsByRole.bind(this);
    }

    ScrollToUnitsByRole() {
        this.props.ScrollToUnitsByRole();
    }

    render() {
        let RolesComponent = null;
        if (!_.isEmpty(this.props.Roles)) {
            RolesComponent = this.props.Roles.map(
                (role) =>
                <h3 key = {role.id} className = "UnitRolesList__RoleButton" onClick = {this.ScrollToUnitsByRole.bind(this, role.Name)}>{role.Name}</h3>
            )
        }
        return(
            <div className = "UnitRolesList__Block">
                <h2>Available roles</h2>
                {RolesComponent}
            </div>
        )
    }
}

export default UnitRolesList;