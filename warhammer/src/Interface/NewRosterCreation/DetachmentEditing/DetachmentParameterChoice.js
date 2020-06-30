import React, {Component} from "react";
import "./DetachmentEditing.css";
import * as utils from "../../../Scripts/CommonFunctions.js";

class DetachmentParameterChoice extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.handleChange(e.target.value);
    }

    render() {
            //let ObjectsArray = [];
            let SelectLabel = "";
            if(this.props.ListTypeNumber == 1) {
                SelectLabel = "Select Detachment";
            } else if(this.props.ListTypeNumber == 2) {
                SelectLabel = "Select Faction";
            } else {
                SelectLabel = "Select Tactic";
            }
            let options = (!(this.props.ObjectId > 0)) ? [<option className = "DetachmentEditing__Option" key = {0} value = ''>--none--</option>] : [];
            options = options.concat(this.props.ObjectsArray.map(
                (object) =>
                <option className = "DetachmentEditing__Option" key = {object.id} value = {object.id}>{object.Name}</option>
            ));
            return (
                <div className = "DetachmentEditing__SelectDiv">
                    <h3 className = "DetachmentEditing__SelectLabel">{SelectLabel}</h3>
                    <select className = "DetachmentEditing__Select" value = {this.props.ObjectId} onChange = {this.handleChange}>
                        {options}
                    </select>
                </div>
            )
        }
}

export default DetachmentParameterChoice;