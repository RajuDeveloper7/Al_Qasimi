import * as React from 'react';
import styles from './EventsViewMore.module.scss';
import { IEventsViewMoreProps } from './IEventsViewMoreProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/webs";
import RevoCalendar from 'revo-calendar';
import { filter } from 'lodash';
import 'evo-calendar';
import { sp } from '@pnp/sp';

export interface IEventsVmState {
  Items: any[];
  SelectedDate: any;
  Date: any;
  Mode: string;
}
var NewWeb;
const eventList = [];
export default class EventsVm extends React.Component<IEventsViewMoreProps, IEventsVmState, {}> {
  public constructor(props: IEventsViewMoreProps, state: IEventsVmState) {
    super(props);
    SPComponentLoader.loadCss('https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/css/evo-calendar.min.css');
    SPComponentLoader.loadScript('https://cdn.jsdelivr.net/npm/evo-calendar@1.1.2/evo-calendar/js/evo-calendar.min.js');

    this.state = {
      Items: [],
      SelectedDate: "" + moment().format("MMM DD") + "",
      Date: "",
      Mode: "",
    };
    NewWeb = Web(this.props.siteurl)
  }

  public componentDidMount() {
    $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    $('#spCommandBar').attr('style', 'display: none !important');
    $('#CommentsWrapper').attr('style', 'display: none !important');
    $('#RecommendedItems').attr('style', 'display: none !important');

    var handler = this;
    $('#calendar').on('selectDate', function (event, newDate, oldDate) {
      let SelectedDate = moment(newDate, "MM/DD/YYYY").format("DD/MM/YYYY")
      handler.GetEventsofSelectedDate(SelectedDate);
    });

    const url: any = new URL(window.location.href);
    const Date = url.searchParams.get("SelectedDate");
    const Mode = url.searchParams.get("Mode");
    if (Mode == "EvRM") {
      this.setState({ Mode: "EvRM", Date: moment(Date, "YYYYMMDD").format('MMMM DD, YYYY') });
      var tdaydateAdd = moment(Date, "YYYYMMDD").format('YYYY-MM-DD');
      handler.GetEvents(tdaydateAdd, 'EvRM');
    } else {
      this.setState({ Mode: "EvVM", Date: moment().format('MMMM DD, YYYY') });
      handler.GetEvents(tdaydateAdd, 'EvVM');
    }

  }


  private async GetEvents(Date, Mode) {
    var reactHandler = this;
    var ApiUrl = "";
    var result
    if (Mode == "EvRM") {

      //   ApiUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('Events')/items?$select=ID,Title,Image,Description,EventDate,Location,EndDate&$orderby=EventDate asc&$filter=filter=EventDate gt '${Date}'`;
      result = await NewWeb.lists.getByTitle("Events").items.select("ID", "Title", "Image", "Description", "EventDate", "Location", "EndDate").orderBy("EventDate", true).filter(`EndDate gt '${Date}'`).get()
    } else {
      //ApiUrl = `${this.props.siteurl}/_api/web/lists/getbytitle('Events')/items?$select=ID,Title,Image,Description,EventDate,Location,EndDate&$orderby=EventDate asc&$filter=filter=EndDate gt '${moment().format('YYYY-MM-DD')}'`;
      result = await NewWeb.lists.getByTitle("Events").items.select("ID", "Title", "Image", "Description", "EventDate", "Location", "EndDate").orderBy("EventDate", true).filter(`EndDate gt '${moment().format('YYYY-MM-DD')}'`).get()
    }
    this.GetEventsForDots(Date, Mode);
    if (result.length != 0) {
      reactHandler.setState({
        Items: result
      });

      $("#if-event-present").show();
      $("#if-no-event-present").hide();
    } else {

      $("#if-event-present").hide();
      $("#if-no-event-present").show();
    }
  }

  private async GetEventsForDots(Date, Mode) {
    var handler = this;
    if (Mode == "EvVM") {
      await NewWeb.lists.getByTitle("Events").items.select("Title", "Description", "Location", "Image", "Location", "EventDate", "EndDate", "ID").orderBy("Created", false).getAll().then((items) => { // //orderby is false -> decending                  
        //  console.log(items);

        for (var i = 0; i < items.length; i++) {
          // console.log(moment(items[i].EventDate).format("MMMM/D/YYYY") + "  " + items[i].Title)
          eventList.push(
            { id: "" + items[i].ID + "", name: "" + items[i].Title + "", date: "" + moment(items[i].EventDate).format("MMMM/D/YYYY") + "", type: "holiday", description: "" + items[i].Description + "" }
          );
        }

        ($('#calendar') as any).evoCalendar({
          calendarEvents: eventList,
          'todayHighlight': true,
          'eventListToggler': false,
          'eventDisplayDefault': false,
          'sidebarDisplayDefault': false
        });
      }).catch((err) => {
        console.log(err);
      });
    } else {

      await NewWeb.lists.getByTitle("Events").items.select("Title", "Description", "Location", "Image", "Location", "EventDate", "EndDate", "ID").orderBy("Created", false).getAll().then((items) => { // //orderby is false -> decending                  
        for (var i = 0; i < items.length; i++) {


          eventList.push(
            { id: "" + items[i].ID + "", name: "" + items[i].Title + "", date: "" + moment(items[i].EventDate).format("MMMM/D/YYYY") + "", type: "holiday", description: "" + items[i].Description + "" }
          );
        }
        const DateFormat = moment(Date).format("MMMM DD,YYYY");
        ($('#calendar') as any).evoCalendar({
          calendarEvents: eventList,
          'todayHighlight': true,
          'eventListToggler': false,
          'eventDisplayDefault': false,
          'sidebarDisplayDefault': false,
          'selectDate': "07/09/2021"//this.state.Date
        });
        ($("#calendar") as any).evoCalendar('selectDate', "" + DateFormat + "");


      }).catch((err) => {
        console.log(err);
      });
    }

  }

