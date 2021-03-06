import React from 'react';

class ErrorHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {reload: false, ignore: false };
    this.reloadPage = this.reloadPage.bind(this);
    this.ignoreErrors = this.ignoreErrors.bind(this);
  }

  reloadPage(e) {
    this.setState({ reload: true });
    window.location.reload(true);
  }

  ignoreErrors() {
    this.props.clearErrors();
  }

  render() {
    return(
      <section className="errors-header">
        Something went wrong. Your changes were not saved. Please reload the page.
        <button
          className="errors-reload-button"
          onClick={this.reloadPage}
          disabled={this.state.reload}>
          Reload
        </button>
        <button
          className="errors-ignore-button"
          onClick={this.ignoreErrors}
          disabled={this.state.ignore}>
          Ignore
        </button>
      </section>
    );
  }
}

export default ErrorHeader;
