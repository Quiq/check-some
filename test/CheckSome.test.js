// @flow
import * as React from 'react';
import CheckSome from '../src';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import type {ReactWrapper} from 'enzyme';

Enzyme.configure({adapter: new Adapter()});

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
  let wrapper: ReactWrapper;

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

    wrapper = mount(
      <CheckSome values={values} rules={rules}>
        {formProps => <TestForm {...formProps} />}
      </CheckSome>,
    );
  });

  it('renders the initial form', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('blurring the fields', () => {
    beforeEach(() => {
      wrapper.find('input').forEach(i => i.simulate('blur'));
    });

    it('sets the touched prop for fields', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('setting values to something still invalid', () => {
    beforeEach(() => {
      wrapper.setProps({
        values: {
          requiredString: 'spongebob',
          testNumber: -2,
          optionalString: 'patrick',
        },
      });
    });

    it('updates changed, values, and errors', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('setting values to something valid', () => {
    beforeEach(() => {
      wrapper.setProps({
        values: {
          requiredString: 'spongebob',
          testNumber: 7,
          optionalString: 'patrick',
        },
      });
    });

    it('updates changed, values, and errors', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
