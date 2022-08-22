import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import * as $ from 'jquery';
import * as moment from 'moment';
//import 'evo-calendar';
import RevoCalendar from 'revo-calendar';

export interface IEventsAnnouncementsState {
  Items: any[];
  Events: any[];
}

SPComponentLoader.loadCss("https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/css/evo-calendar.min.css");
SPComponentLoader.loadCss("https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css");


export default class RemoLatestEventsandAnnouncements extends React.Component<IRemoHomePageProps, IEventsAnnouncementsState, {}> {
  constructor(props: IRemoHomePageProps, state: IEventsAnnouncementsState) {
    super(props);
    this.state = {
      Items: [],
      Events: []
    };
  }

  public componentDidMount() {

    var reactHandler = this;
    reactHandler.GetAnnouncements();
    reactHandler.GetEvents();
  }

  private async GetAnnouncements() {
    const tdaydate = moment().format('MM-DD-YYYY');
    var reactHandler = this;
    var Date = moment().toISOString();
    try {
      await sp.web.lists.getByTitle("Announcement").items.select("Title", "Description", "Created", "ID").filter(`IsActive eq '1'`).orderBy("Created", false).top(1).get().then((items) => { // //orderby is false -> decending          

        if (items.length != 0) {
          $("#if-annc-present").show();
          reactHandler.setState({
            Items: items
          });
        } else {
          $("#if-no-annc-present").show();
        }
      });
    } catch (err) {
      console.log("Events : " + err);
    }
  }

  private async GetEvents() {
    var reactHandler = this;
    const tdaydate = moment().format('MM-DD-YYYY');
    try {
      await sp.web.lists.getByTitle("Events").items.select("Title", "Description", "EventDate", "EndDate", "ID").filter(`EndDate ge '${tdaydate}'`).orderBy("Created", false).top(3).get().then((items) => { // //orderby is false -> decending          

        if (items.length != 0) {
          $("#if-events-present").show();
          $("#if-no-events-present").hide();
          reactHandler.setState({
            Events: items
          });
        } else {
          $("#if-events-present").hide();
          $("#if-no-events-present").show();
        }
      });
    } catch (err) {
      console.log("Events : " + err);
    }
  }

  public render(): React.ReactElement<IRemoHomePageProps> {
    var handler = this;
    const AnncItems: JSX.Element[] = this.state.Items.map(function (item, key) {
      let dummyElement = document.createElement("DIV");
      dummyElement.innerHTML = item.Description;
      var outputText = dummyElement.innerText;

      let DateofPublish = "";
      let CreatedDate = moment(item.Created).format("DD/MM/YYYY");
      let CurrentDate = moment().format("DD/MM/YYYY");
      if (CreatedDate == CurrentDate) {
        DateofPublish = "Today";
      } else {
        DateofPublish = "" + CreatedDate + "";
      }
      return (
        <div className="sec gradient">
          <div className="annoy-heading">
            <a href={`${handler.props.siteurl}/SitePages/Announcement-View-More.aspx?ItemID=${item.ID}&env=WebView`} data-interception='off'>
              <h4> Announcements </h4>
            </a>
            <p> {DateofPublish}  </p>
          </div>
          <div className="ann-detibck">
            <a href={`${handler.props.siteurl}/SitePages/Announcement-Read-More.aspx?ItemID=${item.ID}&env=WebView`} data-interception='off'>
              <h2>{item.Title} </h2>
            </a>
            <p> {outputText}</p>
          </div>
        </div>
      );
    });
    const Events: JSX.Element[] = handler.state.Events.map(function (item, key) {
      var Date = moment(item.EventDate).format("DD");
      var Month = moment(item.EventDate).format("MMM");

      let dummyElement = document.createElement("DIV");
      dummyElement.innerHTML = item.Description;
      var outputText = dummyElement.innerText;

      return (
        <li className="clearfix">
          <div className="latest-eventsleft relative">
            <h2> {Date} </h2>
            <p> {Month} </p>
            <div className="inner-shaodw"> </div>
          </div>
          <div className="latest-eventsright" id="evocalendar">
            <h4><a href={`${handler.props.siteurl}/SitePages/EventsViewMore.aspx?Mode=EvRM&ItemID=${item.ID}&SelectedDate=${moment(item.EventDate).format("YYYYMMDD")}&env=WebView`} data-interception='off' >{item.Title}</a> </h4>
            <p> {outputText}  </p>
          </div>
        </li>
      );
    });
    return (
      <div className={styles.eventsAnnouncements} id="events-and-anncmnts">
        <div className="latest-news-announcemnst">
          <div >
            <div className="col-md-6">
              <div className="sec event-cal" id="if-events-present">
                <div className="heading clearfix">
                  <h4><a href={`${this.props.siteurl}/SitePages/EventsViewMore.aspx?env=WebView`}>
                    Latest Events
                  </a>
                  </h4>
                  {/* <div className="prev-next">
                    <a href=""><img src={`https://remodigital.sharepoint.com/sites/Remo/SiteAssets/img/previous.svg`} alt="image" className="prev-img" /> </a>
                    <a href=""><img src={`https://remodigital.sharepoint.com/sites/Remo/SiteAssets/img/next-2.svg`} alt="image" className="next-img" /> </a>
                  </div> */}
                </div>
                <div className="section-part clearfix latest-events-bck">
                  <ul>
                    {Events}
                  </ul>
                </div>
              </div>

              <div className="sec event-cal" id="if-no-events-present" style={{ display: "none" }}>
                <div className="heading">
                  Latest Events
                </div>
                <img className="err-img" src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="ceoimg"></img>

                {/* <div className="section-part clearfix latest-events-bck">
                  <ul>
                    {Events}                                              
                  </ul>
                </div> */}
              </div>
            </div>
            <div className="col-md-6" id="if-annc-present">
              {AnncItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
