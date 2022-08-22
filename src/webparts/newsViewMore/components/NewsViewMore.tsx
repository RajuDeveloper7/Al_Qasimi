import * as React from 'react';
import styles from './NewsViewMore.module.scss';
import { INewsViewMoreProps } from './INewsViewMoreProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import { SPComponentLoader } from '@microsoft/sp-loader';
import Slider from "react-slick";
import { Items } from '@pnp/sp/items';
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';


export interface INewsVmState {
  Items: any[];
  RecentNewsItems: any[];
  ViewBasedTopNews: any[];
  OneWkOldNews: any[];
  status: boolean;
  AvailableDepts: any[];
  DeptNewsArr: any[];
}

let NewsAvailableDepts = [];
let DeptNames = [];
let DeptNamesExitsUnique = [];
let DeptWithBanner = [];
let DepartmentBasedNewsFinal = [];
let DeptNews = [];
let rawarr = [];

var NewWeb;
export default class NewsVm extends React.Component<INewsViewMoreProps, INewsVmState, {}> {
  constructor(props: INewsViewMoreProps, state: INewsVmState) {
    super(props);
    this.state = {
      Items: [],
      RecentNewsItems: [],
      ViewBasedTopNews: [],
      OneWkOldNews: [],
      status: false,
      AvailableDepts: [],
      DeptNewsArr: []
    };
    NewWeb = Web(this.props.siteurl)
  }

