import * as React from 'react';
import styles from './HeroBannerViewMore.module.scss';
import { IHeroBannerViewMoreProps } from './IHeroBannerViewMoreProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as $ from 'jquery';
import Slider from "react-slick";
import * as moment from 'moment';
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";
import { sp } from '@pnp/sp';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';

export interface IHeroBannerVmState {
  Items: any[];
}

export default class HeroBannerViewMore extends React.Component<IHeroBannerViewMoreProps, IHeroBannerVmState, {}> {
  constructor(props: IHeroBannerViewMoreProps, state: IHeroBannerVmState) {
    super(props);
    this.state = {
      Items: []
    };
  }

  public componentDidMount() {
    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
    }, 2000);

    var reactHandler = this;
    reactHandler.GetBanner();
  }

  private async GetBanner() {
    var reactHandler = this;
    const d = new Date().toISOString();
    await sp.web.lists.getByTitle("Hero Banner").items.select("Title", "Description", "Created", "Image", "ID").filter(`IsActive eq 1 and ExpiresOn ge datetime'${d}'`).get().then((items) => {
      reactHandler.setState({
        Items: items
      });
    });
  }
  public render(): React.ReactElement<IHeroBannerViewMoreProps> {
    var handler = this;
    var Dt = "";
    const BannerAllDetails: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      let dummyElement = document.createElement("DIV");
      dummyElement.innerHTML = item.Description;
      var outputText = dummyElement.innerText;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");

      var tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt == tdaydt) {
        Dt = "Today";
      } else {
        Dt = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
      }

      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <a href="#" className="tags" data-interception="off"> {Dt} </a>
            <div className="ns-tag-duration ">

              <a href={`${handler.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${item.ID}`} data-interception='off' className="nw-list-main top-news-a"> {item.Title} </a>
            </div>
          </li>
        );
      }
      else if (RawImageTxt == "" || RawImageTxt == null) {
        return (
          <li>
            <div className="top-img-wrap">
              <img src={`${handler.props.siteurl}/SiteAssets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
            </div>
            <a href="#" className="tags" data-interception="off"> {Dt} </a>
            <div className="ns-tag-duration ">

              <a href={`${handler.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${item.ID}`} data-interception='off' className="nw-list-main top-news-a"> {item.Title} </a>
            </div>
          </li>
        );
      }
    });
    return (
      <div className={styles.heroBannerVm} id="heroBannerVm">

        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">

            <div className="section-rigth">

              <div className="inner-banner-header relative m-b-20">

                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Home Banner </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home</a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off">Hero Banner View More </a> </li>
                  </ul>
                </div>

              </div>
              <div className="inner-page-contents banner-viewall">

                <div className="top-news-sections category-news-sec m-b-20">
                  <div className="sec">

                    <div className="row">
                      <div className="col-md-12">

                        <div className="section-part clearfix">
                          <ul>
                            {BannerAllDetails}
                          </ul>
                        </div>
                      </div>
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
