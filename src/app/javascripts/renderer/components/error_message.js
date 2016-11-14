import React, { PropTypes } from 'react';
import ErrorIcon from 'material-ui/svg-icons/alert/error';

const errorMsgStyle = {
  display: 'flex',
  alignItems: 'center',
  height: '20px',
  color: '#ff3333',
};

const ErrorMessage = (props) => {
  const style = Object.assign(errorMsgStyle, props.style);
  if (!props.message) {
    return null;
  }
  return (
    <span style={style}>
      <ErrorIcon color={style.color}/>
      <p>{props.message}</p>
    </span>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  style: PropTypes.object,
};

export default ErrorMessage;
