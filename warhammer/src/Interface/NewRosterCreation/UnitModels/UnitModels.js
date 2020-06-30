import React, {Component} from 'react';
import './UnitModels.css';
import ModelListElement from '../Model/Model.js';
import * as ActionCreators from "../../../Store/ActionsCreators.js";
import { connect } from 'react-redux';
import * as utils from "../../../Scripts/CommonFunctions.js";

const _ = require('lodash');

class UnitModelsList extends Component {
     constructor(props) {
        super(props);
        this.handleModelButtonClick = this.handleModelButtonClick.bind(this);
        this.models = [];
     }
     
    handleModelButtonClick = (model,ButtonName) => {
        if (ButtonName == "Delete") {
            this.models.splice((this.models.indexOf(model)), 1);
            this.props.handleModelButtonClick(this.models);
            
        } else if (ButtonName == "Copy") {
            const newModel = Object.assign({}, model);
            newModel.id = utils.calculateNewId(this.models);
            this.models.splice((this.models.length),0,newModel);
            this.props.handleModelButtonClick(this.models);

        } else {
            this.props.HandleEditButtonClick(model);
        }
        
    }

    showCopyButton = (currentBaseModel) => {
        let ShowButton = true;
        if (!!currentBaseModel.PerXmodels) {
            let AlreadyHave = _.filter(this.models, model => (model.id == currentBaseModel.id)).length;
            let Available = this.models.length / currentBaseModel.PerXmodels;
            
            ShowButton = ShowButton && (Available > AlreadyHave);
        }

        if (!!this.props.Unit.BaseUnit.MaxModelQuant) {
            ShowButton = ShowButton && (this.props.Unit.BaseUnit.MaxModelQuant > this.models.length);
        }

        if (!!currentBaseModel.MaxQuant) {
            ShowButton = ShowButton && (_.filter(this.models, (model) => model.BaseModel.id == currentBaseModel.id).length < currentBaseModel.MaxQuant);
        }
        return ShowButton;
    }
     render() {
        this.models =  this.props.Models.slice();
         const modelsList = this.models.map(
             (model) => 
                <ModelListElement key = {model.id} ActiveModelExist = {(!!this.props.ActiveModel && this.props.ActiveModel.id == model.id)} singleModel = {model} showCopyButton = {this.showCopyButton(model.BaseModel)} showDeleteButton = {(this.models.length > model.BaseModel.MinQuant)} handleModelButtonClick = {this.handleModelButtonClick}/>
          );
         return (
             <div className = 'unitModels__Container'>
                <h3 className = 'unitModels__Title'>Models of the unit</h3>
                <ul className = 'unitModels__List'>{modelsList}</ul>
             </div>
         )
    }
}

const mapStateToProps = (state) => {
    return {
        Models: state.RosterEditing.ActiveUnit.Models,
        Unit: state.RosterEditing.ActiveUnit,
        ActiveModel: state.RosterEditing.ActiveModel
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleModelButtonClick: (models) => dispatch(ActionCreators.UpdateUnitModels(models)),
        HandleEditButtonClick: (currentModel) => dispatch(ActionCreators.EditModelWargear(currentModel))
    }
}

const containerUnitModelsList = connect(
    mapStateToProps,
    mapDispatchToProps
  )(UnitModelsList);

export default containerUnitModelsList;