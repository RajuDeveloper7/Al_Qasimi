import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from '@pnp/sp/webs';
import * as $ from 'jquery';
import Slider from 'react-slick';
import { sp } from '@pnp/sp'
import * as moment from 'moment';


export interface IBirthdayState {
  Items: any[];
  TodayBirthday: any[];
  UpcomingBirthday: any[];
  FirstBdayDate: any;
  LastBdayDate: any;
  Dates: any;
  TotalBirthday: number;
}

export default class RemoBirthday extends React.Component<IRemoHomePageProps, IBirthdayState, {}> {

  public constructor(props: IRemoHomePageProps, state: IBirthdayState) {
    super(props);
    this.state = {
      Items: [],
      TodayBirthday: [],
      UpcomingBirthday: [],
      FirstBdayDate: "",
      LastBdayDate: "",
      Dates: [],
      TotalBirthday: 0
    };

  }

  public componentDidMount() {

    this.GetBirthday();

  }

  public async GetBirthday() {
    var reactHandler = this;
    var bdays
    await sp.web.lists.getByTitle("Birthday").items.select("Title", "DOB", "Name", "Picture", "Designation", "Description", "ID", "Created").
      orderBy("DOB", true).filter(`IsActive eq '1'`).get().then((items) => {

        if (items.length != 0) {
          $("#today-bday").show();
          reactHandler.setState({
            TodayBirthday: items,
          });

          for (var i = 0; i < items.length; i++) {

            var tdaydate = moment().format('MM/DD');
            var bdaydates = moment(items[i].DOB).format('MM/DD')

            if (tdaydate == bdaydates) {
              this.setState({ TotalBirthday: items.length })
            }
          }
        } else {
          $("#today-bday").hide();
          $("#upcoming-bday").show();
        }

      });
    reactHandler.GetUpcomingBirthday();
  }

  public async GetUpcomingBirthday() {
    var reactHandler = this;
    var tdaydate = moment().format('MM/DD');
    var FutureDate1 = moment().add(1, "days").format('MM/DD');
    var FutureDate2 = moment().add(2, "days").format('MM/DD');
    var FutureDate3 = moment().add(3, "days").format('MM/DD');

    reactHandler.setState({
      FirstBdayDate: moment(FutureDate1, 'MM/DD'),
      LastBdayDate: moment(FutureDate3, 'MM/DD'),
    });
    await sp.web.lists.getByTitle("Birthday").items.select("Title", "DOB", "Name", "Picture", "Designation", "Description", "ID", "Created",).top(1000).
      orderBy("DOB", true).filter(`IsActive eq '1'`).get().then((items) => {

        reactHandler.setState({
          UpcomingBirthday: items,
        });
        for (var i = 0; i < items.length; i++) {
          var bdaydates = moment(items[i].DOB).format('MM/DD');

          if (FutureDate1 == bdaydates || FutureDate2 == bdaydates || FutureDate3 == bdaydates) {
            reactHandler.setState({
              TotalBirthday: reactHandler.state.TotalBirthday + items.length
            });
          }
        }
        reactHandler.checkBirthdayAvailability();
      });
  }

  public checkBirthdayAvailability() {

    if (this.state.TotalBirthday == 0) {

      $("#if-birthdays-present").hide();
      $("#if-no-birthdays-present").show();
    } else {

      $("#if-birthdays-present").show();
      $("#if-no-birthdays-present").hide();
    }
  }

