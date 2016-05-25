import autosize from 'autosize';
import React from 'react';
import Classnames from 'classnames';
import isSiteOpen from '../../../Utils/openingHours.js';

// Components
import Login from '../../General/Login/Login.component';
import Icon from '../../General/Icon/Icon.component';
import Message from '../../General/Message/Message.component';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';
import FeaturePreview from '../../General/FeaturePreview/FeaturePreview.component';

// SVGs
import cameraSvg from '../../General/Icon/svg/functions/camera.svg';
import videoSvg from '../../General/Icon/svg/functions/video.svg';
import close from '../../General/Icon/svg/functions/close.svg';
import spinner from '../../General/Icon/svg/spinners/loading-spin.svg';

// Styles
import './scss/addContent.scss';

import UploadMedia from '../../General/UploadMedia/UploadMedia.component.js';

/**
 * add group content . uses XHR if available.
 */
export default class AddContent extends UploadMedia {

  constructor(props) {
    super(props);
    this.state = {
      text: props.text || '',
      attachment: {
        image: props.image || null,
        video: null,
        review: null
      },
      imageRemoved: false,
      errorMsg: null,
      target: `/grupper/content/${props.type}`,
      isLoading: false,
      disableInput: false,
      showAddReviews: false
    };

    if (!isSiteOpen() && !this.props.profile.isModerator) {
      this.state.errorMsg = ['Du kan kun skrive mellem 09:00 og 21:00'];
      this.state.disableInput = true;
    }

    this.renderAddReviewModal.bind(this);
  }

  componentDidMount() {
    autosize(this.refs.contentTextarea);
    if (this.refs.contentTextarea && this.props.autofocus) {
      this.refs.contentTextarea.focus();
    }
  }

  /**
   * Callback for the submit button on 'group-post-form'
   *
   * @param {Event} e
   */
  onSubmit(e) {
    if (!isSiteOpen() && !this.props.profile.isModerator) {
      e.preventDefault();
      this.setState({errorMsg: 'Du kan kun skrive mellem 09:00 og 21:00'});
    }
    else if (!this.state.text.length && !this.state.attachment.image && !this.state.attachment.video) {
      e.preventDefault();
      this.setState({errorMsg: 'Dit indlæg må ikke være tomt.'});
    }
    else if (XMLHttpRequest && FormData) {
      e.preventDefault();
      this.setState({isLoading: true});
      let form = this.refs['group-post-form'];
      this.addContent(form, e.target.action).then((response) => {
        if (form.id.value === '') { // UploadComponent does upserts. checks on id null  . clear state to prepare for new
          this.setState({id: null, isLoading: false, text: '', attachment: {image: null, video: null}});
        }
        this.props.addContentAction(response);
        if (this.props.abort) {
          this.props.abort();
        }

        this.setState({isLoading: false});
      }).catch((response) => {
        this.setState({errorMsg: response.errors[0].errorMessage});
      });
    }
  }

  renderAddReviewModal() {
    const reviewRows = this.props.profile.reviews.data.map((review, idx) => {
      const work = this.props.works[review.pid];
      let authorCreator = '';

      if (work && work.title && work.creator) {
        authorCreator = (
          <span>
            <div>
              <strong>{work.title}</strong>
            </div>
            <div>
              {work.creator}
            </div>
          </span>
        );
      }

      return (
        <div key={`${review.id}`} className="attach-review-modal--review-row--container">
          <label htmlFor={`review-attachment--${review.id}`}>
            <table>
              <tbody>
              <tr>
                <td className="attach-review-modal--review--radio-btn">
                  <input
                    type="radio" value={review.id} name="reviewAttachment" id={`review-attachment--${review.id}`}
                    onChange={() => this.setState({attachment: {review}})}
                    className="attach-review-modal--radio-btn-input"
                  />
                  <span className="attach-review-modal--displayed-radio-btn"> </span>
                </td>
                <td className="attach-review-modal--review--cover-image">
                  <img src={this.props.coverImages.pids[review.pid]}/>
                </td>
                <td className="attach-review-modal--review--title-and-creator">
                  {authorCreator}
                </td>
                <td className="attach-review-modal--review--content-container">
                  <span className="attach-review-modal--review-content">{review.content}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </label>
        </div>
      );
    });

    return (
      <ModalWindow onClose={() => this.setState({showAddReviews: false})} title="Indsæt Anmeldelse">
        <div className="attach-review-modal--reviews-container">
          {reviewRows.length > 0 ? reviewRows : 'Vi kunne ikke finde nogen anmeldelser, prøv at oprette en ny!'}
        </div>
        {this.props.profile.reviews.data.length < this.props.profile.reviews.reviewsCount && <div>
          <VisFlereButton
            onClick={() => this.props.getMoreWorks(this.props.profile.id, this.props.profile.reviews.data.length)}
            isLoading={this.props.profile.reviews.isLoading}
          />
        </div>}
        <div className="attach-review-modal--buttons-container">
          <RoundedButton buttonText="OK" clickFunction={() => this.setState({showAddReviews: false})}/>
          <RoundedButton buttonText="Luk"
                         clickFunction={() => this.setState({showAddReviews: false, attachment: {review: null}})}/>
        </div>
      </ModalWindow>
    );
  }

