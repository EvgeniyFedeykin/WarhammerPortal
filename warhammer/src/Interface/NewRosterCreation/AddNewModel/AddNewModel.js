import React, {Component} from 'react';
import '../AddNewModel/AddNewModel.css';
import * as ActionCreators from "../../../Store/ActionsCreators.js";
import { connect } from 'react-redux';
import AddMenuButton from '../../../Data/ModelMenuButtons/AddMenuButton.png';
import {RosterModel} from "../../../Classes/CommonClasses.js";
import * as utils from "../../../Scripts/CommonFunctions.js";

const _ = require('lodash');

/*
in:
ActiveUnit.Models
Out:
this.Models
*/

class AddNewModel extends Component {
    constructor(props) {
       super(props);
       this.HandleButtonClick = this.HandleButtonClick.bind(this);
       this.ChosenModel = null;
    }
    
    GetAvailableModels = (RosterModels, BaseModels) => {
        let AvailableModels = [];

        BaseModels.forEach((model) => {
            let PerXmodelsCheck = true;
            let MaxQuantCheck = (!model.MaxQuant || (_.filter(RosterModels, (rosterModel) => rosterModel.BaseModel.id == model.id).length < model.MaxQuant));
            if (!!model.PerXmodels) {
                let AlreadyHave = _.filter(RosterModels, (rosterModel) => rosterModel.BaseModel.id == model.id).length;
                let Available = RosterModels.length / model.PerXmodels;
                PerXmodelsCheck = PerXmodelsCheck && (Available > AlreadyHave);
            }

            if (PerXmodelsCheck && MaxQuantCheck) {
                AvailableModels.push(model);
            }
        });
        return AvailableModels;
    }

    HandleButtonClick = () => {
        let NewRosterModel = new RosterModel(utils.calculateNewId(this.props.Models),this.ChosenModel,this.props.Unit.id,this.ChosenModel.Cost);
        NewRosterModel = utils.recalculateRosterModel(NewRosterModel); 
        let NewUnitModels = this.props.Models.slice();
        NewUnitModels.splice((NewUnitModels.length),0,NewRosterModel);
        this.props.HandleAddButtonClick(NewUnitModels);
    }

    HandleOnchangeSelect = (event) => {
        let ChosenModelId = event.target.value;
        this.ChosenModel = _.find(this.props.BaseModels, (model) => model.id == ChosenModelId);
    }

    render() {
        if (this.props.BaseModels.length > 1) {
            let AvailableOptions = this.GetAvailableModels(this.props.Models, this.props.BaseModels);
            this.ChosenModel = AvailableOptions[0];
                let Options = AvailableOptions.map(
                    (option) =>
                    <option className = "AddNewModel__Option" key = {option.id} value = {option.id}>{option.Name}</option>
                );
            return (
                <div className = 'AddNewModel__CoreContainer'>
                    <select className = 'AddNewModel__SelectModel' onChange = {this.HandleOnchangeSelect}>{Options}</select>
                    <img src = {AddMenuButton} className = 'AddNewModel__AddButton' alt = 'Add' onClick = {this.HandleButtonClick}/>
                </div>
            )
        } else {
            this.ChosenModel = this.props.BaseModels[0];
            return (
                <div>
                 <img src = {AddMenuButton} className = 'AddNewModel__AddButton' alt = 'Add' onClick = {this.HandleButtonClick}/>
                </div>
            )
        } 
    }
}



const mapStateToProps = (state) => {
    return {
        Models: state.RosterEditing.ActiveUnit.Models,
        BaseModels: state.RosterEditing.ActiveUnit.BaseUnit.Models,
        Unit: state.RosterEditing.ActiveUnit
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        HandleAddButtonClick: (models) => dispatch(ActionCreators.UpdateUnitModels(models)),
    }
}

const containerAddNewModel = connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddNewModel);

export default containerAddNewModel;