import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import useRegister from '../../hooks/useRegister';
import { LoginFormInterface } from './Interfaces';
import LoginFormSchema from './ValidationSchema';
import { getLoggedInUserInfo } from '../../utils/dbOperations/dbOperations';
import CommonBlackSubmitButton from '../../Components/Common/CommonBlackSubmitButton';
import CommonTextField from '../../Components/Common/CommonTextField';
import CommonCard from '../../Components/Common/CommonCard';
import CommonCardContent from '../../Components/Common/CommonCardContent';
import CommonFormBox from '../../Components/Common/CommonFormBox';
import CommonContainer from '../../Components/Common/CommonContainer';
import CommonErrorTypography from '../../Components/Common/CommonErrorTypography';
import CommonHeadingTypography from '../../Components/Common/CommonHeadingTypography';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInterface>({
    resolver: yupResolver(LoginFormSchema),
  });
  const { register: login, loading, error } = useRegister('login');

  const onSubmit = async (data: LoginFormInterface) => {
    try {
      await login(data);
      const user = await getLoggedInUserInfo();
      if (user?.authLevel === 'admin') {
        navigate('/user-list');
      } else if (user?.authLevel === 'users') {
        navigate(`/profile/${user.id}`);
      }
    } catch (err) {

    }
  };

  return (
    <CommonFormBox>
      <CommonContainer>
        <CommonCard>
          <CommonCardContent>
            <CommonHeadingTypography>Login</CommonHeadingTypography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CommonTextField name="email" control={control} label="Email" />

                </Grid>
                <Grid item xs={12}>
                  <CommonTextField name="password" control={control} label="Password" type='password' />
                </Grid>
                <Grid item xs={12}>
                  <CardActions>
                    <CommonBlackSubmitButton loading={loading} text="Log In" />
                  </CardActions>
                </Grid>
              </Grid>
            </Box>
            {error && <CommonErrorTypography>{error}</CommonErrorTypography>}
          </CommonCardContent>
        </CommonCard>
      </CommonContainer>
    </CommonFormBox>
  );
};

export default LoginPage;
