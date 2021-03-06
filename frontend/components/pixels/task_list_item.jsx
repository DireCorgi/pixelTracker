import React from 'react';
import { connect } from 'react-redux';
import { updateTask, deleteTask } from '../../actions/pixel_actions';
import { Spinner4 } from '../spinners/spinners';
import ConfirmModal from './confirm_modal';
import CheckBox from './task_list_checkbox';
import TaskForm from './task_list_form';

class TaskListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      body: this.props.task.body,
      task_ord: this.props.task.task_ord,
      complete: this.props.task.complete,
      editMode: false,
      loading: false,
    };

    this.defaultBody = this.props.task.body;
    this.handleChange = this.handleChange.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    const newBody = e.currentTarget.value;
    this.setState({ body: newBody });
  }

  handleUpdate(e) {
    e.preventDefault();
    const target = e.currentTarget;
    target.disabled = true;
    if (this.props.task.id) {
      this.setState({ loading: true });
        this.props.updateTask({ body: this.state.body, id: this.props.task.id })
        .then( () => {
          target.disabled = false;
          this.setState({ loading: false, editMode: false });
        }
      );
    } else {
      this.props.updateNewTask(this.props.taskIndex, this.state.body );
      target.disabled = false;
      this.setState({ editMode: false });
    }
  }

  handleDelete(e) {
    e.preventDefault();
    const target = e.currentTarget;
    target.disabled = true;
    this.setState({ loading: true });
    if (this.props.task.id) {
      this.props.deleteTask(this.props.task.id).then(() => {
        this.props.removeTask(-1);
      });
    } else {
      this.props.removeTask(this.props.taskIndex);
    }
  }

  toggleComplete(e) {
    e.preventDefault();
    const target = e.currentTarget;
    target.disabled = true;
    const enable = () => { target.disabled = false; };
    if (this.state.complete === false) {
      this.setState({ complete: true });
      this.props.updateTask({ complete: true, id: this.props.task.id }).then(
        () => {
          enable();
          this.props.updateComplete(1);
        },
        enable
      );
    } else {
      this.setState({ complete: false });
      this.props.updateTask({ complete: false, id: this.props.task.id }).then(
        () => {
          enable();
          this.props.updateComplete(-1);
        },
        enable
      );
    }
  }

  toggleEdit(e) {
    e.preventDefault();
    if (this.state.editMode === false){
      this.defaultBody = this.state.body;
      this.setState({ editMode: true });
    } else {
      this.setState({ body: this.defaultBody });
      this.setState({ editMode: false });
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <section className="new-task-form task-list-item">
          <Spinner4 />
        </section>
      );
    }
    if (this.state.editMode) {
      return (
        <TaskForm
          complete={this.state.complete}
          toggleComplete={this.toggleComplete}
          id={this.props.task.id}
          body={this.state.body}
          handleChange={this.handleChange}
          toggleEdit={this.toggleEdit}
          handleUpdate={this.handleUpdate}/>
      );
    }
    let complete = "done";
    if (!this.state.complete) complete = "not done";
    let sectionClassName = "new-task-form task-list-item";
    if (this.state.complete) sectionClassName += " complete-task";
    const buttonContent = <i className="material-icons">delete</i>;
    return (
      <section className={sectionClassName}>
      <CheckBox
        complete={this.state.complete}
        toggleComplete={this.toggleComplete}
        active={this.props.task.id}/>
        <p>{this.state.body}</p>
        <button
          className="edit-button"
          onClick={this.toggleEdit}>
          <i className="material-icons">mode_edit</i>
        </button>
        <ConfirmModal
          buttonClass="edit-button"
          buttonContent={buttonContent}
          message="Are you sure you want to delete this task?"
          callback={this.handleDelete}
          buttonActive="true"/>
      </section>
    );
  }
}

export default TaskListItem;