  private async GetEventsofSelectedDate(Date) {
    var reactHandler = this;
    var tdaydateAdd = moment(Date, "DD/MM/YYYY").subtract(1, 'd').format('YYYY-MM-DD');
    this.setState({ Items: [], Date: moment(tdaydateAdd).add(1, 'd').format('YYYY-MM-DD'), SelectedDate: "" + moment(Date, "DD/MM/YYYY").format("MMM D") + "" });
    await NewWeb.lists.getByTitle("Events").items.select("ID", "Title", "Image", "Description", "EventDate", "Location", "EndDate").orderBy("EventDate", true).filter(`EventDate gt '${tdaydateAdd}'`).get().then((items) => { // //orderby is false -> decending                  
      reactHandler.setState({
        Items: items
      });
      if (items.length == 0) {
        $("#if-event-present").hide();
        $("#if-no-event-present").show();
      } else {
        $("#if-event-present").show();
        $("#if-no-event-present").hide();
      }
      reactHandler.CheckEvents();
    });
  }
  public CheckEvents() {
    var active_events = ($("#calendar") as any).evoCalendar('getActiveEvents');
    console.log(active_events)
    if (active_events.length == 0) {
      $("#if-event-present").hide();
      $("#if-no-event-present").show();
    } else {
      $("#if-event-present").show();
      $("#if-no-event-present").hide();
    }
  }

  public checkSame(date1, date2) {
    return moment(date1).isSame(date2);
  }

  public render(): React.ReactElement<IEventsViewMoreProps> {
    var handler = this;
    const EventsfromCalender: JSX.Element[] = this.state.Items.map(function (item, key) {
      var EventDateStart = moment(item.EventDate).format('YYYY-MM-DD');
      if (handler.checkSame(handler.state.Date, EventDateStart)) {
        var Title = item.Title;
        let dummyElement = document.createElement("DIV");
        dummyElement.innerHTML = item.Description;
        var outputText = dummyElement.innerText;
        var Location = item.Location;
        var EndDate = moment(item.EndDate).format("DD/MM/YYYY h:mm A");
        var StartDate = moment(item.EventDate).format("DD/MM/YYYY h:mm A");
        let RawImageTxt = item.Image;
        if (RawImageTxt != "" && RawImageTxt != null) {
          var ImgObj = JSON.parse(RawImageTxt);
          return (
            <li className="clearfix">
              <div className="inner-event-body-left">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
              </div>
              <div className="inner-event-body-right">
                <div className="event-location-duration clearfix">
                  <div className="event-location-duration-left ">
                    <img src={`${handler.props.siteurl}/SiteAssets/img/duration.svg`} /> {StartDate} to {EndDate}
                  </div>
                  <div className="event-location-duration-right">
                    <img src={`${handler.props.siteurl}/SiteAssets/img/location.svg`} /> {Location}
                  </div>
                </div>
                <h4> {Title} </h4>
                <p> {outputText} </p>
              </div>
            </li>
          );
        } else {
          return (
            <li className="clearfix">
              <div className="inner-event-body-left">
                <img src={`${handler.props.siteurl}/SiteAssets/img/No-Events-Image.svg`} alt="image" />
              </div>
              <div className="inner-event-body-right">
                <div className="event-location-duration clearfix">
                  <div className="event-location-duration-left ">
                    <img src={`${handler.props.siteurl}/SiteAssets/img/duration.svg`} /> {StartDate} to {EndDate}
                  </div>
                  <div className="event-location-duration-right">
                    <img src={`${handler.props.siteurl}/SiteAssets/img/location.svg`} /> {Location}
                  </div>
                </div>
                <h4> {Title} </h4>
                <p> {outputText} </p>
              </div>
            </li>
          );
        }
      }
    });

    return (
      <div className={styles.eventsVm} id="eventsvm">
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        <div className="container relative">
          <div className="section-rigth">
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Events </h1>
                <ul className="breadcums">
                  <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                  <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Events </a> </li>
                </ul>
              </div>
            </div>
            <div className="inner-page-contents sec">
              <div className="row">
                <div className="col-md-6">
                  {/* <RevoCalendar
                   
                    events={eventList}
                    date={new Date()}
                    primaryColor="#33b6b2"
                    secondaryColor="#ffffff"
                    todayColor="#1bc7b3"
                    textColor="#333333"
                    indicatorColor="#15d732"
                    showDetailToggler={false}
                    showSidebarToggler={true}
                    openDetailsOnDateSelection={false}
                    dateSelected={(date: Date) => {
                      this.GetEventsofSelectedDate(date);
                    }}
                  /> */}

                  <div id="calendar"></div>

                </div>
                <div className="col-md-6">
                  <div className="inner-event-wrap">
                    <div className="inner-event-main-wrap" >
                      <div className="inner-event-header">
                        {this.state.SelectedDate}
                      </div>
                      <div id="event" >

                        <div className="inner-event-body" id="if-event-present" >
                          <ul >
                            {EventsfromCalender}
                          </ul>
                        </div>
                        <div className="inner-event-body" id="if-no-event-present" >
                          <p >No events on selected date</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
