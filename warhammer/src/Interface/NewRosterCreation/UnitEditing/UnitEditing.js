import React, {Component} from "react";
import { connect } from 'react-redux';

import "./UnitEditing.css";
import UnitProfile from "../UnitProfile/UnitProfile.js";
import UnitModelsList from "../UnitModels/UnitModels.js";
import WargearSelection from "../WargearSelection/WargearSelection.js";
import EditUnitPsychicPowers from "../UnitPsychicPowers/EditUnitPsychicPowers.js";
import AddNewModel from "../AddNewModel/AddNewModel.js";
//import GetPsychicPowers from "../../../Scripts/GetPsychicPowers.js";

class UnitEditing extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        let WargearSelectionComponent = (this.props.ActiveModel) ? <WargearSelection/> : null;
        let EditUnitPsychicPowersComponent = (!_.isEmpty(this.props.Unit) && (this.props.Unit.BaseUnit.KnowsSmite || !_.isEmpty(this.props.Unit.BaseUnit.AvailableSpells))) ? <EditUnitPsychicPowers /> : null;
        
        if (this.props.Unit.BaseUnit.MaxModelQuant > 1) { 
            let AddNewModelComponent = (!_.isEmpty(this.props.Unit) && (this.props.Unit.BaseUnit.MaxModelQuant > this.props.Unit.Models.length || !this.props.Unit.BaseUnit.MaxModelQuant)) ? <AddNewModel/> : null;
            return (
                <div className = 'UnitEditing__Common'>
                    <UnitProfile Unit = {this.props.Unit.BaseUnit} UnitSelection = {false}/>
                    <div className = 'UnitEditing__ModelsContainer'>
                        <div className = 'UnitEditing__ModelsList'>
                            <UnitModelsList/>
                        </div>
                        <div>
                            {AddNewModelComponent}
                        </div >
                    </div>
                    <div className = 'UnitEditing__WargearAndPsychicPowers'>
                        {EditUnitPsychicPowersComponent}
                        {WargearSelectionComponent}
                    </div >
                </div>
            )
        } else {
            return (
                <div className = 'UnitEditing__Common'>
                    <UnitProfile Unit = {this.props.Unit.BaseUnit} UnitSelection = {false}/>
                    <div className = 'UnitEditing__WargearAndPsychicPowersAlone'>
                        {EditUnitPsychicPowersComponent}
                        {WargearSelectionComponent}
                    </div >
                </div>
            )
        }
    }

}

const mapStateToProps = (state) => {
    return {
        ActiveModel: state.RosterEditing.ActiveModel,
        Unit: state.RosterEditing.ActiveUnit
    }
}

const containerUnitEditing = connect(
    mapStateToProps
  )(UnitEditing);

export default containerUnitEditing;