  render() {
    let deleteButton = null;
    if (this.props.delete) {
      deleteButton = (
        <a className="button delete" onClick={() => this.props.delete()}>
          <span>Slet</span>
        </a>
      );
    }

    if (!this.props.profile.userIsLoggedIn || !this.props.profile.hasFilledInProfile) {
      return (
        <div className='content-add'>
          <Login>Log ind for at skrive et indlæg</Login>
        </div>
      );
    }

    const uniqueId = `upload-media-${this.props.type}-${this.props.id || this.props.parentId}`;

    const progressStatusClass = this.state.attachment.video && this.state.attachment.video.file.progress === 100 ? 'done' : '';

    return (
      <div className={Classnames({'content-add': true, shakeit: this.state.errorMsg})}>
        {this.state.showAddReviews && this.renderAddReviewModal()}

        <form method="POST" action={this.state.target} encType="multipart/form-data"
              id="content_form_component" ref="group-post-form"
              onSubmit={e => this.onSubmit(e)}>
          <div className='content-add--input'>
            <input type="hidden" name="id" value={this.props.id || null}/>
            <input type="hidden" name="imageRemoved" value={this.state.imageRemoved}/>
            <input type="hidden" className="redirect" name="redirect" value={this.props.redirectTo}/>
            <input type="hidden" name="parentId" value={this.props.parentId}/>
            <input type="hidden" name="attachedReview" value={(this.state.attachment.review || {}).id}/>
          <textarea className="content-add--textarea" ref='contentTextarea' name="content"
                    placeholder='Gi den gas & hold god tone ;-)'
                    value={this.state.text}
                    disabled={this.state.disableInput}
                    onChange={(e) => this.setState({text: e.target.value})}
          />
            {this.state.attachment.image &&
            <div className='content-add--preview-image'>
              <img src={this.state.attachment.image} alt="preview"/>
              <a href="#removeImage" className="content-add--remove-media" onClick={(e) => this.clearImage(e)}>
                <Icon glyph={close}/>
              </a>
            </div>
            }

            <div className='preview-video'>
              {this.state.attachment.video &&
              <div>
                <span className="preview-video--name">{this.state.attachment.video.file.name}</span>
                <progress className={progressStatusClass} max="100"
                          value={this.state.attachment.video.file.progress || 0}/>
              </div>
              }
            </div>

            {this.state.attachment.review &&
            <div>
              <p>bob</p>
            </div>
            }
          </div>
          <div className={Classnames({'content-add--messages': true, fadein: this.state.errorMsg})}>
            {
              this.state.errorMsg &&
              <Message type="error" onClose={() => this.setState({errorMsg: null})}>{this.state.errorMsg}</Message>
            }
          </div>
          <div className='content-add--actions'>
            <button
              type='submit'
              className='button submit'
              id='submit-btn'
              disabled={
                this.state.attachment.video &&
                this.state.attachment.video.file.progress > 0 &&
                this.state.attachment.video.file.progress < 100 ||
                this.state.isLoading ||
                this.state.disableInput
                }
            >
              {(this.state.isLoading) && <Icon glyph={spinner}/>}
              OK
            </button>
            {
              (this.props.abort || (this.state.attachment.video && this.state.attachment.video.file.progress > 0 && this.state.attachment.video.file.progress < 100)) &&
              <input ref="about" type="reset" className='button alert' onClick={this.onAbort.bind(this)}
                     value="Fortryd"/>
            }
            {deleteButton}
            <div className='content-add--media'>
              <label htmlFor={uniqueId}>
                <input
                  id={uniqueId}
                  accept='image/*,video/*'
                  type="file"
                  className="content-add--upload-media droppable-media-field--file-input"
                  name="image"
                  disabled={this.state.disableInput}
                  onChange={event => this.readInput(event, attachment => this.setState({attachment: attachment}))
                            .then(attachment => this.setState({attachment: attachment}))
                            .catch(errorMsg => this.setState({errorMsg: errorMsg}))
                            }
                  ref="fileInput"
                />
                <Icon glyph={videoSvg}/>
                <Icon glyph={cameraSvg}/>
                <span className="content-add--media-label">Upload</span>
              </label>

              <FeaturePreview>
                <RoundedButton
                  buttonText="Anmeldelse"
                  className=" insert-review-button"
                  clickFunction={() => this.setState({showAddReviews: true})}
                />
              </FeaturePreview>
            </div>
          </div>
        </form>
      </div>);
  }
}

AddContent.displayName = 'AddContent';
AddContent.propTypes = {
  abort: React.PropTypes.func,
  delete: React.PropTypes.func,
  addContentAction: React.PropTypes.func.isRequired,
  autofocus: React.PropTypes.bool,
  profile: React.PropTypes.object.isRequired,
  parentId: React.PropTypes.number.isRequired,
  redirectTo: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  text: React.PropTypes.string,
  image: React.PropTypes.string,
  id: React.PropTypes.number,
  getMoreWorks: React.PropTypes.func.isRequired,
  works: React.PropTypes.object,
  coverImages: React.PropTypes.object
};
AddContent.defaultProps = {
  getMoreWorks: () => {
  },
  works: {},
  coverImages: {
    pids: {}
  }
};
