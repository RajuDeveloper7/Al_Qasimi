import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/presets/all";

export interface ICeoMessageState {
  Items: any[];
}


export default class RemoCEOMessage extends React.Component<IRemoHomePageProps, ICeoMessageState, {}> {
  public constructor(props: IRemoHomePageProps, state: ICeoMessageState) {
    super(props);
    this.state = {
      Items: []
    };
  }

  public componentDidMount() {

    this.GetCEOMessage();
  }
  private async GetCEOMessage() {
    var reactHandler = this;
    await sp.web.lists.getByTitle("CEO Message").items.select("ID","Title","Description","Created","Name","Image","Designation","Name").filter(`IsActive eq '1'`).orderBy("Created",false).top(1).get().then((items) => { // //orderby is false -> decending        
    
        if (items.length == 0) {
          $("#if-no-ceo-msg-present").show();
          $("#if-ceo-msg-present").hide();
        } else {
          reactHandler.setState({
            Items: items
          });
           $("#if-no-ceo-msg-present").hide();
          $("#if-ceo-msg-present").show();
        }
    });
  }
  public render(): React.ReactElement<IRemoHomePageProps> {
    var handler = this;
    const CEOMessage: JSX.Element[] = this.state.Items.map(function (item, key) {
      let dummyElement = document.createElement("DIV");
      var Date = moment(item.Created).format("DD/MM/YYYY");
      dummyElement.innerHTML = item.Description;
      var outputText = dummyElement.innerText;

      $("#ceo-title-dynamic").html(`${item.Title}`);
      let RawImageTxt = item.Image;
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <>
            <div className="section-part clearfix">
              <div className="ceo-message-left">
                <h4> {item.Name} </h4>
                <h6>{Date}</h6>
                <p> {outputText} </p>
                <a href={handler.props.siteurl + `/SitePages/CEO-Read-More.aspx?ItemID=${item.ID}`} data-interception="off" className="readmore transition" > Read more
                  <img src={`${handler.props.siteurl}/SiteAssets/img/right_arrow.svg`} className="transition" alt="image" />  </a>
              </div>
            </div>
            <div className="ceo-message-right">
              <img src={ImgObj.serverRelativeUrl} alt="no-image-uploaded" />
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="section-part relative clearfix">
              <div className="ceo-message-left">
                <h4> {item.Name} </h4>
                <p> {outputText} </p>
                <a href={handler.props.siteurl + `/SitePages/CEO-Read-More.aspx?ItemID=${item.ID}`} data-interception="off" className="readmore transition"> Read more <img src={`${handler.props.siteurl}/SiteAssets/img/right_arrow.svg`} className="transition" alt="image" />  </a>
              </div>
            </div>
            <div className="ceo-message-right">
              <img src={`${handler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ceo_no_found.png`} alt="img" />
            </div>
          </>
        );
      }
    });
    return (
      <div >

        <div className="col-md-4">
          <div className="sec relative" id="if-ceo-msg-present">
            <div className="heading" id="ceo-title-dynamic">

            </div>
            {CEOMessage}
          </div>
          <div className="sec shadoww relative" id="if-no-ceo-msg-present" style={{ display: "none" }}>
            <div className="heading">
              CEO's Message
            </div>
            <img className="err-img" src={`${handler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="ceoimg"></img>
          </div>
        </div>

      </div>
    );
  }
}
