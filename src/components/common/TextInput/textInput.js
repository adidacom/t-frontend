import React from 'react';
import styled from 'styled-components';

const TextInputContainer = styled.input`
  display: inline-block;
  padding: 0 20px;
  outline: none;
  border: none;
  border-radius: 28px;
  background-color: white;
  color: #222B45;
  width: 264px;
  height: 40px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0px 2px 24px 4px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 2px 24px 4px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px 2px 24px 4px rgba(0, 0, 0, 0.1);
  transition-duration: 300ms;
`;

const TextInput = (props) => {
  const { placeholder, onChange } = props;

  return (
    <TextInputContainer
      placeholder={placeholder}
      type="password"
      onChange={onChange}
      {...props}
    />
  );
};

export default TextInput;
