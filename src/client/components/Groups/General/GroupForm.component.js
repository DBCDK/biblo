import React from 'react';
import ReactDOM from 'react-dom';
import {debounce} from 'lodash';

import DroppableImageField from '../../General/DroppableImageField/DroppableImageField.component.js';
import RoundedButtonSubmit from '../../General/RoundedButton/RoundedButton.submit.component.js';
import ProgressBar from '../../General/ProgressBar/ProgressBar.component';
import Message from '../../General/Message/Message.component';

import './_groupform.component.scss';

const debouncedCheckGroupName = debounce((groupName, checkIfGroupNameExists) => {
  checkIfGroupNameExists(groupName);
}, 400);

export default class GroupForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: props.errors,
      groupName: props.defaultValues['group-name']
    };
  }

  componentWillReceiveProps(nextProps) {
    // copy array to avoid error persistence.
    const errors = nextProps.errors.slice();
    const checkedNames = nextProps.checkedNames;
    const groupName = this.state.groupName;

    if (checkedNames[groupName]) {
      errors.push({
        errorMessage: 'Der findes allerede en gruppe med det navn',
        field: 'group-name'
      });
    }

    this.setState({errors});
  }

  componentDidMount() {
    let elem = ReactDOM.findDOMNode(this.refs['group-form']);
    elem.onsubmit = (e) => this.props.submit(
      e,
      this.state.groupName,
      this.refs.groupDescriptionArea.value
    );
  }

  groupNameChange(ev) {
    const groupName = ev.target.value;
    this.setState({groupName: groupName});
    debouncedCheckGroupName(groupName, this.props.checkIfGroupNameExistsAction);
  }

  render() {
    const errorObj = {};
    this.state.errors.forEach((error) => {
      errorObj[error.field] = (
        <Message type='error'>
          <span className={error.field}>{error.errorMessage}</span>
        </Message>
      );
    });

    let disabled = false;
    let submitArea = <RoundedButtonSubmit buttonText="OK" disabled={this.state.errors.length > 0}/>;

    if (this.props.submitState === 'SUBMITTING') {
      disabled = true;
      submitArea = <ProgressBar completed={this.props.submitProgress} height={'35px'} />;
    }
    else if (this.props.submitState === 'UPLOAD_COMPLETE') {
      disabled = true;
      submitArea = (<ProgressBar completed={this.props.submitProgress} height={'35px'}><p className="progressbar--message">Behandler</p></ProgressBar>);
    }

    return (
      <div className={'group-form' + (this.props.errors.length > 0 && ' shakeit' || '')}>
        <form method="POST" encType="multipart/form-data" id="group_form_component" ref="group-form">
          <div className={'group-image-upload'}>
            <DroppableImageField
              disabled={disabled}
              imageSrc={this.props.groupImageSrc}
              onFile={this.props.changeImageAction}
              fieldName={'group_image'}
            />
            {errorObj.group_image || ''}
          </div>

          <div className={'group-name-field'}>
            <label htmlFor="group-name-input-field"><strong>Gruppens navn</strong></label><br />
            <input
              disabled={disabled}
              id="group-name-input-field"
              className="group-name--input-field"
              name="group-name"
              required
              placeholder="Find på et gruppenavn"
              ref={'groupNameInput'}
              value={this.state.groupName}
              onChange={this.groupNameChange.bind(this)}
            />
            {errorObj['group-name'] || ''}
          </div>
          <br />

          <div className={'group-description-field'}>
            <label htmlFor="group-description-area"><strong>Beskrivelse af gruppen</strong></label><br />
            <textarea
              className="group-description--text-area"
              disabled={disabled}
              id="group-description-area"
              placeholder="Her kan du skrive lidt om gruppen"
              name="group-description"
              required
              rows="5"
              ref={'groupDescriptionArea'}
              defaultValue={this.props.defaultValues['group-description']}
            />
            {errorObj['group-description'] || ''}
          </div>

          {errorObj.general || ''}
          <div className={'group-form-submit-button'}>
            {submitArea}
          </div>
          <div className="group-form--moderation">
            {this.props.delete && <a href="#delete" onClick={this.props.delete}>Slet gruppe</a> || null }
          </div>
        </form>
      </div>
    );
  }
}

GroupForm.displayName = 'GroupForm';

GroupForm.propTypes = {
  changeImageAction: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array.isRequired,
  groupImageSrc: React.PropTypes.string.isRequired,
  submitState: React.PropTypes.string,
  submitProgress: React.PropTypes.number.isRequired,
  submit: React.PropTypes.func.isRequired,
  checkIfGroupNameExistsAction: React.PropTypes.func.isRequired,
  checkedNames: React.PropTypes.object,
  defaultValues: React.PropTypes.object,
  delete: React.PropTypes.func
};

GroupForm.defaultProps = {
  checkedNames: {},
  defaultValues: {
    'group-name': '',
    'group-description': ''
  }
};
