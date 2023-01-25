import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';


export interface IGallerySocialMediaState {
  Items: any[];
}

SPComponentLoader.loadScript("https://platform.twitter.com/widgets.js");
SPComponentLoader.loadScript("https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v15.0");
//SPComponentLoader.loadScript("https://www.instagram.com/static/bundles/es6/EmbedSDK.js/ab12745d93c5.js");
export default class RemoSocialMedia extends React.Component<IRemoHomePageProps, IGallerySocialMediaState, {}> {
  public constructor(props: IRemoHomePageProps, state: IGallerySocialMediaState) {
    super(props);
    this.state = {
      Items: [],
    };
  }

  public componentDidMount() {
    this.OpenSocialMedia("twitter")
  }

  public OpenSocialMedia(SelectedMedium) {
    if (SelectedMedium == "fb") {
      $(".facebook").addClass("active")
      $(".twitter").removeClass("active")
      $(".instagram").removeClass("active")
      $(".twitter").removeClass("active")
      $(".linkedin").removeClass("active")

      $("#FB").show();
      $("#TWITT").hide();
      $("#INSTA").hide();
      $("#LINKEDIN").hide();
    }
    else if (SelectedMedium == "insta") {
      $(".facebook").removeClass("active")
      $(".twitter").removeClass("active")
      $(".instagram").addClass("active")
      $(".linkedin").removeClass("active")

      $("#FB").hide();
      $("#TWITT").hide();
      $("#INSTA").show();
      $("#LINKEDIN").hide();
    }
    else if (SelectedMedium == "twitter") {
      $(".facebook").removeClass("active")
      $(".twitter").addClass("active")
      $(".instagram").removeClass("active")
      $(".linkedin").removeClass("active")

      $("#FB").hide();
      $("#TWITT").show();
      $("#INSTA").hide();
      $("#LINKEDIN").hide();
    }

    else if (SelectedMedium == "linkedin") {
      $(".facebook").removeClass("active")
      $(".twitter").removeClass("active")
      $(".instagram").removeClass("active")
      $(".linkedin").addClass("active")

      $("#FB").hide();
      $("#TWITT").hide();
      $("#INSTA").hide();
      $("#LINKEDIN").show();
    }
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    return (
      <div className="col-md-6">
        <div className="social-medial-wrap">

          <ul className="clearfix">
            <li className="twitter"><a href="#" onClick={() => this.OpenSocialMedia("twitter")}> <img src={`${this.props.siteurl}/SiteAssets/img/s3.svg`} alt="image" /></a> </li>
            <li className="facebook"><a href="#" onClick={() => this.OpenSocialMedia("fb")}> <img src={`${this.props.siteurl}/SiteAssets/img/s1.svg`} alt="image" /></a> </li>
            {/* <li className="instagram"><a href="#" onClick={() => this.OpenSocialMedia("insta")}>  <img src={`${this.props.siteurl}/SiteAssets/img/s2.svg`} alt="image" /></a> </li>
            <li className="linkedin"><a href="#" onClick={() => this.OpenSocialMedia("linkedin")}> <img src={`${this.props.siteurl}/SiteAssets/img/s4.svg`} alt="image" /> </a></li> */}
          </ul>

          <div className="main-social-media-block sec" id="TWITT" style={{ display: "none" }}>
            {/* <iframe src='https://www.sociablekit.com/app/embed/64772' width='100%' height='1000' style={{ width: "100%" }}></iframe> */}
            <a className="twitter-timeline" data-width="521" data-height="201" data-theme="light" href="https://twitter.com/AlQasimiFound?ref_src=twsrc%5Etfw"></a>
          </div>

          <div className="main-social-media-block sec" id="FB" style={{ display: "none" }}>
            {/* <iframe src='https://www.sociablekit.com/app/embed/64772' width='100%' height='1000'></iframe> */}

            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FAlQasimiFoundation&tabs=timeline&width=360&height=500&small_header=true&adapt_container_width=false&hide_cover=true&show_facepile=true&appId"
              width="360" height="500" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder={0} allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </div>

          <div className="main-social-media-block sec" id="INSTA" style={{ display: "none" }}>
            {/* <iframe src='http://instagram.com/p/qbq6fIJMVZ' width='100%' height='1000' style={{ width: "100%" }}></iframe> */}

          </div>

          <div className="main-social-media-block sec" id="LINKEDIN" style={{ display: "none" }}>
            {/* <iframe src='https://www.sociablekit.com/app/embed/64771' width='100%' height='290'></iframe> */}
          </div>
        </div>
      </div>

    )
  }
}