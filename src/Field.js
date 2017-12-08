// @flow
import * as React from 'react';
import * as PropTypes from 'prop-types';
import {CHECK_SOME_CONTEXT} from './globals';
import type {ValidationErrors} from './globals';

type CheckSomeFieldChildProps<T> = {
  value: T,
  errors: ValidationErrors | null,
  touched: boolean,
  valid: boolean,
};

type CheckSomeFieldProps = {
  name: string,
  children: (props: CheckSomeFieldChildProps<*>) => React.Node,
};

type CheckSomeFieldState = {
  touched: boolean,
};

export default class CheckSomeField extends React.Component<
  CheckSomeFieldProps,
  CheckSomeFieldState,
> {
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
