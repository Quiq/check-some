import React, {useState, useContext} from 'react';
import {CheckSomeContext} from './CheckSome';
import {ValidationErrors} from './globals';

type CheckSomeFieldChildProps<T> = {
  value: T;
  errors: ValidationErrors | null;
  touched: boolean;
  valid: boolean;
};

type Props = {
  name: string;
  children: (props: CheckSomeFieldChildProps<any>) => React.ReactNode;
};

const CheckSomeField = ({name, children}: Props) => {
  const [touched, setTouched] = useState(false);
  const {values, errors: formErrors} = useContext(CheckSomeContext);
  const value = values[name];
  const errors = (formErrors && formErrors[name]) || null;
  const valid = !errors;

  return (
    <div className="CheckSomeField" onBlur={() => setTouched(true)}>
      {children({value, errors, touched, valid})}
    </div>
  );
};

export default CheckSomeField;
