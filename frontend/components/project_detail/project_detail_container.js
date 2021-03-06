import { connect } from 'react-redux';
import { selectAllProjects } from '../../reducers/selector';
import { fetchOneProject, resetProjectErrors } from '../../actions/project_actions';
import { fetchPixels } from '../../actions/pixel_actions';
import { receiveNewHeaderType } from '../../actions/header_actions';
import { resetPixels } from '../../actions/pixel_actions';
import ProjectDetail from './project_detail';

const mapStateToProps = (state) => {
  return {
    projectsList: state.projects.projectList,
    projectsAll: selectAllProjects(state),
    errors: state.projects.errors,
    loading: state.loading.projectsLoading,
    pixelsLoading: state.loading.pixelsLoading,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {

  return  {
    fetchProject: (projectId) => dispatch(fetchOneProject(projectId)),
    changeHeader: (headerType) => dispatch(receiveNewHeaderType(headerType)),
    resetProjectErrors: () => dispatch(resetProjectErrors()),
    fetchPixels: (projectId) => dispatch(fetchPixels(projectId)),
    resetPixels: () => dispatch(resetPixels()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
