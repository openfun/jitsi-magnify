import { useStore, IntroductionLayout, ConnexionStatus, AuthGard } from '@jitsi-magnify/core';
import { Box } from 'grommet';
import { Route, Routes } from 'react-router-dom';
import NotFoundView from './views/404';
import DefaultView from './views/default';
import GroupsView from './views/groups';
import ProfileView from './views/profile';
import RoomsView from './views/rooms';

export default function App() {
  const { connexionStatus } = useStore();

  if (connexionStatus === ConnexionStatus.CONNECTING) return <AuthGard />;

  if (connexionStatus === ConnexionStatus.DISCONNECTED) {
    return (
      <Box overflow="hidden">
        <IntroductionLayout
          background="linear-gradient(45deg, #ffbdc9 0%, #687fc9 100%)"
          urlLogo="/logo-fun.svg"
          urlCover="/cover.svg"
        />
      </Box>
    );
  }

  return (
    <Box background={'linear-gradient(45deg, #fef1f3 0%, #d6e4f6 100%);'} height="100vh">
      <Routes>
        <Route path="/" element={<DefaultView />} />
        <Route path="/account" element={<ProfileView />} />
        <Route path="/groups" element={<GroupsView />} />
        <Route path="/rooms" element={<RoomsView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </Box>
  );
}
