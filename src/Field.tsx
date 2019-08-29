import React from 'react';
import * as PropTypes from 'prop-types';
import {CHECK_SOME_CONTEXT} from './globals';
import {ValidationErrors} from './globals';

type CheckSomeFieldChildProps<T> = {
  value: T,
  errors: ValidationErrors | null,
  touched: boolean,
  valid: boolean,
};

type Props = {
  name: string,
  children: (props: CheckSomeFieldChildProps<any>) => React.ReactNode,
};

type State = {
  touched: boolean,
};

export default class CheckSomeField extends React.Component<Props, State> {
  state = {
    touched: false,
  };

  static contextTypes = {
    [CHECK_SOME_CONTEXT]: PropTypes.object.isRequired,
  };

  markFieldTouched = () => {
    this.setState({touched: true});
  };

  render() {
    const {values, errors: formErrors} = this.context[CHECK_SOME_CONTEXT];
    const {name} = this.props;
    const {touched} = this.state;
    const value = values[name];
    const errors = formErrors ? formErrors[name] : null;
    const valid = !errors;

    return (
      <div className="CheckSomeField" onBlur={this.markFieldTouched}>
        {this.props.children({value, errors, touched, valid})}
      </div>
    );
  }
}
