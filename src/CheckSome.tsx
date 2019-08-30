import React, {createContext} from 'react';
import isEqual from 'lodash/isEqual';
import CheckSomeField from './Field';
import {ValidationErrors} from './globals';

type ValidationRule = (value: any) => ValidationErrors | null;

type ValidationGroupRules = {[name: string]: Array<ValidationRule>};
type ValidationGroupErrors = {[name: string]: ValidationErrors} | null;

export type CheckSomeChildProps = {
  valid: boolean;
  changed: boolean;
  errors: ValidationGroupErrors;
};

export type CheckSomeProps = {
  rules: ValidationGroupRules;
  values: {[key: string]: any}; // TODO: Get a better type here
  initialValues?: {[key: string]: any};
  children: (props: CheckSomeChildProps) => React.ReactNode;
};

interface Context {
  values: {[key: string]: any};
  errors: ValidationGroupErrors;
}

export const CheckSomeContext = createContext<Context>({values: {}, errors: {}});

export default class CheckSome extends React.Component<CheckSomeProps> {
  static Field = CheckSomeField;

  static defaultProps = {
    rules: {},
  };

  initialValues: Object | null | undefined;

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
    Object.keys(this.props.rules).reduce((errors: ValidationGroupErrors, key) => {
      const rules = this.props.rules[key];
      const value = this.props.values[key];

      const newErrors = rules.reduce(
        (e: ValidationErrors | null, rule: ValidationRule) => e || rule(value),
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

    return (
      <CheckSomeContext.Provider value={{values, errors}}>
        {this.props.children({valid, errors, changed})}
      </CheckSomeContext.Provider>
    );
  }
}
