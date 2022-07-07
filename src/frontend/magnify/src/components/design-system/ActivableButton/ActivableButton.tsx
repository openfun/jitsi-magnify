import styled from 'styled-components';
import { Button, ThemeType } from 'grommet';

const conditionalColor =
  (colorActive: string, colorInnactive: string) =>
  ({ theme, active }: { theme: ThemeType; active: boolean }) =>
    active
      ? theme?.global?.colors?.[colorActive] || colorActive
      : theme?.global?.colors?.[colorInnactive] || colorInnactive;

const ActivableButton = styled(Button)`
  background-color: ${conditionalColor('brand', 'transparent')};
  color: ${conditionalColor('light-1', 'dark-1')};
  & path {
    fill: ${conditionalColor('light-1', 'dark-1')};
  }
  border-color: ${conditionalColor('brand', 'transparent')};
  &:hover {
    background-color: ${conditionalColor('brand', 'light-2')};
    border-color: ${conditionalColor('brand', 'transparent')};
    box-shadow: ${(props: { theme: ThemeType; active: boolean }) =>
      props.active ? '0px 0px 0px 1px ' + props.theme?.global?.colors?.brand : 'none'};
  }
`;

export default ActivableButton;
