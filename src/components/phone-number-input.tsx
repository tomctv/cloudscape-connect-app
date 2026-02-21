import {
  borderRadiusInput,
  colorBackgroundInputDefault,
  colorBorderInputDefault,
  colorBorderInputFocused,
  colorTextInputPlaceholder,
  lineHeightBodyM,
  spaceStaticS,
  spaceStaticXxs,
} from "@cloudscape-design/design-tokens";
import type { ComponentProps } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import styled from "styled-components";

type PhoneInputProps = ComponentProps<typeof PhoneInput>;

const StyledPhoneInput = styled(PhoneInput)<PhoneInputProps>`
  background-color: ${colorBackgroundInputDefault};
  border: 1px solid ${colorBorderInputDefault};
  border-radius: ${borderRadiusInput};
  padding: ${spaceStaticXxs} ${spaceStaticS};
  outline-offset: -1px;

  &:focus-within {
    outline: 2px solid ${colorBorderInputFocused} !important;
  }

  input {
    border: none;
    line-height: ${lineHeightBodyM};

    &:focus {
      outline: none;
    }

    &::placeholder {
      font-style: italic;
      color: ${colorTextInputPlaceholder};
    }
  }
`;

export const PhoneNumberInput: React.FC<PhoneInputProps> = (props) => {
  return <StyledPhoneInput {...props} />;
};
