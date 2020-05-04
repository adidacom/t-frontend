import React from 'react';
import { connect } from 'react-redux';
import AppLayout from '../containers/AppLayout';
import SearchContent from '../containers/Search/SearchContent';
import SearchSideBar from '../containers/Search/SearchSidebar';

const Search = () => <AppLayout Sidebar={SearchSideBar} Content={SearchContent} />;

const mapStateToProps = (state) => ({
  searchReducer: state.search,
});

export default connect(mapStateToProps)(Search);
