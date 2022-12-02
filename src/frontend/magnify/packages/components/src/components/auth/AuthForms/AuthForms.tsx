import { Anchor, Box, Card, Spinner, Text } from 'grommet';
import React from 'react';

export interface AuthFormsProps {
  isLogin?: boolean;
  showFooter?: boolean;
  footerLabel?: string;
  footerRedirect?: () => void;
  footerRouteLabel?: string;
  children: React.ReactNode;
}

export const AuthForms = ({ showFooter = true, ...props }: AuthFormsProps) => {
  return (
    <Box background="light-1" height={{ min: '100vh' }} width="100%">
      <Box margin="auto" width="80%">
        <Card background="white" margin={{ vertical: 'small' }} pad="large" width="100%">
          {props.children}
        </Card>

        {showFooter && (
          <Card
            background="white"
            margin={{ vertical: 'small' }}
            pad={{ vertical: 'medium', horizontal: 'large' }}
            width="100%"
          >
            <Text>
              <>
                {props.footerLabel}{' '}
                <Anchor label={props.footerRouteLabel} onClick={props.footerRedirect} role="link" />
              </>
            </Text>
          </Card>
        )}
      </Box>
    </Box>
  );
};
