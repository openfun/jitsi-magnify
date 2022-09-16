import { AuthGard, ConnexionStatus, IntroductionLayout, useStore } from '@jitsi-magnify/core';
import { Box } from 'grommet';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFoundView from './views/404';
import DefaultView from './views/default';
import GroupView from './views/group';
import GroupsView from './views/groups';
import JitsiView from './views/jitsi';
import MyMeetings from './views/myMeetings';
import ProfileView from './views/profile';
import RoomView from './views/room';
import RoomsView from './views/rooms';
import RoomSettingsView from './views/roomSettings';

export default function App() {
  const { connexionStatus } = useStore();

  if (connexionStatus === ConnexionStatus.CONNECTING) return <AuthGard />;

  if (connexionStatus === ConnexionStatus.DISCONNECTED) {
    return (
      <Box overflow="hidden">
        <IntroductionLayout
          background="linear-gradient(45deg, #ffbdc9 0%, #687fc9 100%)"
          urlCover="/cover.svg"
          urlLogo="/logo-fun.svg"
        />
      </Box>
    );
  }

  return (
    <Box background="linear-gradient(45deg, #fef1f3 0%, #d6e4f6 100%);" height="100vh">
      <Routes>
        <Route element={<DefaultView />} path="/" />
        <Route element={<ProfileView />} path="/account" />
        <Route element={<GroupsView />} path="/groups" />
        <Route element={<GroupView />} path="/groups/:groupId" />
        <Route element={<MyMeetings />} path="/meetings" />
        <Route element={<RoomsView />} path="/rooms" />
        <Route element={<RoomView />} path="/rooms/:slug" />
        <Route element={<RoomSettingsView />} path="/rooms/:slug/settings" />
        <Route element={<JitsiView />} path="/j/m/:meetingId" />
        <Route element={<JitsiView />} path="/j/:roomSlug" />
        <Route element={<NotFoundView />} path="*" />
      </Routes>
    </Box>
  );
}
