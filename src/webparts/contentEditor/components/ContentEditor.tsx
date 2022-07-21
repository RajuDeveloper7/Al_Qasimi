import * as React from 'react';
import styles from "./ContentEditor.module.scss";
import { IContentEditorProps } from "./IContentEditorProps";
import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';

export interface IRemoContentEditorState {
  Items: any[];
  ContentEditorAdmin: boolean;
  Tabs: any[];
}


const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();

export default class RemoContentEditor extends React.Component<IContentEditorProps, IRemoContentEditorState, {}> {
  public constructor(props: IContentEditorProps, state: IRemoContentEditorState) {
    super(props);
    this.state = {
      Items: [],
      ContentEditorAdmin: false,
      Tabs: []
    }
   
  }

  public componentDidMount() {
    setTimeout(() => {
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');

    }, 2000);
   
    setTimeout(function () {
      $('div[data-automation-id="CanvasControl"]').attr('style', 'padding: 0px !important; margin: 0px !important');
    }, 500);
   
    this.CheckPermission();
    this.Addclass();

  }

  public Addclass() {
    setTimeout(() => {
      $("#accordion .card .card-header").on('click', function () {
        $(".card-header").removeClass("active");
        $(this).addClass("active");
      });
    }, 1000);
  }

  public async CheckPermission() {
 
    let groups = await sp.web.currentUser.groups();
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].Title == "ContentPageEditors") {
        this.setState({ ContentEditorAdmin: true });
        $("#access-denied-block").hide();

        break;
      }
      else {
        $("#access-denied-block").show();
      }
    }
    if (this.state.ContentEditorAdmin == true) {
      this.GetContentEditorTabs();
      this.GetContentEditorNavigations(1);
    }
  }

  public async GetContentEditorTabs() {
    let UserID = this.props.UserId;
    var reactHandler = this;
    await sp.web.lists.getByTitle("Content Editor Master Category").items.select("Title","ID","AccessibleTo/Title").expand("AccessibleTo").filter(`IsActive eq 1 and AccessibleTo/Id eq ${UserID} `).get().then((items)=>{
        reactHandler.setState({
          Tabs: items
        });
    });
  }

  public async GetContentEditorNavigations(ID) {
    let UserID = this.props.UserId;
    var reactHandler = this;
    await sp.web.lists.getByTitle("Content Editor Master").items.select("Title","URL","Icon","BelongsTo/Title","AccessibleTo/Title").expand("BelongsTo","AccessibleTo").orderBy("Title",true).filter(`IsActive eq 1 and BelongsTo/Id eq ${ID} and AccessibleTo/Id eq ${this.props.UserId} `).get().then((items)=>{
        reactHandler.setState({
          Items: items
        });
    });
  }

  public render(): React.ReactElement<IContentEditorProps> {


    var reactHandler = this;

    const ContentEditorTAB: JSX.Element[] = this.state.Tabs.map(function (item, key) {
      if (key == 0) {
        return (
          <div className="card">
            <div className="card-header active">
            
              <a href="#" onClick={() => reactHandler.GetContentEditorNavigations(item.Id)} className="card-link collapsed"> {item.Title} </a>
            </div>
          </div>
        );
      } else {
        return (
          <div className="card">
            <div className="card-header">
              <a href="#" onClick={() => reactHandler.GetContentEditorNavigations(item.Id)} className="card-link collapsed"> {item.Title} </a>
            </div>
          </div>
        );
      }
    });

    const ContentEditorElements: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Icon;
      if (RawImageTxt != "") {
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <li className="ifcontentpresent">
            <a href={`${item.URL.Url}`} target="_blank" data-interception="off">
              <div className="inner-qiuicklinks-inner">
                <img src={`${ImgObj.serverRelativeUrl}`} />
                <p> {item.Title} </p>
              </div>
            </a>
          </li>
        );
      }
    });
    return (
      <div className={styles.contentEditor} id="content-editor">
         <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        {this.state.ContentEditorAdmin &&  this.state.ContentEditorAdmin == true ? (
          <section>
            <div className="relative container">
              <div className="section-rigth">
                <div className="inner-banner-header relative m-b-20">
                  <div className="inner-banner-overlay"></div>
                  <div className="inner-banner-contents">
                    <h1> Content Editor </h1>
                    <ul className="breadcums">
                      <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                      <li>  <a href="#" style={{ pointerEvents: "none" }}> Content Editor</a> </li>
                    </ul>
                  </div>
                </div>
                <div className="inner-page-contents ">
                  <div className="top-news-sections content-editir-secs m-b-20">
                    <div className="row">
                      <div className="col-md-6">
                        <div id="accordion">
                          
                          {ContentEditorTAB}
                        </div>
                      </div>
                      <div className="col-md-6 direct-conttent-sreas">
                        <div className="sec">
                          <ul className="clearfix">
                            {ContentEditorElements}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section id="access-denied-block" style={{ display: "none" }}>
            <div className="result-succ-mess">
              <h3>Access Denied</h3>
              <img src={`${this.props.siteurl}/SiteAssets/img/Access_denied.png`} alt="image" data-themekey="#" />
              <h4> You don't have enough permission to access this!</h4>{" "}
              <p>Please contact your Administrator</p>
              <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Go Back</a>
            </div>
          </section>
        )}
      </div>
    );
  }
}
