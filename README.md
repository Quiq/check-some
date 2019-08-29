# check-some

## Component to help with form validation in react

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://travis-ci.org/Quiq/check-some.svg?branch=master)](https://travis-ci.org/Quiq/check-some)

## Our pain points

When dealing with forms in react, forms with validation can involve a lot of code duplication. If you add a required field to your form, you need to add the input for the new field, add logic to check if there is a valid value, disable the submit button until there is a valid value, show a validation error by the field if they leave the field blank, and maybe change logic to show a cancel button if the field has changed.

This can become quite a bit of work to add a single field and if you miss a spot your form could act inconsistently (i.e. Your submit button could be enabled when it's not supposed to).

## Our solution

This component receives the values and validation rules as props and renders your validated form using render props. The `CheckSome` component performs all the data validation and passes form state (such as `valid` or `changed`) to the form. The `CheckSome.Field` component accepts a render prop to render a specific field along with any validation errors and whether the field has been touched yet. This solution abstracts the validation logic while keeping flexibility for how to render error messages.

## Installation

```bash
npm install --save check-some
```

or

```
yarn add check-some
```

## Usage

```jsx
import React, {Component} from 'react';
import CheckSome from 'check-some';

const required =  => value => {
  return value || value === 0 ? null : {required: {}};
};

class Form extends Component {
  render() {
    return (
      <CheckSome values={{name: this.state.name}} rules={{name: [required]}}>
        {({valid, changed}) => (
          <form>
            <CheckSome.Field name="name">
              {({value, errors, valid, touched}) => (
                <div className="field">
                  <label>
                    <input value={value} onChange={this.updateName}/>
                    {valid ? '👍' : '👎'}
                    {touched &&
                      errors &&
                      errors.required && <div className="error">Name is required.</div>}
                  </label>
                </div>
              )}
            </CheckSome.Field>

            {changed && <button onClick={this.resetForm}>Cancel</button>}
            <button onClick={this.submit} disabled={!valid || !changed}>
              Submit
            </button>
          </form>
        )}
      </CheckSome>
    );
  }
}
```

### Error descriptions

Validation rules are defined as functions that take the value of a field and return `null` (if the field is valid) or an object containing any information that could be important for showing an error message. For example, a number field that is required and needs to be greater than 5, but has a value of 2 could be:

```jsx
{
  required: null,
  greaterThanFive: {value: 2},
}
```

You could then use this to render a cusomized error message

```jsx
{errors && errors.greaterThanFive && (
  <div>Value needs to be greater than 5, but was {errors.greaterThanFive.value}.</div>
)}
```

## Components

### `CheckSome`

#### Props

##### `values` - Object containing all the values of the form
```
{[key:string]: any}
```

#### `rules` (optional) - Object containing rules for all values (keys should match values set in `values`)
```
{[key:string]: null | {[errorName:string]: Object}}
```

##### `initialValues` (optional) - Object containing values to check against when finding out if form has changed
```
{[key:string]: any}
```

##### `children` - Render prop for rendering the form
```
(props: ChildProps) => React.Node
```

#### ChildProps (Props that will be passed to the render prop for `CheckSome`)

##### `valid` - If all the validation rules have passed
`boolean`

##### `changed` - If all the values have changed since the component mounted (or if the same as `props.initialValues` if set)
`boolean`

##### `errors` - Description of all the validation errors by field
```
{
  [key:string]: null | {[errorName:string]: Object}
}
```

### CheckSome.Field

#### Props

##### `name` - The field to render (needs to match a key in `values` passed to `CheckSome`)

##### `children` - Render prop for rendering the field
```
(props: ChildProps) => React.Node
```

#### ChildProps

##### `value` - The value passed in `values` of `CheckSome` that matches the name set in `CheckSome.Field`
`any`

##### `errors` - Description of the validation errors for the field
```
null | {[errorName:string]: Object}
```

##### `valid` - If the validation rules for the field have passed
`boolean`

##### `touched` - If the field has been focused and blured
`boolean`

## License

MIT
