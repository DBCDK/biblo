import autosize from 'autosize';
import React from 'react';
import PropTypes from 'prop-types';
import Classnames from 'classnames';
import isSiteOpen from '../../../Utils/openingHours.js';

// Components
import Login from '../../General/Login/Login.component';
import Icon from '../../General/Icon/Icon.component';
import Message from '../../General/Message/Message.component';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';
import ModalWindow from '../../General/ModalWindow/ModalWindow.component';

// SVGs
import cameraSvg from '../../General/Icon/svg/functions/camera.svg';
import pdfSvg from '../../General/Icon/svg/functions/pdf.svg';
import pdfDarkSvg from '../../General/Icon/svg/functions/pdf_dark.svg';
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
    let imageAttachment;
    if (props.image) {
      imageAttachment = {};
      imageAttachment.data = props.image;
      imageAttachment.imageCollectionId = props.image.replace('/billede/', '').replace('/medium', '');
    }

    this.contentTextareaRef = null;
    this.groupPostFormRef = null;

    this.state = {
      text: props.text || '',
      attachment: {
        image: imageAttachment,
        video: null,
        review: null,
        pdf: props.pdf || null
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
    autosize(this.contentTextareaRef);
    if (this.contentTextareaRef && this.props.autofocus) {
      this.contentTextareaRef.focus();
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
      this.setState({
        isLoading: true,
        errorMsg: null
      });
      let form = this.groupPostFormRef;
      this.addContent(form, e.target.action)
        .then(response => {
          if (form.id.value === '') {
            // UploadComponent does upserts. checks on id null  . clear state to prepare for new
            this.setState({
              id: null,
              isLoading: false,
              text: '',
              attachment: {
                image: null,
                video: null,
                review: null
              }
            });
          }
          this.props.addContentAction(response);
          if (this.props.abort) {
            this.props.abort();
          }

          this.setState({isLoading: false});
        })
        .catch(response => {
          this.setState({errorMsg: response.errors[0].errorMessage});
          console.error(response.errors[0]); // eslint-disable-line
        });
    }
  }

  handleChange(review) {
    this.setState({attachment: Object.assign({}, this.state.attachment, {review})});
  }

  renderAddReviewModal() {
    const reviewRows = this.props.profile.reviews.data.map(review => {
      let work = this.props.works[review.pid];
      work = work || {title: '', creator: ''};
      work.title = work.title || '';
      work.creator = work.creator || '';

      let authorCreator = (
        <span>
          <div>
            <strong>{work.title}</strong>
          </div>
          <div>{work.creator}</div>
        </span>
      );

      return (
        <div key={`${review.id}`} className="attach-review-modal--review-row--container">
          <label htmlFor={`review-attachment--${review.id}`}>
            <table>
              <tbody>
                <tr onClick={this.handleChange.bind(this, review)}>
                  <td className="attach-review-modal--review--radio-btn">
                    <input
                      type="radio"
                      value={review.id}
                      checked={this.state.attachment.review && this.state.attachment.review.id === review.id}
                      name="reviewAttachment"
                      id={`review-attachment--${review.id}`}
                      className="attach-review-modal--radio-btn-input"
                    />
                    <span className="attach-review-modal--displayed-radio-btn" />
                  </td>
                  <td className="attach-review-modal--review--cover-image">
                    <img src={this.props.coverImages.pids[review.pid]} />
                  </td>
                  <td className="attach-review-modal--review--title-and-creator">{authorCreator}</td>
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
      <ModalWindow
        onClose={() =>
          this.setState({
            showAddReviews: false,
            attachment: Object.assign(this.state.attachment, {review: null})
          })}
        title="Indsæt Anmeldelse"
      >
        <div className="attach-review-modal--reviews-container">
          {reviewRows.length > 0 ? reviewRows : 'Vi kunne ikke finde nogen anmeldelser, prøv at oprette en ny!'}
        </div>
        {this.props.profile.reviews.data.length < this.props.profile.reviews.reviewsCount && (
          <div>
            <VisFlereButton
              onClick={() => this.props.getMoreWorks(this.props.profile.id, this.props.profile.reviews.data.length)}
              isLoading={this.props.profile.reviews.isLoading}
            />
          </div>
        )}
        <div className="attach-review-modal--buttons-container">
          <RoundedButton buttonText="OK" clickFunction={() => this.setState({showAddReviews: false})} />
        </div>
      </ModalWindow>
    );
  }

  handleFileChange(event) {
    return this.readInput(event, attachment =>
      this.setState({
        isLoading: true,
        attachment: Object.assign(this.state.attachment, attachment)
      })
    )
      .then(attachment =>
        this.setState({
          isLoading: false,
          attachment: Object.assign(this.state.attachment, attachment)
        })
      )
      .catch(errorMsg => {
        const state = {
          isLoading: false,
          errorMsg: errorMsg
        };

        if (errorMsg === 413) {
          state.attachment = Object.assign(this.state.attachment, {pdf: null});
          state.errorMsg = 'Denne PDF er fylder for meget! Den må maks fylde 32 MB.';
        }

        return this.setState(state);
      });
  }

  render() {
    const image = this.state.attachment.image || {};

    let deleteButton = null;
    if (this.props.delete) {
      deleteButton = (
        <a className="button delete" onClick={() => this.props.delete()}>
          <span>Slet</span>
        </a>
      );
    }
    else if (this.props.abort && this.props.displayAbortButton) {
      deleteButton = (
        <a className="button delete" onClick={() => this.props.abort()}>
          <span>Fortryd</span>
        </a>
      );
    }

    if (!this.props.profile.userIsLoggedIn || !this.props.profile.hasFilledInProfile) {
      return (
        <div className="content-add">
          <Login>Log ind for at skrive et indlæg</Login>
        </div>
      );
    }

    let mimetypes = 'image/*,video/*,video/mp4';
    if (this.props.pdfUploads) {
      mimetypes += ',application/pdf';
    }

    const uniqueId = `upload-media-${this.props.type}-${this.props.id || this.props.parentId}`;
    const progressStatusClass =
      this.state.attachment.video && this.state.attachment.video.file.progress === 100 ? 'done' : '';

    let work = {
      title: '',
      creator: ''
    };
    if (this.state.attachment && this.state.attachment.review) {
      work = this.props.works[this.state.attachment.review.pid] || work;
    }

    let containerClasses = 'content-add';
    let uploadButtonLabel = 'Billede / Video';
    let pdfLabel = '';
    if (this.props.pdfUploads) {
      pdfLabel = <Icon glyph={pdfSvg} />;
      uploadButtonLabel = 'Billede / Video / PDF';
    }

    if (this.props.editing) {
      uploadButtonLabel = '';
      containerClasses += ' editing';
    }

    return (
      <div className={containerClasses}>
        {this.state.showAddReviews && this.renderAddReviewModal()}

        <form
          method="POST"
          action={this.state.target}
          className={this.state.errorMsg ? 'shakeit' : ''}
          id="content_form_component"
          ref={groupPostForm => (this.groupPostFormRef = groupPostForm)}
          onSubmit={e => this.onSubmit(e)}
        >
          <div className="content-add--input">
            <input type="hidden" name="id" value={this.props.id} />
            <input type="hidden" name="imageId" value={image.imageCollectionId} />
            <input type="hidden" name="imageRemoved" value={this.state.imageRemoved} />
            <input type="hidden" name="pdfRemoved" value={this.state.attachment.pdf === 'removed'} />
            <input type="hidden" className="redirect" name="redirect" value={this.props.redirectTo} />
            <input type="hidden" name="parentId" value={this.props.parentId} />
            <input type="hidden" name="attachedReview" value={this.state.attachment.review && this.state.attachment.review.id ? this.state.attachment.review.id : ''} />
            <textarea
              className="content-add--textarea"
              ref={contentTextarea => (this.contentTextareaRef = contentTextarea)}
              name="content"
              placeholder="Gi den gas & hold god tone ;-)"
              value={this.state.text}
              disabled={this.state.disableInput}
              onChange={e => this.setState({text: e.target.value})}
            />
            {image.data && (
              <div className="content-add--preview-image">
                <img src={image.data} alt="preview" />
                <a href="#removeImage" className="content-add--remove-media" onClick={e => this.clearImage(e)}>
                  <Icon glyph={close} />
                </a>
              </div>
            )}

            <div className="preview-video">
              {this.state.attachment.video && (
                <div>
                  <span className="preview-video--name">{this.state.attachment.video.file.name}</span>
                  <progress
                    className={progressStatusClass}
                    max="100"
                    value={this.state.attachment.video.file.progress || 0}
                  />
                </div>
              )}
            </div>

            {this.state.attachment.review &&
            this.state.attachment.review !== 'removed' && (
                <div className="preview-review">
                  <div className="preview-review--cover-image--container">
                    <img src={this.props.coverImages.pids[this.state.attachment.review.pid]} />
                  </div>

                  <div className="preview-review--title--container">
                    <p>
                      <strong>{work.title}</strong>
                    </p>
                  </div>

                  <div className="preview-review--remove-btn">
                    <a
                      href="#removeReview"
                      className="content-add--remove-media"
                      onClick={() =>
                        this.setState({attachment: Object.assign(this.state.attachment, {review: 'removed'})})}
                    >
                      <Icon glyph={close} />
                    </a>
                  </div>
                </div>
              )}

            {this.state.attachment.pdf &&
            this.state.attachment.pdf !== 'removed' && (
                <div className="preview-pdf">
                  <div className="pdf-image">
                    <Icon glyph={pdfDarkSvg} height={60} width={60} />
                  </div>

                  <div className="pdf-title">
                    <p>
                      <strong>
                        {(this.state.attachment.pdf.file && this.state.attachment.pdf.file.name) ||
                      this.state.attachment.pdf.name}
                      </strong>
                    </p>
                  </div>

                  <div
                    className="pdf--remove-btn"
                    onClick={() => this.setState({attachment: Object.assign(this.state.attachment, {pdf: 'removed'})})}
                  >
                    <a href="#removePdf" className="content-add--remove-media">
                      <Icon glyph={close} />
                    </a>
                  </div>
                </div>
              )}
          </div>
          <div
            className={Classnames({
              'content-add--messages': true,
              fadein: this.state.errorMsg
            })}
          >
            {this.state.errorMsg && (
              <Message type="error" onClose={() => this.setState({errorMsg: null})}>
                {this.state.errorMsg}
              </Message>
            )}
          </div>
          <div className="content-add--actions">
            <div className="content-add--media">
              <label htmlFor={uniqueId}>
                {pdfLabel}
                <Icon glyph={cameraSvg} />
                <span className="content-add--media-label">{uploadButtonLabel}</span>
              </label>

              {this.props.type !== 'comment' && (
                <a
                  className="insert-review-button"
                  onClick={this.state.disableInput ? () => {} : () => this.setState({showAddReviews: true})}
                >
                  <img src="/attach_review.png" />
                  <span className="attach-review-button--text"> Anmeldelse </span>
                </a>
              )}
            </div>

            <button
              type="submit"
              className="button submit"
              id="submit-btn"
              disabled={
                (this.state.attachment.video &&
                  this.state.attachment.video.file.progress > 0 &&
                  this.state.attachment.video.file.progress < 100) ||
                this.state.isLoading ||
                this.state.disableInput
              }
            >
              {this.state.isLoading && <Icon glyph={spinner} />}
              OK
            </button>

            {deleteButton}
          </div>
        </form>

        <input
          id={uniqueId}
          accept={mimetypes}
          type="file"
          className="content-add--upload-media droppable-media-field--file-input"
          disabled={this.state.disableInput}
          onChange={this.handleFileChange.bind(this)}
          ref={fileInput => (this.fileInput = fileInput)}
        />
      </div>
    );
  }
}

AddContent.displayName = 'AddContent';
AddContent.propTypes = {
  abort: PropTypes.func,
  delete: PropTypes.func,
  addContentAction: PropTypes.func.isRequired,
  autofocus: PropTypes.bool,
  profile: PropTypes.object.isRequired,
  parentId: PropTypes.number.isRequired,
  redirectTo: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  text: PropTypes.string,
  image: PropTypes.string,
  pdf: PropTypes.object,
  id: PropTypes.number,
  getMoreWorks: PropTypes.func.isRequired,
  works: PropTypes.object,
  coverImages: PropTypes.object,
  displayAbortButton: PropTypes.bool,
  pdfUploads: PropTypes.bool,
  editing: PropTypes.bool
};

AddContent.defaultProps = {
  getMoreWorks: () => {},
  works: {},
  coverImages: {
    pids: {}
  },
  displayAbortButton: false,
  addContentAction: () => {
    console.error( // eslint-disable-line
      'YO DEV! You should provide your own addContentAction method. This is the default being called which shouldn\'t happen. Check your props!'
    );
  },
  editing: false
};
