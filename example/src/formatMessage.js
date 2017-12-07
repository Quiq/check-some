/**
 * Stub out formatMessage so that it will return the defaultMessage with basic variable replacement
 */
export default (msg: IntlMessage, values?: {[key: string]: string}) => {
  if (!values) {
    return msg.defaultMessage;
  }

  let returnValue = msg.defaultMessage;
  Object.keys(values).forEach(key => {
    if (values) {
      const value = values[key];
      returnValue = returnValue.replace(`{${key}}`, value);
    }
  });

  return returnValue;
};