  public render(): React.ReactElement<IRemoHomePageProps> {
    var reactHandler = this;
    const settings = {
      dots: false,
      arrows: false,
      infinite: true,
      speed: 1500,
      autoplaySpeed: 3000,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      //  fade: true,
    };
    const TodayBirthday: JSX.Element[] = this.state.TodayBirthday.map(function (item, key) {

      var Name = "";
      let Tday1Bday = moment().format("MM-DD");
      let RawImageTxt = item.Picture;
      let Bdaydate = moment(item.DOB).format("MM-DD")
      var ItemId = item.ID
      if (Tday1Bday == Bdaydate) {

        Name = item.Name

        if (RawImageTxt != "" && RawImageTxt != null) {
          var ImgObj = JSON.parse(RawImageTxt);
          return (
            <div className="sec">
              <div className="heading clearfix" id="spotlight-title" >

                <span id="highlights-type" > Birthday </span>

              </div>
              <div className="section-part clearfix">
                <div className="birthday-image relative">
                  <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
                  <div className="birday-icons">
                    <img src={`${reactHandler.props.siteurl}/SiteAssets/img/birthday.svg`} alt="image" />
                  </div>
                </div>
                <div className="birthday-details">
                  <a href={`${reactHandler.props.siteurl}/SitePages/birthday.aspx?ItemID=` + ItemId + ""} data-interception='off'>
                    <h4 data-tip data-for={"React-tooltip-title-today-" + key + ""} data-custom-class="tooltip-custom"> {Name} </h4>
                  </a>
                  <p data-tip data-for={"React-tooltip-Desig-today-" + key + ""} data-custom-class="tooltip-custom"> {item.Designation}  </p>


                </div>
              </div>
            </div>
          );
        }
        else {
          {/* var ImgObj = JSON.parse(RawImageTxt);   */ }
          return (
            <div className="sec">
              <div className="heading clearfix" id="spotlight-title" >

                <span id="highlights-type" > Birthday </span>

              </div>
              <div className="section-part clearfix">
                <div className="birthday-image relative">
                  <img src={`${reactHandler.props.siteurl}/SiteAssets/img/userphoto.jpg`} alt="image" />
                  <div className="birday-icons">
                    <img src={`${reactHandler.props.siteurl}/SiteAssets/img/birthday.svg`} alt="image" />
                  </div>
                </div>
                <div className="birthday-details">
                  <a href={`${reactHandler.props.siteurl}/SitePages/birthday.aspx?ItemID=` + ItemId + ""} data-interception='off'>
                    <h4 data-tip data-for={"React-tooltip-title-today-" + key + ""} data-custom-class="tooltip-custom"> {Name} </h4>
                  </a>
                  <p data-tip data-for={"React-tooltip-Desig-today-" + key + ""} data-custom-class="tooltip-custom"> {item.Designation}  </p>


                </div>
              </div>
            </div>
          );
        }
      } else {

      }

      // }
    });
    const UpcomingBirthday: JSX.Element[] = this.state.UpcomingBirthday.map(function (item, key) {
      var ItemId = item.Id
      var Name = "";
      var BdayDt = moment(item.DOB).format("DD MMM");
      let Tday1Bday = moment().format("MM/DD");
      let RawImageTxt = item.Picture;
      let Bdaydate = moment(item.DOB).format("MM/DD");
      if (item.Name != "") {

        if (Bdaydate > Tday1Bday && moment(Bdaydate, 'MM/DD') <= moment(reactHandler.state.LastBdayDate, 'MM/DD') && moment(Bdaydate, 'MM/DD') >= moment(reactHandler.state.FirstBdayDate, 'MM/DD')) {           //&& Bdaydate <= moment(reactHandler.state.LastBdayDate,"MM/DD").format("MM/DD")     
          Name = item.Name;
          if (RawImageTxt != "" && RawImageTxt != null) {
            var ImgObj = JSON.parse(RawImageTxt);
            return (
              <div className="sec">
                <div className="heading" id="spotlight-title">

                  <span id="highlights-type" className="clearfix" style={{ cursor: "default" }}> Upcoming Birthday </span>
                  {/* <span className="bday-date-cls" title={BdayDt}>{BdayDt}</span> */}

                </div>
                <div className="section-part clearfix">
                  <div className="birthday-image relative">
                    <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
                    <div className="birday-icons">
                      <img src={`${reactHandler.props.siteurl}/SiteAssets/img/birthday.svg`} alt="image" />
                    </div>
                  </div>
                  <div className="birthday-details">
                    <a href={`${reactHandler.props.siteurl}/SitePages/birthday.aspx?ItemID=` + ItemId + ""} data-interception='off'>
                      <h4 data-tip data-for={"React-tooltip-title-today-" + key + ""} data-custom-class="tooltip-custom"> {Name} </h4>
                    </a>
                    <p data-tip data-for={"React-tooltip-Desig-today-" + key + ""} data-custom-class="tooltip-custom"> {item.Designation}  </p>
                    {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                  </div>
                </div>
              </div>
            );
          }
          else {
            var ImgObj = JSON.parse(RawImageTxt);
            return (
              <div className="sec">
                <div className="heading" id="spotlight-title">

                  <span id="highlights-type" className="clearfix" style={{ cursor: "default" }}> Upcoming Birthday </span>
                  {/* <span className="bday-date-cls" title={BdayDt}>{BdayDt}</span> */}

                </div>
                <div className="section-part clearfix">
                  <div className="birthday-image relative">
                    <img src={`${reactHandler.props.siteurl}/SiteAssets/img/userphoto.jpg`} alt="image" />

                    <div className="birday-icons">
                      <img src={`${reactHandler.props.siteurl}/SiteAssets/img/birthday.svg`} alt="image" />
                    </div>
                  </div>
                  <div className="birthday-details">
                    <h4 data-tip data-for={"React-tooltip-title-today-" + key + ""} data-custom-class="tooltip-custom"> {Name} </h4>
                    {/*<ReactTooltip id={"React-tooltip-title-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{Name}</span>
                                </ReactTooltip>*/}
                    <p data-tip data-for={"React-tooltip-Desig-today-" + key + ""} data-custom-class="tooltip-custom"> {item.Designation}  </p>
                    {/*<ReactTooltip id={"React-tooltip-Desig-today-"+key+""} place="top" type="dark" effect="solid">
                                  <span>{item.Designation}</span>
                              </ReactTooltip> */}
                  </div>
                </div>
              </div>
            );
          }
        }

      }
    });
    return (
      <div className={styles.highlights} id="bday-highlights">
        <div className="birthday-wrap m-b-20" id="if-birthdays-present">
          <div id="today-bday" style={{ display: "none" }}>
            <Slider {...settings} className='hero-banner-container-wrap' >
              {TodayBirthday}
              {UpcomingBirthday}
            </Slider>
          </div>
          <div id="upcoming-bday" style={{ display: "none" }}>
            <Slider {...settings} className='hero-banner-container-wrap' >
              {UpcomingBirthday}
            </Slider>
          </div>
        </div>
        <div className="birthday-wrap m-b-20" id="if-no-birthdays-present" style={{ display: "none" }} >
          <div className="sec">
            <div className="heading clearfix ">

              <h4 >
                Birthday
              </h4>

            </div>
            <p className="text-center" > No Birthday's at this moment.  </p>
          </div>
        </div>
      </div>
    )
  }
}