import React from 'react';
import styled from 'styled-components';

const styles = {
  primary: {
    borderColor: '#222B45',
    backgroundColor: '#222B45',
  },
  ghost: {
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  disabled: {
    borderColor: '#777777',
    backgroundColor: '#777777',
  },
};

const ButtonContainer = styled.button`
  display: inline-block;
  margin: 7px 5px;
  outline: none;
  border-width: 2px;
  border-color: ${(props) =>
    props.disabled ? styles['disabled'].borderColor : styles[props.variant].borderColor};
  border-radius: 20px;
  background-color: ${(props) =>
    props.disabled
      ? styles['disabled'].backgroundColor
      : props.outline
      ? 'transparent'
      : styles[props.variant].backgroundColor};
  color: ${(props) => props.outline ? styles[props.variant].borderColor : 'white'};
  width: 125px;
  height: 40px;
  font-size: 14px;
  transition-duration: 300ms;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? '' : props.variant === 'ghost' ? 'transparent' : '#424B85'};
  }
`;

const Button = (props) => {
  const { label, onClick } = props;

  return (
    <ButtonContainer onClick={onClick} {...props}>
      {label}
    </ButtonContainer>
  );
};

export default Button;
