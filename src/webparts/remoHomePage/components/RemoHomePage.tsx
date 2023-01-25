import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as $ from 'jquery';

import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';

import RemoHeroBanner from './RemoHeroBanner';
import RemoCEOMessage from './RemoCEOMessage';
import RemoNavigations from './RemoNavigations';
import RemoMyMeetings from './RemoMyMeetings';
import RemoNews from './RemoNews';
import RemoLatestEventsandAnnouncements from './RemoLatestEventsandAnnouncements';
import RemoImagesandVideos from './RemoImagesandVideos';
import RemoClimate from './RemoClimate';
import RemoBirthday from './RemoBirthday';
import RemoQuickLinks from './RemoQuickLinks';
import RemoRecentFiles from './RemoRecentFiles';
import RemoSocialMedia from './RemoSocialMedia';




export default class RemoHomePage extends React.Component<IRemoHomePageProps, {}> {

  public componentDidMount() {

    $(".inner-pages-nav").remove();
    $('#spCommandBar').attr('style', 'display: none !important');
    $('#CommentsWrapper').attr('style', 'display: none !important');
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');

    setTimeout(() => {
      $("#HomePage").show();
    }, 500);

  }

  public render(): React.ReactElement<IRemoHomePageProps> {

    return (
      <div id="HomePage" style={{ display: "none" }}>
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container home_pg relative">
            <div className="section-rigth">
              <div className="banner-ceo-message ">
                <div className="row">

                  <RemoHeroBanner siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />

                  <RemoCEOMessage siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                </div>
              </div>
              <RemoNavigations siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />

              <div className="row section_bottom">

                <div className="col-md-8">
                  <div className="events-calender">
                    <RemoMyMeetings siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />

                  </div>

                  <RemoNews siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />


                  <div className="latest-news-announcemnst" id="latest-news-announcemnst">
                    <div className="row row-res">
                      <RemoLatestEventsandAnnouncements siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                    </div>
                  </div>
                  <div id="social-and-gallery">
                    <div className="images-social">
                      <div className="row row-res">
                        <RemoImagesandVideos siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                        <RemoSocialMedia siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">

                  <RemoBirthday siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />

                  <RemoClimate siteurl={this.props.siteurl} context={this.props.context} description={''} />



                  <RemoQuickLinks siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />


                  <RemoRecentFiles siteurl={this.props.siteurl} context={this.props.context} description={''} userid={this.props.userid} />

                </div>
              </div>
              <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
            </div>
          </div>
        </section>
      </div>

    );
  }
}
