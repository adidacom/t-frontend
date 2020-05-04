import React from 'react';
import { withStyles } from '@material-ui/styles';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import Header from '../components/Header/Header';
import { COLORS } from '../utils/theme';

const SIDER_WIDTH = '420px';
const styles = {
  container: {
    height: '100%',
  },
  header: {
    background: '#ffffff',
    height: '60px',
    lineHeight: '60px',
    borderBottom: `1px ${COLORS.PRIMARY200} solid`,
    padding: '0 24px',
    display: 'flex',
  },
  sidebar: {
    background: '#ffffff',
    borderRight: `1px ${COLORS.PRIMARY200} solid`,
    overflowY: 'auto',
  },
  mainContent: {
    background: '#ffffff',
  },
};

const AppLayout = ({ classes, Sidebar, Content }) => (
  <Layout className={classes.container}>
    <Layout.Header className={classes.header}>
      <Header />
    </Layout.Header>
    <Layout hasSider={!!Sidebar}>
      {!!Sidebar && (
        <Layout.Sider className={classes.sidebar} width={SIDER_WIDTH}>
          <Sidebar />
        </Layout.Sider>
      )}
      <Layout.Content className={classes.mainContent}>
        <Content />
      </Layout.Content>
    </Layout>
  </Layout>
);

export default withStyles(styles)(AppLayout);
