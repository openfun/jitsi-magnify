import React from "react";
import { useMatch, useResolvedPath } from "react-router-dom";
import { Box, Nav, Text, Sidebar } from "grommet";
import { SidebarButton, SidebarButtonProps } from "..";

const SidebarHeader = () => <></>;

const SidebarFooter = () => <></>;

function displayButton(buttonProps: SidebarButtonProps) {

    const resolvedPath = useResolvedPath(buttonProps.to)
    const match = useMatch({ path: resolvedPath.pathname, end: false});

    buttonProps.selected = match != null
    return <Box>
        <SidebarButton {...buttonProps} />
    </Box>
}

function MainNavigation(props: { buttonsProps: SidebarButtonProps[] }) {

    return (
        <Nav gap="large" responsive={false}>
            {props.buttonsProps.map((bp) => displayButton(bp))}
        </Nav>
)};

function LayoutWithSidebar(props:{buttons: SidebarButtonProps[], children:any}) {

    return (<Box direction="row" height={{ min: "100%" }}>
        <Sidebar
            responsive={false}
            background="light-1"
            header={<SidebarHeader />}
            footer={<SidebarFooter />}
            pad={{ left: "medium", right: "large", vertical: "medium" }}
        >
            <MainNavigation buttonsProps={props.buttons}/>
        </Sidebar>
        {props.children}
    </Box>)
};

LayoutWithSidebar.args = {
  full: true,
};

export default LayoutWithSidebar;