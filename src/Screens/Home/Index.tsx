import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import CommonBlackSubmitButton from '../../Components/Common/CommonBlackSubmitButton';
import CommonCard from '../../Components/Common/CommonCard';
import CommonCardContent from '../../Components/Common/CommonCardContent';
import CommonFormBox from '../../Components/Common/CommonFormBox';
import CommonContainer from '../../Components/Common/CommonContainer';
import CommonHeadingTypography from '../../Components/Common/CommonHeadingTypography';

const LoginPromptPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <CommonFormBox>
      <CommonContainer>
        <CommonCard>
          <CommonCardContent>
            <CommonHeadingTypography>Login to Continue</CommonHeadingTypography>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CardActions>
                    <CommonBlackSubmitButton onClick={handleLogin} text="Login" loading={false} />
                  </CardActions>
                </Grid>
              </Grid>
            </Box>
          </CommonCardContent>
        </CommonCard>
      </CommonContainer>
    </CommonFormBox>
  );
};

export default LoginPromptPage;
