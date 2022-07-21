import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import { Item } from '@pnp/sp/items';

export interface IGallerySocialMediaState {
  Items: any[];
}


export default class RemoSocialMedia extends React.Component<IRemoHomePageProps, IGallerySocialMediaState, {}> {
  public constructor(props: IRemoHomePageProps, state: IGallerySocialMediaState) {
    super(props);
    this.state = {
      Items: [],
    };
  }

  public componentDidMount() {
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
              <li className="facebook active"><a href="#" onClick={() => this.OpenSocialMedia("fb")}> <img src={`${this.props.siteurl}/SiteAssets/img/s1.svg`} alt="image" /></a> </li>
              <li className="instagram"><a href="#" onClick={() => this.OpenSocialMedia("insta")}>  <img src={`${this.props.siteurl}/SiteAssets/img/s2.svg`} alt="image" /></a> </li>
              <li className="twitter"><a href="#" onClick={() => this.OpenSocialMedia("twitter")}> <img src={`${this.props.siteurl}/SiteAssets/img/s3.svg`} alt="image" /></a> </li>
              <li className="linkedin"><a href="#" onClick={() => this.OpenSocialMedia("linkedin")}> <img src={`${this.props.siteurl}/SiteAssets/img/s4.svg`} alt="image" /> </a></li>
            </ul>
            <div className="main-social-media-block sec" id="LINKEDIN">
              <iframe src='https://www.sociablekit.com/app/embed/64771' width='100%' height='290'></iframe>
            </div>
            <div className="main-social-media-block sec" id="TWITT" style={{ display: "none" }}>
              <iframe src='https://www.sociablekit.com/app/embed/64772' width='100%' height='1000' style={{ width: "100%" }}></iframe>
            </div>
            <div className="main-social-media-block sec" id="FB" style={{ display: "none" }}>
              <iframe src='https://www.sociablekit.com/app/embed/64772' width='100%' height='1000'></iframe>
            </div>
            <div className="main-social-media-block sec" id="INSTA" style={{ display: "none" }}>
              <iframe src='https://www.sociablekit.com/app/embed/64772' width='100%' height='1000' style={{ width: "100%" }}></iframe>
            </div>

          </div>
        </div>
      
    )
  }
}