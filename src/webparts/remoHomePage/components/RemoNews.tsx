import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import Slider from "react-slick";
import { Items } from '@pnp/sp/items';
import { sp } from "@pnp/sp/presets/all";
import { Web } from "@pnp/sp/presets/all";
import pnp from 'sp-pnp-js';

export interface INewsState {
  Items: any[];
  ItemCount: number;
}

var NewWeb;
export default class RemoNews extends React.Component<IRemoHomePageProps, INewsState, {}> {
  slider: Slider;

  constructor(props: IRemoHomePageProps, state: INewsState) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      Items: [],
      ItemCount: 2
    };
    NewWeb = Web(this.props.siteurl);
  }

  public componentDidMount() {

    var reactHandler = this;
    reactHandler.GetNews();
  }
  private async GetNews() {
    var reactHandler = this;
    await sp.web.lists.getByTitle("News").items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id").filter("IsActive eq 1").orderBy("Created", false).expand("Dept", "SitePageID").get().then((items) => {
      if (items.length == 0) {
        $("#if-news-present").hide();
        $("#if-no-news-present").show();
      } else {
        $("#if-news-present").show();
        $("#if-no-news-present").hide();
      }
      if (items.length <= 1) {
        reactHandler.setState({ ItemCount: 1 });
      } else {
        reactHandler.setState({ ItemCount: 2 });
      }
      items.length <= 2 && $(".prev-next").hide();
      reactHandler.setState({
        Items: items
      });
    });
  }

  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    const settings = {
      dots: false,
      //arrows: true,
      infinite: true,
      speed: 500,
      autoplay: false,
      slidesToShow: this.state.ItemCount, //Value Comes From State
      slidesToScroll: 2,
      // nextArrow: <this.SampleNextArrow />,
      // prevArrow: <this.SamplePrevArrow />,
      // responsive: [
      //   {
      //     breakpoint: 1024,
      //     settings: {
      //       slidesToShow: 2,
      //       slidesToScroll: 1,
      //       infinite: true,
      //       dots: true,
      //       arrows: false,
      //       autoplay: false,
      //       centerMode: false,
      //     }
      //   }
      // ]
    };
    var viewall = `${this.props.siteurl}/SitePages/NewsViewMore.aspx?env=WebView`;
    var reactHandler = this;
    var Dt = "";
    const Newsslider: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt == tdaydt) {
        Dt = "Today";
      } else {
        Dt = "" + RawPublishedDt + "";
      }
      if (item.Dept != undefined) {
        var depttitle = item.Dept.Title
      }
      if (item.SitePageID != undefined) {
        var sitepageid = item.SitePageID.Id
      }
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <div className="news-section-block clearfix">
            <div className="news-whole-block-img">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="news-whole-block-details">
              <h4>  <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off">{item.Title}</a> </h4>
              <h5> <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time"></img> {Dt} </h5>
            </div>
          </div>
        );
      } else {
        return (
          <div className="news-section-block clearfix">
            <div className="news-whole-block-img">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="no-image-uploaded" />
            </div>
            <div className="news-whole-block-details">
              <h4>  <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off">{item.Title}</a> </h4>
              <h5> <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt="Time"></img> {Dt} </h5>
            </div>
          </div>
        );
      }
    });

    return (
      <div className={[styles.news, "m-b-15 m-b-20-news"].join(' ')} id="m-b-20-news">
        <div className="news-wrap m-b-20">
          <div className="sec event-cal">
            <div className="heading clearfix ">
              <h4>
                <a href={viewall}>
                  News
                </a>
              </h4>

              <div className="prev-next">
                <a href="#" onClick={this.previous} ><img src={`${this.props.siteurl}/SiteAssets/img/previous.svg`} alt="image" className="prev-img" /> </a>
                <a href="#" onClick={this.next}><img src={`${this.props.siteurl}/SiteAssets/img/next-2.svg`} alt="image" className="next-img" /> </a>
              </div>
            </div>
            <div className="section-part clearfix">
              <div className="news-section-wrap clearfix" >
                <Slider ref={c => (this.slider = c)} {...settings} className='hero-banner-container-wrap'>
                  {Newsslider}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}