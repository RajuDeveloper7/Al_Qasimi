import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { sp } from "@pnp/sp/presets/all";
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as $ from 'jquery';
import * as moment from 'moment';
import { Web } from "@pnp/sp/webs";
import Slider from "react-slick";
import { Settings } from 'sp-pnp-js/lib/configuration/configuration';


export interface IHeroBannerState {
  Items: any[];
  AnncCount: number;
  TotalItem: number;
}

export default class HeroBanner extends React.Component<IRemoHomePageProps, IHeroBannerState, {}> {
  constructor(props: IRemoHomePageProps, state: IHeroBannerState) {
    super(props);
    this.state = {
      Items: [],
      AnncCount: 0,
      TotalItem: 0
    };
  }

  public componentDidMount() {

    var reactHandler = this;
    reactHandler.GetBanner();
  }

  private async GetBanner() {
    const d = new Date().toISOString();
    await sp.web.lists.getByTitle("Hero Banner").items.select("Title", "Description", "ExpiresOn", "Image", "ID").filter(`IsActive eq '1' and ExpiresOn ge datetime'${d}'`).orderBy("Created", false).getAll().then((items) => { // //orderby is false -> decending          
      this.setState({
        Items: items,
        AnncCount: items.length
      });
      this.Validate();
    }).catch((err) => {
      console.log(err);
    });

  }

  public Validate() {
    var reactHandler = this;
    let Total = reactHandler.state.AnncCount;
    reactHandler.setState({ TotalItem: Total });
    if (reactHandler.state.TotalItem == 0) {
      $("#if-Banner-Exist").hide();
      $("#if-Banner-not-Exist").show();
    } else {
      $("#if-Banner-Exist").show();
      $("#if-Banner-not-Exist").hide();
    }
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    const settings = {
      dots: true,
      arrows: true,
      infinite: true,
      speed: 2500,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    var handler = this;
    const MAslider: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      let dummyElement = document.createElement("DIV");
      dummyElement.innerHTML = item.Description;
      var outputText = dummyElement.innerText;

      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <div className="item active">
            <a href={`${handler.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${item.ID}`} data-interception='off'>
              <div className="banner-parts">
                <img src={ImgObj.serverRelativeUrl} alt="image" />
                <div className="overlay"></div>
                <div className="banner-impot-contents">
                  <h4> {item.Title} </h4>
                  <p> {outputText} </p>
                </div>
              </div>
            </a>
          </div>
        );
      }
      else if (RawImageTxt == "" || RawImageTxt == null) {
        return (
          <div className="item">
            <a href={`${handler.props.siteurl}/SitePages/Hero-Banner-ReadMore.aspx?ItemID=${item.ID}`} data-interception='off'>
              <div className="banner-parts">
                <img src={`${handler.props.siteurl}/SiteAssets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
                <div className="overlay"></div>
                <div className="banner-impot-contents">
                  <h4> {item.Title} </h4>
                  <p> {outputText} </p>
                </div>
              </div>
            </a>
          </div>
        );
      }
    });
    return (
      <div className="col-md-8">
        <div id="myCarousel" className="carousel slide" data-ride="carousel">
          {/* <!-- Indicators --> */}
          {/* <ol className="carousel-indicators">
                <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
                <li data-target="#myCarousel" data-slide-to="1"></li>
                <li data-target="#myCarousel" data-slide-to="2"></li>
              </ol> */}
          <div className="carousel-inner">
            <div id="if-Banner-Exist" className='hero-banner-container-wrap'>
              <Slider {...settings} className='hero-banner-container-wrap' >
                {MAslider}
              </Slider>
            </div>
            <div id="if-Banner-not-Exist" className="background" style={{ display: "none" }}>
              <img className="err-img" src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/If_no_Content_to_show.png`} alt="no-image-uploaded" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
