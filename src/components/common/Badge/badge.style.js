import styled from 'styled-components';
import { palette } from 'styled-theme';

const colors = {
  firewall: palette('primary', 0),
  metric: palette('success', 0),
  segment: palette('info', 0),
};

export const BadgeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 70px;
  height: 28px;
  border-radius: 14px;
  font-size: 12px;

  background-color: ${(props) => colors[props.type] || palette('primary', 0)};
  color: #fff;
`;
