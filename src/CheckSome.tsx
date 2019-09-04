import React, {createContext, useState} from 'react';
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

interface CheckSomeOptions<T> {
  rules: ValidationGroupRules<T>;
  values: ValidationGroupValues<T>;
  initialValues?: ValidationGroupValues<T>;
}

export interface CheckSomeProps<T> extends CheckSomeOptions<T> {
  children: (props: CheckSomeChildProps<T>) => React.ReactNode;
}

export const CheckSomeContext = createContext<{
  values: {[key: string]: any};
  errors: {[key: string]: ValidationErrors | undefined} | null;
}>({values: {}, errors: {}});

function useValidation<T>({rules, values, initialValues}: CheckSomeOptions<T>) {
  const [compareAgainst] = useState(initialValues || values);

  const errors: ValidationGroupErrors<T> = Object.keys(rules).reduce(
    (errors: ValidationGroupErrors<T>, keyValue) => {
      // @ts-ignore
      const key: keyof T = keyValue;
      const ruleList = rules[key];
      const value = values[key];

      const newErrors = ruleList!.reduce(
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
    },
    null,
  );

  const valid = !errors;
  const changed = !isEqual(values, compareAgainst);

  return {valid, errors, changed};
}

export const CheckSome = <T extends {}>({
  rules,
  values,
  initialValues,
  children,
}: CheckSomeProps<T>) => {
  const {valid, errors, changed} = useValidation({rules, values, initialValues});

  return (
    <CheckSomeContext.Provider value={{values, errors}}>
      {children({valid, errors, changed})}
    </CheckSomeContext.Provider>
  );
};
CheckSome.Field = CheckSomeField;

export default CheckSome;