  public componentDidMount() {
    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#RecommendedItems').attr('style', 'display: none !important');
    }, 2000);

    var reactHandler = this;
    reactHandler.GetAllNews();
    reactHandler.GetAllTopNews();
    reactHandler.GetAllNewsAvailableDepartments();
    reactHandler.GetWeekOldNews();
  }

  private async GetAllNews() {
    var reactHandler = this;
    await NewWeb.lists.getByTitle("News").items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id").filter("IsActive eq 1").orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").top(1).get().then((items) => {

      reactHandler.setState({
        Items: items
      });
      let ItemID = items[0].Id;
      reactHandler.GetAllRecentNews(ItemID);
    });
  }

  private async GetAllRecentNews(ID) {
    var reactHandler = this;
    await NewWeb.lists.getByTitle("News").items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id").filter(`IsActive eq '1' and ID ne '${ID}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").top(4).get().then((items) => {

      reactHandler.setState({
        RecentNewsItems: items
      });
    });
  }

  private async GetAllTopNews() {
    var reactHandler = this;
    var today = moment().format('YYYY-MM-DD');
    var dateFrom = moment(today, 'YYYY-MM-DD').subtract(1, 'months').endOf('month').format('YYYY-MM-DD');

    await NewWeb.lists.getByTitle("News").items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id", "PageViewCount").filter(`IsActive eq '1'`).orderBy("PageViewCount", false).expand("Dept", "SitePageID", "TransactionItemID").get().then((items) => {

      if (items.length != 0) {
        $(".top-news-block-current-month").show();
        reactHandler.setState({
          ViewBasedTopNews: items
        });
      } else {
        $(".top-news-block-current-month").hide();
      }
    });
  }

  public async GetWeekOldNews() {
    var reactHandler = this;
    let today = moment().format("YYYY-MM-DD");
    let WkDate = moment(today, "YYYY-MM-DD").subtract(1, "week").format("YYYY-MM-DD");
    await NewWeb.lists.getByTitle("News").items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id",).filter(`IsActive eq '1' and Created lt '${WkDate}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").top(20).get().then((items) => {

      if (items.length != 0) {
        $(".PastNewsData").show();
        reactHandler.setState({
          OneWkOldNews: items
        });
      } else {
        $(".PastNewsData").hide();
      }
    });
  }

  private async GetAllNewsAvailableDepartments() {
    var i
    NewsAvailableDepts = [];
    DeptNames = [];
    DeptNamesExitsUnique = [];
    var reactHandler = this;
    await NewWeb.lists.getByTitle("News").items.select("ID", "Dept/Id", "Dept/Title", "Image",).filter(`IsActive eq '1'`).orderBy("Created", false).expand("Dept").get().then((items) => {

      for (var i = 0; i < items.length; i++) {
        if (items[i].Dept == undefined) {

        } else {
          var DeptName = items[i].Dept.Title;
          var DeptID = items[i].Dept.Title;

        }

        DeptNames.push(DeptName);
        if (reactHandler.findValueInArray(DeptName, DeptNamesExitsUnique)) {
        }
        else {
          if (reactHandler.findValueInArray(DeptName, DeptNames)) {
            DeptNamesExitsUnique.push(DeptName);
            let RawImageTxt = items[i].Image;
            if (RawImageTxt != "" && RawImageTxt != null) {

              var ImgObj = JSON.parse(RawImageTxt);
              var PicUrl = ImgObj.serverRelativeUrl;
              NewsAvailableDepts.push({ "ID": DeptID, "Title": DeptName, "URL": PicUrl });
            }
          }
        }
      }
      reactHandler.setState({ AvailableDepts: NewsAvailableDepts });
      console.log(reactHandler.state.AvailableDepts);
      reactHandler.GetDeptNews();

    });
  }


  public async GetDeptNews() {
    var reactHandler = this;
    for (var j = 0; j < this.state.AvailableDepts.length;) {
      var string = this.state.AvailableDepts[j].Title;
      var Title = string.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
      var CustomID = "" + Title + "-Dept-News";
      var DeptID = this.state.AvailableDepts[j].ID;
      if (DeptID != "" || DeptID != undefined || DeptID != null) {

        await NewWeb.lists.getByTitle("News").items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id").filter(`IsActive eq '1' and Dept/Id eq '${DeptID}'`).orderBy("Created", false).expand("Dept", "SitePageID", "TransactionItemID").top(4).get().then((items) => {

          for (var i = 0; i < items.length;) {
            $("#" + CustomID + "").append(`<li><a href="${items[i].DetailsPageUrl}?ItemID=${items[i].ID}&AppliedTag=${items[i].Tag}&Dept=${items[i].Dept.Title}&SitePageID=${items[i].SitePageID.Id}&env=WebView" data-interception="off"><p>${items[i].Title}</p></a></li>`);
            i++;
          }
          j++;
        });
      }
    }
  }

  public SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <a href="#" className={className} onClick={onClick}> <img src={`${this.props.siteurl}/SiteAssets/img/right.svg`} alt="image" data-interception="off" /> </a>
    );
  }

  public SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <a href="#" className={className} onClick={onClick}> <img src={`${this.props.siteurl}/SiteAssets/img/left.svg`} alt="image" data-interception="off" /> </a>
    );
  }

  public findValueInArray(value, arr) {
    var result = false;
    for (var i = 0; i < arr.length; i++) {
      var name = arr[i];
      if (name == value) {
        result = true;
        break;
      }
    }
    return result;
  }

  public render(): React.ReactElement<INewsViewMoreProps> {
    const settings = {
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      autoplay: false,
      slidesToShow: 5, //Value Comes From State
      slidesToScroll: 4,
      draggable: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            infinite: true,
            dots: false,
            arrows: false,
            autoplay: false,
            centerMode: false
          }
        }
      ]
      /*prevArrow: <this.SamplePrevArrow />,
      nextArrow: <this.SampleNextArrow />*/
    };

    var reactHandler = this;
    var Dt = "";
    var Dte = "";
    const TopRecentNews: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
        var tdaydt = moment().format("DD/MM/YYYY");
        if (RawPublishedDt == tdaydt) {
          Dt = "Today";
        } else {
          Dt = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
        }
        if (item.Dept != undefined) {
          var depttitle = item.Dept.Title
        }
        if (item.SitePageID != undefined) {
          var sitepageid = item.SitePageID.Id
        }

        return (
          <div className="view-all-news-recent-left">
            <div className="view-all-news-recent-img-cont">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="ns-tag-duration clearfix">
              <div className="pull-left">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
              </div>
              <div className="pull-right">
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="image" />  {Dt}
              </div>
            </div>
            <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main"> {item.Title} </a>
          </div>
        );
      } else {
        return (
          <div className="view-all-news-recent-left">
            <div className="view-all-news-recent-img-cont">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <div className="ns-tag-duration clearfix">
              <div className="pull-left">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
              </div>
              <div className="pull-right">
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="image" />  {Dt}
              </div>
            </div>
            <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main"> {item.Title} </a>
          </div>
        );
      }
    });

    const TopRecentOtherNews: JSX.Element[] = this.state.RecentNewsItems.map(function (item, key) {
      let RawImageTxt = item.Image;
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
        var tdaydt = moment().format("DD/MM/YYYY");
        if (RawPublishedDt == tdaydt) {
          Dte = "Today";
        } else {
          Dte = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
        }
        if (item.Dept != undefined) {
          var depttitle = item.Dept.Title
        }
        if (item.SitePageID != undefined) {
          var sitepageid = item.SitePageID.Id
        }

        return (
          <li className="clearfix">
            <div className="list-li-recent-news-img">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="list-li-recent-news-desc">
              <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main"> {item.Title} </a>
              <div className="ns-tag-duration ">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> <p> {Dte} </p>
              </div>
            </div>
          </li>
        );
      } else {
        return (
          <li className="clearfix">
            <div className="list-li-recent-news-img">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <div className="list-li-recent-news-desc">
              <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main"> {item.Title} </a>
              <div className="ns-tag-duration ">
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a> <p> {Dte} </p>
              </div>
            </div>
          </li>
        );
      }
    });

    const TopNewsBasedonViews: JSX.Element[] = this.state.ViewBasedTopNews.map(function (item, key) {
      let RawImageTxt = item.Image;
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
        var tdaydt = moment().format("DD/MM/YYYY");
        if (RawPublishedDt == tdaydt) {
          Dte = "Today";
        } else {
          Dte = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
        }
        if (item.Dept != undefined) {
          var depttitle = item.Dept.Title
        }
        if (item.SitePageID != undefined) {
          var sitepageid = item.SitePageID.Id
        }

        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
            </div>
          </li>
        );
      } else {
        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
            </div>
          </li>
        );
      }
    });

    const OneWkOldNews: JSX.Element[] = this.state.OneWkOldNews.map(function (item, key) {
      let RawImageTxt = item.Image;
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        if (item.Dept != undefined) {
          var depttitle = item.Dept.Title
        }
        if (item.SitePageID != undefined) {
          var sitepageid = item.SitePageID.Id
        }

        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
            </div>
          </li>
        );
      } else {
        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main top-news-a"> {item.Title} </a>
            <div className="ns-tag-duration ">
              <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className="tags"> {item.Tag} </a>
            </div>
          </li>
        );
      }
    });

    const AllDepartmentNews: JSX.Element[] = this.state.AvailableDepts.map(function (item, key) {
      var string = item.Title;
      var Title = string.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
      var CustomID = "" + Title + "-Dept-News";

      return (
        <div className="col-md-3  m-b-0">
          <div className="heading clearfix">
            <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=DeptBased&Dept=${item.Title}`} data-interception='off'>
              {item.Title}
            </a>
          </div>
          <div className="section-part">
            <img src={`${item.URL}`} alt="image" />
            <ul id={`${Title}-Dept-News`}>

            </ul>
          </div>
        </div>
      );
    });
    return (
      <div className={styles.newsVm} id="newsVm">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> News </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> All News </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="row">
                    <div className="col-md-6 view-all-news-l-col">
                      {TopRecentNews}
                    </div>
                    <div className="col-md-6">
                      <div className="list-news-latests">
                        <ul>
                          {TopRecentOtherNews}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="top-news-sections m-b-20 top-news-block-current-month" style={{ display: "none" }}>
                  <div className="sec">
                    <div className="heading clearfix">
                      <div className="pull-left">
                        Top News
                      </div>
                      <div className="pull-right">

                      </div>
                    </div>
                    <div className="section-part newsvm clearfix">
                      <ul>
                        <Slider {...settings} className='hero-banner-container-wrap' >
                          {TopNewsBasedonViews}
                        </Slider>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="education-government-track sec m-b-20">
                  <div className="row dept-based-news-block">
                    <Slider {...settings} className='hero-banner-container-wrap' >
                      {AllDepartmentNews}
                    </Slider>
                  </div>
                </div>
                <div className="top-news-sections m-b-20 PastNewsData" style={{ display: "none" }}>
                  <div className="sec">
                    <div className="heading clearfix">
                      <div className="pull-left">
                        Past News
                      </div>
                      <div className="pull-right">

                      </div>
                    </div>
                    <div className="section-part newsvm clearfix">
                      <ul>
                        <Slider {...settings} className='hero-banner-container-wrap' >
                          {OneWkOldNews}
                        </Slider>
                      </ul>
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
