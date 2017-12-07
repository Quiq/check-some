// @flow
import * as React from 'react';
import * as PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

const CHECK_SOME_CONTEXT = '__check_some__';

type ValidationErrors = {[key: string]: Object}; // TODO: Check object shape somehow

type ValidationRule<T> = (value: T) => ValidationErrors | null;

type ValidationGroupRules = {[name: string]: Array<ValidationRule<*>>};
type ValidationGroupErrors = {[name: string]: ValidationErrors} | null;

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

class CheckSomeField extends React.Component<CheckSomeFieldProps, CheckSomeFieldState> {
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

export type CheckSomeChildProps = {
  valid: boolean,
  changed: boolean,
  errors: ValidationGroupErrors,
};

export type CheckSomeProps = {
  rules: ValidationGroupRules,
  values: Object, // TODO: Get a better type here
  initialValues?: Object,
  children: (props: CheckSomeChildProps) => React.Node,
};

/* eslint-disable react/no-multi-comp */
export default class CheckSome extends React.Component<CheckSomeProps> {
  static Field = CheckSomeField;
  static childContextTypes = {
    [CHECK_SOME_CONTEXT]: PropTypes.object.isRequired,
  };

  initialValues: ?Object;

  getChildContext() {
    return {
      [CHECK_SOME_CONTEXT]: {
        values: this.props.values,
        errors: this.getErrors(),
      },
    };
  }

  getInitialValues = () => {
    if (this.props.initialValues) {
      return this.props.initialValues;
    }

    if (!this.initialValues) {
      this.initialValues = this.props.values;
    }

    return this.initialValues;
  };

  getErrors = (): ValidationGroupErrors =>
    Object.keys(this.props.rules).reduce((errors, key) => {
      const rules = this.props.rules[key];
      const value = this.props.values[key];

      const newErrors = rules.reduce(
        (e: ValidationErrors | null, rule: ValidationRule<*>) => e || rule(value),
        null,
      );

      if (!newErrors) {
        return errors;
      }
      if (!errors) {
        // Initialize error object if this is the first error
        errors = {};
      }

      errors[key] = newErrors;

      return errors;
    }, null);

  render() {
    const {values} = this.props;

    const errors = this.getErrors();
    const valid = !errors;

    const changed = !isEqual(values, this.getInitialValues());

    return this.props.children({valid, errors, changed});
  }
}
