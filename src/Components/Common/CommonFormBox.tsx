import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface CommonBoxProps extends BoxProps {}

const CommonFormBox: React.FC<CommonBoxProps> = ({ children, ...props }) => {
  return (
    <Box {...props} sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', display: 'flex', alignItems: 'center', ...props.sx }}>
      {children}
    </Box>
  );
};

export default CommonFormBox;
