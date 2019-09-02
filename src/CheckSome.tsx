import React, {createContext} from 'react';
import isEqual from 'lodash/isEqual';
import CheckSomeField from './Field';
import {ValidationErrors} from './globals';

type ValidationRule<T> = (value: T) => ValidationErrors | null;

type ValidationGroupValues<T> = {[K in keyof T]: T[K]};
type ValidationGroupRules<T> = Partial<{[K in keyof T]: Array<ValidationRule<T[K]>>}>;
type ValidationGroupErrors<T> = Partial<{[K in keyof T]: ValidationErrors}> | null;

export type CheckSomeChildProps<T> = {
  valid: boolean;
  changed: boolean;
  errors: ValidationGroupErrors<T>;
};

export type CheckSomeProps<T> = {
  rules: ValidationGroupRules<T>;
  values: ValidationGroupValues<T>;
  initialValues?: ValidationGroupValues<T>;
  children: (props: CheckSomeChildProps<T>) => React.ReactNode;
};

export const CheckSomeContext = createContext({});

export default class CheckSome<T> extends React.Component<CheckSomeProps<T>> {
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

  getErrors = (): ValidationGroupErrors<T> =>
    Object.keys(this.props.rules).reduce((errors: ValidationGroupErrors<T>, keyValue) => {
      // @ts-ignore
      const key: keyof T = keyValue;
      const rules = this.props.rules[key];
      const value = this.props.values[key];

      const newErrors = rules!.reduce(
        (e: ValidationErrors | null, rule: ValidationRule<T[typeof key]>) => e || rule(value),
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

const greaterThanZero = (value: number) => {
  return value > 0 ? null : {greaterThanZero: {value}};
};

const startsWith = (startingText: string) => (value: string) =>
  value.startsWith(startingText) ? null : {startsWith: {startingText, value}};

const tsCheck = (
  <CheckSome
    values={{
      stringField: 'string',
      numberField: 7,
    }}
    initialValues={{
      stringField: 'string',
      numberField: 7,
    }}
    rules={{
      stringField: [startsWith('test')],
      numberField: [greaterThanZero],
    }}
  >
    {() => <div />}
  </CheckSome>
);
