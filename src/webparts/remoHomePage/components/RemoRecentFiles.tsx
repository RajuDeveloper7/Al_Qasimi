import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { ServiceProvider } from '../components/services/ServiceProvider';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as $ from 'jquery';
import { ICamlQuery } from "@pnp/sp/lists";
import "@pnp/sp/folders";
import { sp } from "@pnp/sp";
import { Web } from "@pnp/sp/webs";
import { Item, Items } from '@pnp/sp/items';
import * as moment from 'moment';

export interface IMyRecentFilesState {
  myonedriveRecentData: any[];
}

export default class RemoRecentFiles extends React.Component<IRemoHomePageProps, IMyRecentFilesState, {}> {
  private serviceProvider;
  public constructor(props: IRemoHomePageProps, state: IMyRecentFilesState) {
    super(props);
    this.serviceProvider = new ServiceProvider(this.props.context);

    this.state = {
      myonedriveRecentData: [],
    }
  }

  public componentDidMount() {

    this.GetMyOneDriveRecents();
    this.calculateDynamicHeight();
  }


  public GetMyOneDriveRecents() {
    this.serviceProvider.
      getMyDriveRecents()
      .then(
        (result: any[]): void => {
          this.setState({ myonedriveRecentData: result });
        }
      )
      .catch(error => {
        console.log(error);
      });
  }
  public calculateDynamicHeight() {
    setTimeout(function () {
      let nwsheight = document.getElementById('m-b-20-news').offsetHeight;
      let socialHeight = document.getElementById('latest-news-announcemnst').offsetHeight;
      let videoHeight = document.getElementById('social-and-gallery').offsetHeight;

      // let HomeFooter = document.getElementById('Homepage_Footerbar').offsetHeight;
      let TotalHeightLeft = nwsheight + socialHeight + videoHeight//+HomeFooter;

      let weatherHeight = document.getElementById('m-b-20-weather').offsetHeight;
      let Highlights = document.getElementById('bday-highlights').offsetHeight;
      let pQlinkHeight = 0;
      let TotalHeightRight = 0;
      let TotalCalculatedHeight;
      var Focusthis = $('#m-b-20-PQlink');
      if (Focusthis.length) {
        pQlinkHeight = document.getElementById('m-b-20-PQlink').offsetHeight;
        TotalHeightRight = weatherHeight + Highlights + pQlinkHeight;

        TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight + 25;// +30 - 37; 66;//47;//66 ;
        $("#dynamic-height-recentsfiles").css("height", "" + TotalCalculatedHeight + "");
      } else {
        TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight + 25;// +30 - 37;  47;//66 ;
        $("#dynamic-height-recentsfiles").css("height", "" + TotalCalculatedHeight + "");

      }
      //console.log("news:"+nwsheight+"Social:"+socialHeight+"Vide:"+videoHeight+"weath:"+weatherHeight+"Pqlink:"+pQlinkHeight+"bday:"+Highlights);

    }, 1500);
    setTimeout(function () {
      let nwsheight = document.getElementById('m-b-20-news').offsetHeight;
      let socialHeight = document.getElementById('latest-news-announcemnst').offsetHeight;
      let videoHeight = document.getElementById('social-and-gallery').offsetHeight;
      // let HomeFooter = document.getElementById('Homepage_Footerbar').offsetHeight;
      let TotalHeightLeft = nwsheight + socialHeight + videoHeight //+HomeFooter;


      let weatherHeight = document.getElementById('m-b-20-weather').offsetHeight;
      let Highlights = document.getElementById('bday-highlights').offsetHeight;
      let pQlinkHeight = 0;
      let TotalHeightRight = 0;
      let TotalCalculatedHeight;
      var Focusthis = $('#m-b-20-PQlink');
      if (Focusthis.length) {
        pQlinkHeight = document.getElementById('m-b-20-PQlink').offsetHeight;
        TotalHeightRight = weatherHeight + Highlights + pQlinkHeight;

        TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight + 25;// - 37;  - 66;//47;//66 ;
        $("#dynamic-height-recentsfiles").css("height", "" + TotalCalculatedHeight + "");
      } else {
        TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight + 25;// - 37; - 47;//66 ;
        $("#dynamic-height-recentsfiles").css("height", "" + TotalCalculatedHeight + "");

      }
      //console.log("news:"+nwsheight+"Social:"+socialHeight+"Vide:"+videoHeight+"weath:"+weatherHeight+"Pqlink:"+pQlinkHeight+"bday:"+Highlights);

    }, 2000);
    setTimeout(function () {
      let nwsheight = document.getElementById('m-b-20-news').offsetHeight;
      let socialHeight = document.getElementById('latest-news-announcemnst').offsetHeight;
      let videoHeight = document.getElementById('social-and-gallery').offsetHeight;
      //let HomeFooter = document.getElementById('Homepage_Footerbar').offsetHeight;
      let TotalHeightLeft = nwsheight + socialHeight + videoHeight//+HomeFooter;


      let weatherHeight = document.getElementById('m-b-20-weather').offsetHeight;
      let Highlights = document.getElementById('bday-highlights').offsetHeight;
      let pQlinkHeight = 0;
      let TotalHeightRight = 0;
      let TotalCalculatedHeight;
      var Focusthis = $('#m-b-20-PQlink');
      if (Focusthis.length) {
        pQlinkHeight = document.getElementById('m-b-20-PQlink').offsetHeight;
        TotalHeightRight = weatherHeight + Highlights + pQlinkHeight;

        TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight + 25;// - 37; 66;//47;//66 ;
        $("#dynamic-height-recentsfiles").css("height", "" + TotalCalculatedHeight + "");
      } else {
        TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight + 25;// - 37;  47;//66 ;
        $("#dynamic-height-recentsfiles").css("height", "" + TotalCalculatedHeight + "");
      }
      //console.log("news:"+nwsheight+"Social:"+socialHeight+"Vide:"+videoHeight+"weath:"+weatherHeight+"Pqlink:"+pQlinkHeight+"bday:"+Highlights);

    }, 4000);
    setTimeout(function () {
      let nwsheight = document.getElementById('m-b-20-news').offsetHeight;
      let socialHeight = document.getElementById('latest-news-announcemnst').offsetHeight;
      let videoHeight = document.getElementById('social-and-gallery').offsetHeight;
      // let HomeFooter = document.getElementById('Homepage_Footerbar').offsetHeight;
      let TotalHeightLeft = nwsheight + socialHeight + videoHeight//+HomeFooter;


      let weatherHeight = document.getElementById('m-b-20-weather').offsetHeight;
      let Highlights = document.getElementById('bday-highlights').offsetHeight;
      let pQlinkHeight = 0;
      let TotalHeightRight = 0;
      let TotalCalculatedHeight;
      var Focusthis = $('#m-b-20-PQlink');
      if (Focusthis.length) {
        pQlinkHeight = document.getElementById('m-b-20-PQlink').offsetHeight;
        TotalHeightRight = weatherHeight + Highlights + pQlinkHeight;

        TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight + 25;// - 37; 66;//47;//66 ;
        $("#dynamic-height-recentsfiles").css("height", "" + TotalCalculatedHeight + "");
      } else {
        TotalCalculatedHeight = TotalHeightLeft - TotalHeightRight + 25;// - 47;//66 ;
        $("#dynamic-height-recentsfiles").css("height", "" + TotalCalculatedHeight + "");

      }
      //console.log("news:"+nwsheight+"Social:"+socialHeight+"Vide:"+videoHeight+"weath:"+weatherHeight+"Pqlink:"+pQlinkHeight+"bday:"+Highlights);

    }, 7000);
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    var reactHandler = this;
    const OneDriveRecents: JSX.Element[] = reactHandler.state.myonedriveRecentData.map(function (item, key) {
      var FileTypeImg;
      var filename = item.name;
      var Len = filename.length;
      var Dot = filename.lastIndexOf(".");
      var extension = filename.substring(Dot + 1, Len);
      if (extension != "csv") {
        if (extension == 'docx' || extension == 'doc' || extension == 'pdf' || extension == 'xlsx' || extension == 'pptx' || extension == 'url' || extension == 'txt' || extension == 'css' || extension == 'sppkg' || extension == 'ts' || extension == 'tsx' || extension == 'html' || extension == 'aspx' || extension == 'ts' || extension == 'js' || extension == 'map' || extension == 'php' || extension == 'json' || extension == 'xml' ||
          extension == 'png' || extension == 'PNG' || extension == 'JPG' || extension == 'JPEG' || extension == 'SVG' || extension == 'svg' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif' ||
          extension == "zip" || extension == "rar") {
          if (extension == 'docx' || extension == 'doc') {
            FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/WordFluent.png`;
          }
          if (extension == 'pdf') {
            FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/pdf.svg`;
          }
          if (extension == 'xlsx') {
            FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/ExcelFluent.png`;
          }
          if (extension == 'pptx') {
            FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/PPTFluent.png`;
          }
          if (extension == 'url') {
            FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/URL.png`;
          }
          if (extension == 'txt') {
            FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/txt.svg`;
          }
          if (extension == 'css' || extension == 'sppkg' || extension == 'ts' || extension == 'tsx' || extension == 'html' || extension == 'aspx' || extension == 'ts' || extension == 'js' || extension == 'map' || extension == 'php' || extension == 'json' || extension == 'xml') {
            FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/Code.svg`;
          }
          if (extension == 'png' || extension == 'PNG' || extension == 'JPG' || extension == 'JPEG' || extension == 'SVG' || extension == 'svg' || extension == 'jpg' || extension == 'jpeg' || extension == 'gif') {
            FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/photo.svg`;
          }
          if (extension == "zip" || extension == "rar") {
            FileTypeImg = `${reactHandler.props.siteurl}/SiteAssets/img/FluentIcons/zip.svg`;
          }
          return (
            <li>
              <a href={item.webUrl} data-interception="off" target="_blank" className="clearfix">
                <img src={FileTypeImg} alt="images" />
                <div className="recent-files-block clearfix">
                  <div className="recent-files-wrap-left">
                    <h4 className="name-resp"> {item.name} </h4>
                    <h5> {extension} </h5>
                  </div>
                  <div className="recent-files-wrap-right">
                    <h5> {moment(item.lastModifiedDateTime).format('MMM DD h:mm a')} </h5>
                  </div>
                </div>
              </a>
            </li>
          );
        }
      }

    });
    return (
      <div className={styles.myRecentFiles}>
        <div className="recent-file-wrap">
          <div className="sec" id="dynamic-height-recentsfiles-1">
            <div className="heading">
              Recent Files
            </div>
            <div className="section-part clearfix" id="dynamic-height-recentsfiles">
              <ul>
                {OneDriveRecents}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
