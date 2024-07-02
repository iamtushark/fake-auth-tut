import React from 'react';
import { Container, ContainerProps } from '@mui/material';

interface CommonContainerProps extends ContainerProps {}

const CommonContainer: React.FC<CommonContainerProps> = ({ children, ...props }) => {
  return (
    <Container {...props}>
      {children}
    </Container>
  );
};

export default CommonContainer;
