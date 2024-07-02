import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import MenuItem from '@mui/material/MenuItem';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { generateKey } from '../../utils/generateKey';
import useRegister from '../../hooks/useRegister';
import { RegisterForm } from './Interfaces';
import SignupSchema from './ValidationSchema';
import CommonBlackSubmitButton from '../../Components/Common/CommonBlackSubmitButton';
import CommonTextField from '../../Components/Common/CommonTextField';
import CommonCard from '../../Components/Common/CommonCard';
import CommonCardContent from '../../Components/Common/CommonCardContent';
import CommonFormBox from '../../Components/Common/CommonFormBox';
import CommonContainer from '../../Components/Common/CommonContainer';
import CommonErrorTypography from '../../Components/Common/CommonErrorTypography';
import CommonHeadingTypography from '../../Components/Common/CommonHeadingTypography';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister('signup');
  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: yupResolver(SignupSchema),
    defaultValues: { email: '', roleType: 'users' },
  });

  const onSubmit = async (data: RegisterForm) => {
    const userData = {
      email: data.email,
      password: data.password,
      name: data.name,
      mobileNo: data.mobileNo,
    };

    const key = generateKey();
    try {
      await register(userData, data.roleType, key);
      if (data.roleType === 'users') {
        navigate(`/profile/${key}`);
      } else {
        navigate('/user-list');
      }
    } catch (err: any) {
      // Handle error
    }
  };

  return (
    <CommonFormBox >
      <CommonContainer>
        <CommonCard >
          <CommonCardContent>
            <CommonHeadingTypography >
              Sign Up
            </CommonHeadingTypography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CommonTextField name="email" control={control} label="Email" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CommonTextField name="password" control={control} label="Password" type="password" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CommonTextField name="roleType" control={control} label="Role Type" select>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="users">User</MenuItem>
                  </CommonTextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CommonTextField name="name" control={control} label="Name" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CommonTextField name="mobileNo" control={control} label="Phone Number" />
                </Grid>
                <Grid item xs={12}>
                  <CardActions>
                    <CommonBlackSubmitButton loading={loading} text="Sign Up" />
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

export default SignUp;
