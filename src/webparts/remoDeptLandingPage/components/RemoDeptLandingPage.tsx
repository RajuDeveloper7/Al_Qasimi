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

export default class RemoHomePage extends React.Component<IRemoDeptLandingPageProps, {}> {
  public componentDidMount() {
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    $('#spCommandBar').attr('style', 'display: none !important');
    $('#spLeftNav').attr('style', 'display: none !important');
    $('#CommentsWrapper').attr('style', 'display: none !important');
    $('.ms-CommandBar').attr('style', 'display: none !important');
  }
  public render(): React.ReactElement<IRemoDeptLandingPageProps> {

    return (
      <div>
        <div className="container home_pg relative" id="Dept-Homepage">

          <div className="banner-ceo-message ">
            <div className="row">
              <div className="col-md-12">
                <AboutDepartment siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} PageName={''} />

              </div>
            </div>

            <div className="row">
              <div className="col-md-8">

                <DepartmentServices siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} PageName={''} />


                <DepartmentGallery siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} PageName={''} />

              </div>
              <div className="col-md-4">
                <DepartmentQuickLink siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} PageName={''} />

              </div>
            </div>

          </div>

        </div>
      </div>

    );
  }
}
