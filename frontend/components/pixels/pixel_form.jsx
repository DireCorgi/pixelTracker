import React from 'react';
import { Spinner2, Spinner5 } from '../spinners/spinners';
import CommentsContainer from './comments_container';
import TasksContainer from './tasks_container';
import { newPixelState, buttonName }
  from '../../util/pixel_state_util.js';
import ConfirmModal from './confirm_modal';
import {
  StateButton,
  OpenButton,
  LoadingSpinner,
  RejectButton,
  Comments,
} from './pixel_form_helper';

class PixelForm extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.formType === 'create') {
      this.state = {
        state: 'Unstarted',
        title: '',
        category: 'Feature',
        description: '',
        points: 0,
        icebox: true,
        id: "",
      };
    } else if (this.props.formType === 'update') {
      this.state = this.props.pixel;
    }

    this.mounted = true;
    this.deleted = false;

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handlePointsChange = this.handlePointsChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleNextState = this.handleNextState.bind(this);
  }

  resetState() {
    const defaultState = {
      state: 'Unstarted',
      title: '',
      category: 'Feature',
      description: '',
      points: 0,
      icebox: true,
      id: "",
    };
    if (this.props.formType === 'create'){
      this.setState(defaultState);
      this.props.hideForm();
    }
    this.props.resetPixelErrors();
    if (this.props.formType === 'update') {
      this.props.handleClick();
    }
  }

  componentDidMount() {
    this.props.resetPixelErrors();
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleNextState(nextState = null) {
    if (nextState === null) {
      nextState = newPixelState(this.state.state);
    }

    return (e) => {
      e.preventDefault();
      const target = e.currentTarget;
      target.disabled = true;
      const newState = nextState;
      let newOrd = this.state.pixel_ord;
      if (this.state.icebox) {
        newOrd = this.props.ords.maxBacklog + 1;
      }
      if (this.state.state === "Accepted") {
        newOrd = this.props.ords.maxBacklog + 1;
      }
      if (newState === "Accepted") {
        newOrd = this.props.ords.maxDone + 1;
      }
      if (nextState === 'Unstarted') {
        newOrd = this.props.ords.maxUnstarted + 1;
      }
      this.setState({ state: newState, icebox: false, pixel_ord: newOrd });
      this.props.startLoading(this.state.id);
      const pixel = { id: this.state.id, state: newState, icebox: false, pixel_ord: newOrd };
      this.props.updatePixel(pixel.id, pixel).then(
        () => {
          target.disabled = false;
          this.props.finishLoading(this.state.id);
          if (this.mounted)
            this.resetState();
        },
        () => {
          target.disabled = false;
          this.props.finishLoading(this.state.id);
          this.props.dragError();
        }
      );
    };
  }

  handleStateChange(e) {
    e.preventDefault();
    const target = e.currentTarget;
    const newState = e.currentTarget.value;
    let newOrd = this.state.pixel_ord;
    if (this.state.icebox) {
      newOrd = this.props.ords.maxBacklog + 1;
    }
    if (this.state.state === "Accepted") {
      newOrd = this.props.ords.maxBacklog + 1;
    }
    if (newState === "Accepted") {
      newOrd = this.props.ords.maxDone + 1;
    }
    if (newState === 'Unstarted') {
      newOrd = this.props.ords.maxUnstarted + 1;
    }
    this.setState({ state: newState });
    const pixel = { id: this.state.id, state: newState, icebox: false, pixel_ord: newOrd };
    this.props.startLoading(this.state.id);
    this.props.updatePixel(pixel.id, pixel).then(
      () => {
        target.disabled = false;
        this.props.finishLoading(this.state.id);
        if (this.mounted)
          this.resetState();
      },
      () => {
        target.disabled = false;
        this.props.finishLoading(this.state.id);
        this.props.dragError();
      }
    );
  }

  handleClick(e) {
    e.preventDefault();
    if (this.props.formType === 'update') {
      this.props.handleClick();
    } else if (this.props.formType === 'create') {
      this.resetState();
      this.props.hideForm();
    }
  }

  handleCategoryChange(e) {
    const newCategory = e.target.value;
    if (newCategory !== 'Feature')
      this.resetPoints();
    this.setState({ category: newCategory });
  }

  handlePointsChange(e) {
    const newPoints = parseInt(e.target.value);
    this.setState({ points: newPoints });
  }

  handleTitleChange(e) {
    const newTitle = e.currentTarget.value;
    this.setState({ title: newTitle });
  }

  handleDescriptionChange(e) {
    const newDescription = e.currentTarget.value;
    this.setState({ description: newDescription });
  }

  handleSubmit(e) {
    const target = e.currentTarget;
    e.preventDefault();
    target.disabled = true;
    const pixel = Object.assign({}, this.state);
    pixel.tasks_attributes = this.props.tasks;
    if (this.props.formType === 'create') {
      pixel.pixel_ord = this.props.ords.maxIcebox + 1;
      this.props.startLoading('new');
      this.props.createPixel(this.props.projectId, pixel).then(
        () => {
          target.disabled = false;
          this.resetState();
          this.props.finishLoading('new');
        },
        () => {
          target.disabled = false;
          this.props.finishLoading('new');
        }
      );
    } else if (this.props.formType === 'update') {
      this.props.startLoading(this.state.id);
      this.props.updatePixel(pixel.id, pixel).then(
        () => {
          target.disabled = false;
          this.props.finishLoading(this.state.id);
          if (this.mounted)
            this.resetState();
        },
        () => {
          target.disabled = false;
          this.props.finishLoading(this.state.id);
        }
      );
    }
  }

  handleDelete(e) {
    e.preventDefault();
    e.currentTarget.disabled = true;
    if (this.props.formType === 'update' && !this.deleted) {
      this.deleted = true;
      e.currentTarget.disabled = false;
      this.props.removePixel(this.state.id).then(() => {
        this.deleted = false;
      });
    }
  }

  resetPoints() {
    this.setState({ points: 0 });
  }

  titleClass() {
    if (this.props.errors.title === undefined) {
      return "";
    } else {
      return "errored-title";
    }
  }

  render() {
    const disabled = (this.state.category !== 'Feature');
    const stateDisabled = (this.props.formType === 'create');
    const buttonContent = <i className="material-icons">delete</i>;
    const buttonActive = this.props.formType === 'update';

    return (
      <form className='pixel-form'>
        <header className='pixel-form-title'>
          <OpenButton handleClick={this.handleClick} id={this.state.id} />
          <LoadingSpinner
            loading={this.props.loading}
            id={this.state.id}
            spinner={Spinner5} />
          <input type="text"
            value={this.state.title}
            onChange={this.handleTitleChange}
            placeholder='Pixel title'
            className={this.titleClass()}/>
        </header>
        <nav className="pixel-form-nav group">
          <div className="left-form-nav">
            <div className="id-number">ID: {this.state.id}</div>
            <ConfirmModal
              buttonClass="delete-button"
              buttonContent={buttonContent}
              message="Are you sure you want to delete this pixel?"
              callback={this.handleDelete}
              buttonActive={buttonActive}/>
          </div>
          <div className="right-form-nav">
            <button className="cancel-button" onClick={this.handleClick}>cancel</button>
            <button className="save-button" onClick={this.handleSubmit}>Save</button>
          </div>
        </nav>
        <section className="drop-down-features">
          <label>CATEGORY
            <select value={this.state.category}
              onChange={this.handleCategoryChange}>
              <option value="Feature">Feature</option>
              <option value="Bug">Bug</option>
              <option value="Chore">Chore</option>
              <option value="Release">Release</option>
            </select>
          </label>
          <label>POINTS
            <select value={this.state.points}
              onChange={this.handlePointsChange}
              disabled={disabled}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </label>
          <label>STATE
            <select value={this.state.state}
              onChange={this.handleStateChange}
              disabled={stateDisabled}>
              <option value="Unstarted">Unstarted</option>
              <option value="Started">Started</option>
              <option value="Finished">Finished</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
              <option value="Accepted">Accepted</option>
            </select>
            <RejectButton
              state={this.state.state}
              handleNextState={this.handleNextState} />
            <StateButton
              id={this.state.button}
              name={buttonName(this.state.state)}
              handleNextState={this.handleNextState} />
          </label>
        </section>
        <label>Description
          <textarea
            value={this.state.description}
            onChange={this.handleDescriptionChange} />
        </label>
        <TasksContainer pixelId={this.state.id}/>
        <Comments id={this.state.id} CommentsContainer={CommentsContainer} />
      </form>
    );
  }
}

export default PixelForm;
