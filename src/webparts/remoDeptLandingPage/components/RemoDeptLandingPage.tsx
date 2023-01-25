import * as React from 'react';
import styles from './RemoDeptLandingPage.module.scss';
import { IRemoDeptLandingPageProps } from './IRemoDeptLandingPageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as $ from 'jquery'

import AboutDepartment from './RemoAboutDepartment';
import DepartmentServices from './RemoDepartmentServices';
import DepartmentGallery from './RemoDepartmentGallery';
import DepartmentQuickLink from './RemoDepartmentQuickLinks';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';

export default class RemoHomePage extends React.Component<IRemoDeptLandingPageProps, {}> {
  public componentDidMount() {

    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    $('#spCommandBar').attr('style', 'display: none !important');
    $('#spLeftNav').attr('style', 'display: none !important');
    $('#CommentsWrapper').attr('style', 'display: none !important');
    $('.ms-CommandBar').attr('style', 'display: none !important');
    setTimeout(() => {
      $("#Dept-Homepage").show();

    }, 1700);
  }
  public render(): React.ReactElement<IRemoDeptLandingPageProps> {

    return (
      <div id="Dept-Homepage" style={{ display: "none" }}>
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.homepage} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        <div className="container home_pg relative" >
          <div className="banner-ceo-message ">
            <div className="row">
              <div className="col-md-12">
                <AboutDepartment siteurl={this.props.siteurl} context={this.props.context} PageName={this.props.PageName} userid={this.props.userid} homepage={this.props.homepage} />

              </div>
            </div>

            <div className="row">
              <div className="col-md-8">

                <DepartmentServices siteurl={this.props.siteurl} context={this.props.context} PageName={''} userid={this.props.userid} homepage={''} />


                <DepartmentGallery siteurl={this.props.siteurl} context={this.props.context} PageName={''} userid={this.props.userid} homepage={''} />

              </div>
              <div className="col-md-4">
                <DepartmentQuickLink siteurl={this.props.siteurl} context={this.props.context} PageName={''} userid={this.props.userid} homepage={''} />

              </div>
            </div>

          </div>
          <RemoResponsive siteurl={this.props.homepage} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
      </div>

    );
  }
}
