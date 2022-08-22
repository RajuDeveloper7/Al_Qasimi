import * as React from 'react';
import styles from './JobsRm.module.scss';
import { IJobsRmProps } from './IJobsRmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from '@pnp/sp/webs';
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';
import * as moment from 'moment';
import { sp } from '@pnp/sp';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';
export interface IJobsRMState {
  Items: any[];
}

export default class JobsRm extends React.Component<IJobsRmProps, IJobsRMState, {}> {
  public constructor(props: IJobsRmProps, state: IJobsRMState) {
    super(props);
    this.state = {
      Items: [],
    };
  }
  public componentDidMount() {
    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    }, 2000);

    var reactHandler = this;
    const url: any = new URL(window.location.href);
    const ItemID = url.searchParams.get("ItemID");
    reactHandler.GetJobs(ItemID);
  }
  public async GetJobs(ItemID) {
    await sp.web.lists.getByTitle("JobsMaster").items.select("Title", "EmploymentType", "ExperienceLevel", "EmailID", "DateOfSubmission", "JobSummary", "Status", "ID", "Created").filter(`IsActive eq '1'and ID eq '${ItemID}'`).getAll().then((items) => { // //orderby is false -> decending          
      this.setState({
        Items: items,
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  public render(): React.ReactElement<IJobsRmProps> {
    var reactHandler = this;
    const JobsRM: JSX.Element[] = this.state.Items.map(function (item, key) {
      var ItemId = item.ID;
      var JobTitle = item.Title;
      var EmploymentType = item.EmploymentType;
      var ExperienceLevel = item.ExperienceLevel;
      var EmailID = item.EmailID;
      var DateOfSubmission = moment(item.DateOfSubmission).format("DD/MMM/YYYY");
      var JobSummary = item.JobSummary;
      return (
        <>
          <div className="inner-banner-header jobs-banner relative m-b-20">
            <div className="inner-banner-overlay"></div>
            <div className="inner-banner-contents">
              <h1> We are hiring {JobTitle} </h1>
              <ul className="breadcums">
                <li> <a href={`${reactHandler.props.siteurl}/SitePages/HomePage.aspx`}> Home </a> </li>
                <li> <a href="#"> Jobs </a> </li>
              </ul>
            </div>

          </div>
          <div className="inner-page-contents ">
            <div className="sec">
              <div className="top-news-sections  jobs-info-sec ">
                <div className="added-emp-part">

                  <div className="section-part">
                    <ul className="qq-links-part emp-info  clearfix">
                      <li>
                        <div className="emp-details">
                          <h5>Employment Type</h5>
                          <h4>{EmploymentType}</h4>
                        </div>

                      </li>
                      <li>
                        <div className="emp-details">
                          <h5>Experience Level</h5>
                          <h4>{ExperienceLevel}</h4>
                        </div>

                      </li>
                      <li>
                        <div className="emp-details">
                          <h5>Email ID</h5>
                          <h4>{EmailID}</h4>
                        </div>

                      </li>
                      <li>
                        <div className="emp-details">
                          <h5>Date Of Submission</h5>
                          <h4>{DateOfSubmission}</h4>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="job-summary m-b-20">
                <h4>Job Summary</h4>
                <ul>
                  {/* <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's </li>
            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
            <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has </li> */}
                  {JobSummary}
                </ul>
              </div>
              <div className="align-center apply-btn">
                <a href="#" type="button" className="btn filter-btn">
                  <span>Apply Now</span></a>
              </div>
            </div>
          </div>
        </>
      );
    }
    );
    return (
      <div id="jobsrm">
        <section>
          <div id="Global-Top-Header-Navigation">
            <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
          </div>

          <div className="container relative">
            <div className="section-rigth">
              {JobsRM}
            </div>
          </div>
        </section>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
