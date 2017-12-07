# check-some

> TODO: Component Description

> TODO: Badges

## Install

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

class Form extends Component {
  render() {
    return (
      <CheckSome values={{}} rules={{}}>
        {({valid, changed}) => (
          <form>
            <CheckSome.Field name="name">
              {({value, errors, valid, touched}) => (
                <div className="field">
                  <label>
                    <input value={value} />
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

## License

MIT
