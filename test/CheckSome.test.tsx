import React from 'react';
import CheckSome from '../src';
import {render, fireEvent, RenderResult} from '@testing-library/react';

const required = value => (value || value === 0 ? null : {required: {}});

const greaterThanZero = (value: number) => (value > 0 ? null : {greaterThanZero: {value}});

const TestField = ({value, errors, valid, touched}) => (
  <div className="field">
    <input defaultValue={value} />
    <div>Field {valid ? 'Valid' : 'Invalid'}</div>
    <div>{touched ? 'Touched' : 'Pristine'}</div>
    <div>Field Errors: {JSON.stringify(errors)}</div>
  </div>
);

const TestForm = ({valid, changed, errors}) => (
  <form>
    <div>Form {valid ? 'Valid' : 'Invalid'}</div>
    <div>{changed ? 'Changed' : 'Unchanged'}</div>
    <div>Form Errors: {JSON.stringify(errors)}</div>

    <CheckSome.Field name="requiredString">
      {fieldProps => <TestField {...fieldProps} />}
    </CheckSome.Field>

    <CheckSome.Field name="testNumber">
      {fieldProps => <TestField {...fieldProps} />}
    </CheckSome.Field>

    <CheckSome.Field name="optionalString">
      {fieldProps => <TestField {...fieldProps} />}
    </CheckSome.Field>
  </form>
);

describe('CheckSome', () => {
  let r: RenderResult;
  let testProps;

  beforeEach(() => {
    const values = {
      requiredString: '',
      testNumber: undefined,
      optionalString: '',
    };

    const rules = {
      requiredString: [required],
      testNumber: [required, greaterThanZero],
    };

    testProps = {values, rules};

    r = render(<CheckSome {...testProps}>{formProps => <TestForm {...formProps} />}</CheckSome>);
  });

  it('renders the initial form', () => {
    expect(r.container).toMatchSnapshot();
    expect(r.getAllByText('Pristine').length).toBe(3);
  });

  describe('blurring the fields', () => {
    beforeEach(() => {
      r.container.querySelectorAll('input').forEach(i => fireEvent.blur(i));
    });

    it('sets the touched prop for fields', () => {
      expect(r.container).toMatchSnapshot();
      expect(r.getAllByText('Touched').length).toBe(3);
    });
  });

  describe('setting values to something still invalid', () => {
    beforeEach(() => {
      testProps.values = {
        requiredString: 'spongebob',
        testNumber: -2,
        optionalString: 'patrick',
      };
      r.rerender(<CheckSome {...testProps}>{formProps => <TestForm {...formProps} />}</CheckSome>);
    });

    it('updates changed, values, and errors', () => {
      expect(r.container).toMatchSnapshot();
    });
  });

  describe('setting values to something valid', () => {
    beforeEach(() => {
      testProps.values = {
        requiredString: 'spongebob',
        testNumber: 7,
        optionalString: 'patrick',
      };
      r.rerender(<CheckSome {...testProps}>{formProps => <TestForm {...formProps} />}</CheckSome>);
    });

    it('updates changed, values, and errors', () => {
      expect(r.container).toMatchSnapshot();
    });
  });
});
