import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../utils/dbOperations/dbOperations';
import { userInfo } from '../../utils/dbOperations/interfaces';
import CommonContainer from '../../Components/Common/CommonContainer';
import CommonCard from '../../Components/Common/CommonCard';
import CommonCardContent from '../../Components/Common/CommonCardContent';
import CommonHeadingTypography from '../../Components/Common/CommonHeadingTypography';
import CommonErrorTypography from '../../Components/Common/CommonErrorTypography';
import CommonFormBox from '../../Components/Common/CommonFormBox';
import CommonBlackSubmitButton from '../../Components/Common/CommonBlackSubmitButton';
import { List, ListItem, ListItemText, CircularProgress, Typography } from '@mui/material';

const UsersListPage: React.FC = () => {
  const [users, setUsers] = useState<Record<string, userInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <CommonContainer>
        <CircularProgress />
      </CommonContainer>
    );
  }

  if (error) {
    return (
      <CommonContainer>
        <CommonErrorTypography>{error}</CommonErrorTypography>
      </CommonContainer>
    );
  }

  if (Object.keys(users).length === 0) {
    return (
      <CommonContainer>
        <Typography>No users found.</Typography>
      </CommonContainer>
    );
  }

  return (
    <CommonFormBox>
      <CommonContainer>
        <CommonCard>
          <CommonCardContent>
            <CommonHeadingTypography>Users List</CommonHeadingTypography>
            <List>
              {Object.entries(users).map(([id, user]) => (
                <ListItem key={id}>
                  <ListItemText primary={user.name} secondary={user.email} />
                  <CommonBlackSubmitButton  text='Edit' loading={false} size='small' fullWidth={false}
                    onClick={() => navigate(`/profile/${id}`) }
                  >
                  </CommonBlackSubmitButton>
                </ListItem>
              ))}
            </List>
          </CommonCardContent>
        </CommonCard>
      </CommonContainer>
    </CommonFormBox>
  );
};

export default UsersListPage;
