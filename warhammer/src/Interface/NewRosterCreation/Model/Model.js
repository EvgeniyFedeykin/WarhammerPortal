import React, {Component} from 'react';
import './Model.css';
import EditMenuButton from '../../../Data/ModelMenuButtons/EditMenuButton.png';
import CopyMenuButton from '../../../Data/ModelMenuButtons/CopyMenuButton.png';
import DeleteMenuButton from '../../../Data/ModelMenuButtons/DeleteMenuButton.png';

class ModelListElement extends Component {

    DeleteButton = () => {
        this.props.handleModelButtonClick(this.props.singleModel, 'Delete');
    }

    CopyButton = () => {
        this.props.handleModelButtonClick(this.props.singleModel, 'Copy');
    }

    EditButton = () => {
        this.props.handleModelButtonClick(this.props.singleModel, 'Edit');
    }

    render() {
        const Name = this.props.singleModel.BaseModel.Name;
        let modelCost = this.props.singleModel.TotalCost;
        var CopyButton = null;
        var DeleteButton = null;
        if (this.props.showCopyButton) {
            CopyButton = <img src = {CopyMenuButton} className = 'model__buttons' alt = 'Copy' onClick = {this.CopyButton}/>;
        }
        if (this.props.showDeleteButton) {
            DeleteButton = <img src = {DeleteMenuButton} className = 'model__buttons' alt = 'Delete' onClick = {this.DeleteButton}/>
        }

        let classTypeTitle = (this.props.ActiveModelExist) ? 'model__activeModelTitleText' : 'model__titleText';
        let classTypeElement = (this.props.ActiveModelExist) ? 'model__activeModelElement' : 'model__element';
        return (
            <div className = {classTypeElement}>
                <div className = 'model__title'>
                    <span className = {classTypeTitle} >{Name} [{modelCost} pts]</span>
                </div>
                <div className = 'model__buttonsSet'>
                    <img src = {EditMenuButton} className = 'model__buttons' alt = 'Edit' onClick = {this.EditButton}/>
                    {CopyButton}
                    {DeleteButton}
                </div>
            </div>
        )
    }
}

export default ModelListElement;