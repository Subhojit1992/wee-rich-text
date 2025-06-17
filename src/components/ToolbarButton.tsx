import React from 'react';
import styled from '@emotion/styled';

const StyledButton = styled.button<{ disabled?: boolean; active?: boolean }>`
  padding: 6px 12px;
  margin: 2px;
  border: 1px solid ${props => props.active ? '#007bff' : '#ccc'};
  border-radius: 4px;
  background-color: ${props => {
    if (props.disabled) return '#f5f5f5';
    if (props.active) return '#007bff';
    return '#fff';
  }};
  color: ${props => props.active ? '#fff' : '#000'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => {
      if (props.active) return '#0056b3';
      return '#f8f9fa';
    }};
    border-color: ${props => props.active ? '#0056b3' : '#007bff'};
  }

  &:active:not(:disabled) {
    background-color: ${props => {
      if (props.active) return '#004085';
      return '#e9ecef';
    }};
    transform: translateY(1px);
  }

  &:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }
`;

export interface ToolbarButtonProps {
  command: string;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  onClick: (command: string) => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  command,
  title,
  children,
  disabled = false,
  active = false,
  onClick,
}) => (
  <StyledButton
    type="button"
    onClick={() => onClick(command)}
    disabled={disabled}
    active={active}
    title={title}
    onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
  >
    {children}
  </StyledButton>
);

export default ToolbarButton; 