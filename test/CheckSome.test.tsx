import React, {useState} from 'react';
import CheckSome from '../src';
import {render, fireEvent} from '@testing-library/react';

const required = value => (value || value === 0 ? null : {required: {}});

const greaterThanZero = (value: number) => (value > 0 ? null : {greaterThanZero: {value}});

const TestField = ({label, value, onValueChanged, errors, valid, touched}) => (
  <div className="field">
    <label>
      {label}
      <input
        value={value}
        onChange={e => {
          const {value} = e.target;
          onValueChanged(value);
        }}
      />
    </label>
    <div>Field {valid ? 'Valid' : 'Invalid'}</div>
    <div>{touched ? 'Touched' : 'Pristine'}</div>
    <div>Field Errors: {JSON.stringify(errors)}</div>
  </div>
);

const TestForm = ({values, rules, initialValues = undefined}) => {
  const [requiredStringValue, setRequiredStringValue] = useState(values.requiredString);
  const [numberValue, setNumberValue] = useState(values.testNumber);
  const [optionalStringValue, setOptionalStringValue] = useState(values.optionalString);

  return (
    <CheckSome
      values={{
        requiredString: requiredStringValue,
        testNumber: numberValue,
        optionalString: optionalStringValue,
      }}
      rules={rules}
      initialValues={initialValues}
    >
      {({valid, changed, errors}) => (
        <form>
          <div>Form {valid ? 'Valid' : 'Invalid'}</div>
          <div>{changed ? 'Changed' : 'Unchanged'}</div>
          <div>Form Errors: {JSON.stringify(errors)}</div>

          <CheckSome.Field name="requiredString">
            {fieldProps => (
              <TestField
                label="Required String"
                value={requiredStringValue}
                onValueChanged={setRequiredStringValue}
                {...fieldProps}
              />
            )}
          </CheckSome.Field>

          <CheckSome.Field name="testNumber">
            {fieldProps => (
              <TestField
                label="Test Number"
                value={numberValue.toString()}
                onValueChanged={v => setNumberValue(Number.parseInt(v))}
                {...fieldProps}
              />
            )}
          </CheckSome.Field>

          <CheckSome.Field name="optionalString">
            {fieldProps => (
              <TestField
                label="Optional String"
                value={optionalStringValue}
                onValueChanged={setOptionalStringValue}
                {...fieldProps}
              />
            )}
          </CheckSome.Field>
        </form>
      )}
    </CheckSome>
  );
};

const initialValues = {requiredString: '', testNumber: 0, optionalString: ''};

const testRules = {requiredString: [required], testNumber: [greaterThanZero]};

function updateField(field: HTMLElement, value: string) {
  fireEvent.focus(field);
  fireEvent.change(field, {target: {value}});
  fireEvent.blur(field);
}

test('initial rendering', () => {
  const {container, queryByText} = render(<TestForm values={initialValues} rules={testRules} />);

  expect(queryByText('Form Invalid')).not.toBeNull();
  expect(queryByText('Touched')).toBeNull();

  expect(container).toMatchSnapshot();
});

test('marking the fields touched', () => {
  const {container, getByLabelText, queryAllByText} = render(
    <TestForm values={initialValues} rules={testRules} />,
  );

  fireEvent.focus(getByLabelText('Required String'));
  fireEvent.blur(getByLabelText('Required String'));

  fireEvent.focus(getByLabelText('Test Number'));
  fireEvent.blur(getByLabelText('Test Number'));

  fireEvent.focus(getByLabelText('Optional String'));
  fireEvent.blur(getByLabelText('Optional String'));

  expect(queryAllByText('Touched').length).toBe(3);
  expect(container).toMatchSnapshot();
});

test('setting the fields to valid values', () => {
  const {container, getByLabelText, queryByText} = render(
    <TestForm values={initialValues} rules={testRules} />,
  );

  updateField(getByLabelText('Required String'), 'spongebob');
  updateField(getByLabelText('Test Number'), '7');
  updateField(getByLabelText('Optional String'), 'patrick');

  expect(queryByText('Form Valid')).not.toBeNull();
  expect(container).toMatchSnapshot();
});

test('setting the fields to invalid values', () => {
  const {container, getByLabelText, queryByText} = render(
    <TestForm values={initialValues} rules={testRules} />,
  );

  updateField(getByLabelText('Required String'), 'spongebob');
  updateField(getByLabelText('Test Number'), '-2');
  updateField(getByLabelText('Optional String'), 'patrick');

  expect(queryByText('Form Invalid')).not.toBeNull();
  expect(container).toMatchSnapshot();
});

test('using initialValues prop', () => {
  const values = {
    requiredString: 'spongebob',
    testNumber: '7',
    optionalString: 'patrick',
  };

  const {container, queryByText} = render(
    <TestForm values={{...values}} rules={testRules} initialValues={{...values}} />,
  );

  expect(queryByText('Form Valid')).not.toBeNull();
  expect(queryByText('Unchanged')).not.toBeNull();
  expect(queryByText('Touched')).toBeNull();

  expect(container).toMatchSnapshot();
});
