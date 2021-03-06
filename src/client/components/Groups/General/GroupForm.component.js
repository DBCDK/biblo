import React from 'react';
import PropTypes from 'prop-types';
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

    this.refGroupForm = null;
    this.groupDescriptionArea = null;
    this.groupNameInput = null;

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
    this.refGroupForm.onsubmit = e => this.props.submit(e, this.state.groupName, this.groupDescriptionArea.value);
  }

  groupNameChange(ev) {
    const groupName = ev.target.value;
    this.setState({groupName: groupName});
    debouncedCheckGroupName(groupName, this.props.checkIfGroupNameExistsAction);
  }

  render() {
    const errorObj = {};
    this.state.errors.forEach(error => {
      errorObj[error.field] = (
        <Message type="error">
          <span className={error.field}>{error.errorMessage}</span>
        </Message>
      );
    });

    let disabled = false;
    let submitArea = <RoundedButtonSubmit buttonText="OK" disabled={this.state.errors.length > 0} />;

    if (this.props.submitState === 'SUBMITTING') {
      disabled = true;
      submitArea = <ProgressBar completed={this.props.submitProgress} height={'35px'} />;
    } else if (this.props.submitState === 'UPLOAD_COMPLETE') {
      disabled = true;
      submitArea = (
        <ProgressBar completed={this.props.submitProgress} height={'35px'}>
          <p className="progressbar--message">Behandler</p>
        </ProgressBar>
      );
    }

    return (
      <div className={'group-form' + ((this.props.errors.length > 0 && ' shakeit') || '')}>
        <form
          method="POST"
          encType="multipart/form-data"
          id="group_form_component"
          ref={groupForm => {
            this.refGroupForm = groupForm;
          }}
        >
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
            <label htmlFor="group-name-input-field">
              <strong>Gruppens navn</strong>
            </label>
            <br />
            <input
              disabled={disabled}
              id="group-name-input-field"
              className="group-name--input-field"
              name="group-name"
              required
              placeholder="Find på et gruppenavn"
              value={this.state.groupName}
              onChange={this.groupNameChange.bind(this)}
            />
            {errorObj['group-name'] || ''}
          </div>
          <br />

          <div className={'group-description-field'}>
            <label htmlFor="group-description-area">
              <strong>Beskrivelse af gruppen</strong>
            </label>
            <br />
            <textarea
              className="group-description--text-area"
              disabled={disabled}
              id="group-description-area"
              placeholder="Her kan du skrive lidt om gruppen"
              name="group-description"
              required
              rows="5"
              ref={groupDescriptionArea => {
                this.groupDescriptionArea = groupDescriptionArea;
              }}
              defaultValue={this.props.defaultValues['group-description']}
            />
            {errorObj['group-description'] || ''}
          </div>

          {errorObj.general || ''}
          <div className={'group-form-submit-button'}>{submitArea}</div>
          {this.props.moderation}
        </form>
      </div>
    );
  }
}

GroupForm.displayName = 'GroupForm';

GroupForm.propTypes = {
  changeImageAction: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
  groupImageSrc: PropTypes.string.isRequired,
  submitState: PropTypes.string,
  submitProgress: PropTypes.number.isRequired,
  submit: PropTypes.func.isRequired,
  checkIfGroupNameExistsAction: PropTypes.func.isRequired,
  checkedNames: PropTypes.object,
  defaultValues: PropTypes.object,
  moderation: PropTypes.any
};

GroupForm.defaultProps = {
  checkedNames: {},
  defaultValues: {
    'group-name': '',
    'group-description': ''
  }
};
