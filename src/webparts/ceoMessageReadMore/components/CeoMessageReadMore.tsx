import * as React from 'react';
import styles from './CeoMessageReadMore.module.scss';
import { ICeoMessageReadMoreProps } from './ICeoMessageReadMoreProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';
import { SPComponentLoader } from '@microsoft/sp-loader';
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";
import { sp } from '@pnp/sp';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';

export interface ICeoMessageRmState {
  Items: any[];
  ItemID: number;
}
export default class CeoMessageRm extends React.Component<ICeoMessageReadMoreProps, ICeoMessageRmState, {}> {
  constructor(props: ICeoMessageReadMoreProps, state: ICeoMessageRmState) {
    super(props);
    this.state = {
      Items: [],
      ItemID: null
    };

  }

  public componentDidMount() {

    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    }, 2000);

    var reactHandler = this;
    const url: any = new URL(window.location.href);
    const ItemID = url.searchParams.get("ItemID");
    reactHandler.GetCeoMessage(ItemID);
  }

  public async GetCeoMessage(ItemID) {
    await sp.web.lists.getByTitle("CEO Message").items.select("Title", "Name", "Description", "Designation", "Image", "ID", "Created").filter(`IsActive eq '1' and Id eq ${ItemID}`).getAll().then((items) => { // //orderby is false -> decending          
      this.setState({
        Items: items, ItemID: items[0].Id
      });
    })
  }
  public render(): React.ReactElement<ICeoMessageReadMoreProps> {
    var handler = this;
    var Dte = "";
    const CEOMessageDetails: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
      var tdaydt = moment().format("DD/MM/YYYY");
      if (RawPublishedDt == tdaydt) {
        Dte = "Today";
      } else {
        Dte = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
      }
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <div className="ceo-readmore-wrap clearfix">
            <div className="ceo-radmore-left">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="ceo-radmore-right">
              <h2 className="nw-list-main">{item.Name}</h2>
              <div className="ns-tag-duration">
                <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off"> {Dte} </a>
              </div>
            </div>
            <div className="mews-details-para">
              <p> <Markup content={item.Description} /></p>
            </div>
          </div>
        );
      } else {
        return (
          <div className="ceo-readmore-wrap clearfix">
            <div className="ceo-radmore-left">
              <img src={`${handler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ceo_no_found.png`} alt="image" />
            </div>
            <div className="ceo-radmore-right">
              <h2 className="nw-list-main">{item.Name}</h2>
              <div className="ns-tag-duration">
                <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off"> {Dte} </a>
              </div>
            </div>
            <div className="mews-details-para">
              <p> <Markup content={item.Description} /></p>
            </div>
          </div>
        );
      }
    });
    return (
      <div className={styles.ceoMessageReadMore} id="ceoMessageReadMore">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="relative container">

            <div className="section-rigth">

              <div className="inner-banner-header relative m-b-20">

                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> CEO Read More </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> CEO Read More </a> </li>
                  </ul>
                </div>

              </div>
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="row home-detail-banner">
                    <div className="col-md-12">
                      {CEOMessageDetails}
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
