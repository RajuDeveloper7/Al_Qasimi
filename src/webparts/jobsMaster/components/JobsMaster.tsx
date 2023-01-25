import * as React from 'react';
import styles from './JobsMaster.module.scss';
import { IJobsMasterProps } from './IJobsMasterProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/presets/all"
import { sp } from 'sp-pnp-js';
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';


export interface IJobsMasterState {
    Items: any[];
}
const DateOfSublist = [];
export default class JobsMaster extends React.Component<IJobsMasterProps, IJobsMasterState, {}> {
    public constructor(props: IJobsMasterProps, state: IJobsMasterState) {
        super(props);
        this.state = {
            Items: [],
        }

    }

    public componentDidMount() {

        $('#spCommandBar').attr('style', 'display: none !important');
        $('#CommentsWrapper').attr('style', 'display: none !important');
        $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');

        this.GetJobsMaster();
        this.JobsMasterCheck();

    }
    public async GetJobsMaster() {

        await sp.web.lists.getByTitle("JobsMaster").items.select("Title", "EmploymentType", "ExperienceLevel", "EmailID", "DateOfSubmission", "JobSummary", "Status", "ID", "Created").filter(`IsActive eq '1'`).getAll().then((items) => { // //orderby is false -> decending          
            this.setState({
                Items: items,
            });
        });

    }
    public async JobsMasterCheck() {
        var tdaydate = moment().format('YYYY-MM-DD')
        var result = await sp.web.lists.getByTitle("JobsMaster").items.select("DateOfSubmission", "ID").filter(`DateOfSubmission lt '${tdaydate}'`).getAll()
        for (var i = 0; i < result.length; i++) {
            var id = result[i].ID
            const itemUpdate = await sp.web.lists.getByTitle("JobsMaster").items.getById(id).update({
                'Status': 'Expired',
            });
        }
    }

    public render(): React.ReactElement<IJobsMasterProps> {

        var handler = this;
        const JobsMaster: JSX.Element[] = this.state.Items.map(function (item, key) {

            var ItemId = item.ID;
            var JobTitle = item.Title;
            var EmploymentType = item.EmploymentType;
            var ExperienceLevel = item.ExperienceLevel;
            var EmailID = item.EmailID;
            var DateOfSubmission = moment(item.DateOfSubmission).format("DD/MMM/YYYY");
            var Status = item.Status;

            return (
                <tr>
                    <td>{ItemId}</td>
                    <td>{JobTitle}</td>
                    <td>{EmploymentType}</td>
                    <td>{ExperienceLevel}</td>
                    <td>{DateOfSubmission}</td>

                    {Status == "Open" ?
                        <>
                            <td className="status approved">  <span> Open  </span> </td>
                            <td><a href={`${handler.props.siteurl}/SitePages/Jobs-Read-More.aspx?ItemID=` + ItemId + ""} className="apply">Apply Now</a></td>
                        </>
                        :
                        <>
                            <td className="status expired">  <span> Expired  </span> </td>
                            <td>...</td>
                        </>
                    }
                </tr>
            );

        });

        return (
            <div id="jobsmaster">
                <section>
                    <div id="Global-Top-Header-Navigation">
                        <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
                    </div>
                    <div className="container relative">

                        <div className="section-rigth">

                            <div className="inner-banner-header jobs-banner relative m-b-20">

                                <div className="inner-banner-overlay"></div>
                                <div className="inner-banner-contents">
                                    <h1> We are hiring </h1>
                                    <ul className="breadcums">
                                        <li> <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`}> Home </a> </li>
                                        <li> <a href="#" style={{ pointerEvents: 'none' }}> Jobs </a> </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="inner-page-contents ">
                                <div className="sec">
                                    <div className="contact-table-info">
                                        <div className='table-responsive'>
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>S.No</th>
                                                        <th>Job Title</th>
                                                        <th>Employment Type</th>
                                                        <th>Experience Level</th>
                                                        <th className='th_dos'>Date Of Submission</th>
                                                        <th className='th_status'>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {JobsMaster}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </section>
                <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
            </div>
        );
    }
}
