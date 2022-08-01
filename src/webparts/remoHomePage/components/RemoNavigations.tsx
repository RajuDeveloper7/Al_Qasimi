import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import ReactTooltip from "react-tooltip";
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as moment from 'moment';

export interface INavigationsState {
  MainNavItems: any[];
  DeptandQuickLinksItems: any[];
  QuickLinkItems: any[];
  SelectedNav: any[];
  showdata: any[];
  showdataqlink: any[];
  IsAdminForContentEditor: boolean;
  MyLinks: any[];
}
let SelectedDepartments = [];
let BreadCrumb = [];
const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();

var NewWeb;
export default class RemoNavigations extends React.Component<IRemoHomePageProps, INavigationsState, {}> {
  private displayData;
  private displayDataQlink;
  public constructor(props: IRemoHomePageProps, state: INavigationsState) {
    super(props);
    this.displayData = [];
    this.displayDataQlink = [];
    this.appendData = this.appendData.bind(this);
    this.appendDataQLink = this.appendDataQLink.bind(this);

    this.state = {
      MainNavItems: [],
      DeptandQuickLinksItems: [],
      QuickLinkItems: [],
      SelectedNav: [],
      showdata: [],
      showdataqlink: [],
      IsAdminForContentEditor: false,
      MyLinks: [],
    };
    NewWeb = Web("" + this.props.siteurl + "");
  }

  public componentDidMount() {
    BreadCrumb = [];
    this.JobsMasterCheck();
    this.GetMainNavItems();
    this.EnableContentEditorForSuperAdmins();
    this.GetMyLinks();
    $("#meetingroom").hide()
    $("#clearbutton").hide()
    $('.clears-subnav').hide();
  }


  public async EnableContentEditorForSuperAdmins() {
    let groups = await sp.web.currentUser.groups();
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].Title == "ContentPageEditors") {
        this.setState({ IsAdminForContentEditor: true }); //To Show Content Editor on Center Nav to Specific Group Users alone
      } else {

      }
    }
  }
  public async JobsMasterCheck() {
    var tdaydate = moment().format('YYYY-MM-DD')
    var result = await sp.web.lists.getByTitle("JobsMaster").items.select("DateOfSubmission", "ID").filter(`DateOfSubmission lt '${tdaydate}'`).getAll()
    for (var i = 0; i < result.length; i++) {
      var id = result[i].ID
      const itemUpdate = await sp.web.lists.getByTitle("JobsMaster").items.getById(id).update({
        'Status': 'Expired',
      });
    }
  }
  public async GetMainNavItems() {
    var reactHandler = this;

    await NewWeb.lists.getByTitle("Navigations").items.select("Title", "URL", "OpenInNewTab", "LinkMasterID/Title", "LinkMasterID/Id", "HoverOnIcon", "HoverOffIcon").filter("IsActive eq 1").orderBy("Order0", true).top(10).expand("LinkMasterID").get().then((items) => {

      reactHandler.setState({
        MainNavItems: items
      });
      $('#root-nav-links ul li').on('click', function () {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
      });
    });
  }
  public async GetMyLinks() {
    var reactHandler = this;
    try {
      await sp.web.lists.getByTitle("Quick Links").items.select("Title", "Image", "ImageHover", "OpenInNewTab", "Order", "URL").filter(`IsActive eq 1`).orderBy("Order0", true).top(1000).get().then((items) => {

        reactHandler.setState({
          MyLinks: items
        });
        $('#root-nav-links ul li').on('click', function () {
          $(this).siblings().removeClass('active');
          $(this).addClass('active');
        });
      });
    } catch (err) {
      console.log("Navigation Main Nav : " + err);
    }

  }
  public GetDepartments() {
    $('.clears-subnav').show();

    $('.floating-content-editor-home').addClass('active')
    $('.breadcrum-block').addClass('open');
    $(".breadcrum-block").show();
    var reactHandler = this;
    reactHandler.displayData = [];
    BreadCrumb = [];
    $(".main-mavigation").siblings().removeClass("submenu");
    $(".main-mavigation").addClass("submenu");
    $('#meetingroom').off('click');
    try {
      NewWeb.lists.getByTitle("DepartmentsMaster").items.select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id").filter(`IsActive eq '1'`).orderBy("Order0", true).expand("PlaceDepartmentUnder/Id", "PlaceDepartmentUnder").get().then((items) => {
        reactHandler.setState({
          DeptandQuickLinksItems: items
        });
        for (var i = 0; i < items.length; i++) {


          //  if (items[i].PlaceDepartmentUnder.Title == undefined) {
          let ID = items[i].Id;

          var Title = items[i].Title;
          var Url = items[i].URL.Url;
          let OpenInNewTab = items[i].OpenInNewTab;
          let HasSubDept = items[i].HasSubDepartment;
          reactHandler.appendData(ID, Title, OpenInNewTab, HasSubDept, Url);
          //   }
        }
        $(".submenu-clear-wrap").show()
        $(".submenu-wrap-lists ul li").on("click", function () {
          $(this).siblings().removeClass('active');
          $(this).addClass('active');
        });
      });
    } catch (err) {
      console.log("Navigation Department Link : " + err);
    }
  }

  public GetQuickLinks() {
    var reactHandler = this;
    reactHandler.displayDataQlink = [];
    BreadCrumb = [];
    $(".main-mavigation").siblings().removeClass("submenu");
    $(".main-mavigation").addClass("submenu");
    try {
      NewWeb.lists.getByTitle("Quick Links").items.select("Title", "Image", "ImageHover", "OpenInNewTab", "Order", "URL").filter(`IsActive eq 1`).orderBy("Order0", true).get().then((items) => {

        reactHandler.setState({
          QuickLinkItems: items
        });
        for (var i = 0; i < items.length; i++) {
          var Title = items[i].Title;
          var Url = items[i].URL.Url;
          let OpenInNewTab = items[i].OpenInNewPage;
          var HoverOff = items[i].Image;
          var HoverOffImage = JSON.parse(HoverOff);
          let HoverOn = items[i].ImageHover;
          var HoverOnImage = JSON.parse(HoverOn);
          let Centernav = items[i].centernavigationicon;
          // var centernavigationicon = JSON.parse(Centernav);           
          reactHandler.appendDataQLink(Title, OpenInNewTab, Url, HoverOffImage, HoverOnImage, Centernav);
        }
      });
    } catch (err) {
      console.log("Navigation Quick Link : " + err);
    }
  }



  public GetSubNodes(ID, Title, ClickFrom, key) {
    $(".breadcrum-block").show();
    if (ClickFrom == "Breadcrumb") {
      var IndexValue = key;
      for (var i = 0; i < BreadCrumb.length; i++) {
        if (i > IndexValue) {
          BreadCrumb.splice(i);
        }
      }
    } else {
      BreadCrumb.push({ "Title": Title, "ID": ID });
    }

    var reactHandler = this;
    reactHandler.displayData = [];
    SelectedDepartments.unshift(ID);
    NewWeb.lists.getByTitle("DepartmentsMaster").items.select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id").filter(`IsActive eq '1' and PlaceDepartmentUnder/Id eq '${ID}'`).orderBy("Order0", true).expand("PlaceDepartmentUnder").get().then((items) => {
      //  url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDepartment,OpenInNewTab,PlaceDepartmentUnder/Title,PlaceDepartmentUnder/Id&$filter=IsActive eq 1 and PlaceDepartmentUnder/Id eq '${ID}' &$orderby=Order0 asc&$expand=PlaceDepartmentUnder`,
      reactHandler.setState({
        DeptandQuickLinksItems: items
      });

      for (var i = 0; i < items.length; i++) {
        //  if (items[i].PlaceDepartmentUnder.Title == undefined) {
        let ItemID = items[i].Id;
        var Title = items[i].Title;
        var Url = items[i].URL.Url;
        let OpenInNewTab = items[i].OpenInNewTab;
        let HasSubDept = items[i].HasSubDepartment;
        reactHandler.appendData(ItemID, Title, OpenInNewTab, HasSubDept, Url);
      }
    });

  }

  public appendData(ID, Title, OpenInNewTab, HasSubDept, Url) {
    var reactHandler = this;
    if (OpenInNewTab == true) {
      if (HasSubDept == true) {
        reactHandler.displayData.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button"> <span>{Title}</span></a>
          <a className={"deptdropdown-" + ID + ""} href="#" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"><img src={`${reactHandler.props.siteurl}/SiteAssets/img/right_arrow.svg`} alt="nav"></img></a>
        </li>);
      } else {
        reactHandler.displayData.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button" > <span>{Title}</span></a>
        </li>);
      }
    } else {
      if (HasSubDept == true) {
        reactHandler.displayData.push(<li>
          <a href={Url} data-interception="off" role="button"> <span>{Title}</span></a>
          <a className={"deptdropdown-" + ID + ""} href="#" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"><img src={`${reactHandler.props.siteurl}/SiteAssets/img/right_arrow.svg`} alt="nav"></img></a>
        </li>);
      } else {
        reactHandler.displayData.push(<li>
          <a href={Url} data-interception="off" role="button" > <span>{Title}</span></a>
        </li>);
      }
    }
    reactHandler.setState({
      showdata: reactHandler.displayData
    });
  }

  public appendDataQLink(Title, OpenInNewTab, Url, HoverOffImage, HoverOnImage, Centernav) {
    var reactHandler = this;
    console.log(Centernav);

    if (Centernav != "" && Centernav != null) {
      console.log("center nav image present");

      var centernavigationicon = JSON.parse(Centernav);
      if (OpenInNewTab == true) {
        reactHandler.displayDataQlink.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button">
            <img className="bhover" src={centernavigationicon.serverRelativeUrl} alt="image" />
            <img className="hhover" src={HoverOnImage.serverRelativeUrl} alt="image" />
            <p>{Title}</p></a>
        </li>);
      } else {
        reactHandler.displayDataQlink.push(<li>
          <a href={Url} data-interception="off" role="button" >
            <img className="bhover" src={centernavigationicon.serverRelativeUrl} alt="image" />
            <img className="hhover" src={HoverOnImage.serverRelativeUrl} alt="image" />
            <p>{Title}</p></a>
        </li>);
      }
    }
    else {
      if (OpenInNewTab == true) {
        reactHandler.displayDataQlink.push(<li>
          <a href={Url} target="_blank" data-interception="off" role="button">
            <img className="bhover" src={HoverOffImage.serverRelativeUrl} alt="image" />
            <img className="hhover" src={HoverOnImage.serverRelativeUrl} alt="image" />
            <p>{Title}</p></a>
        </li>);
      } else {
        reactHandler.displayDataQlink.push(<li>
          <a href={Url} data-interception="off" role="button" >
            <img className="bhover" src={HoverOffImage.serverRelativeUrl} alt="image" />
            <img className="hhover" src={HoverOnImage.serverRelativeUrl} alt="image" />
            <p>{Title}</p></a>
        </li>);
      }
    }
    reactHandler.setState({
      showdataqlink: reactHandler.displayDataQlink
    });
  }

  public ClearNavigation() {
    BreadCrumb = [];
    $('.breadcrum-block').removeClass('open');
    $('.clears-subnav-quick').hide();
    $('.clears-subnav').hide();
    $(".breadcrum-block").hide();
    $(".main-mavigation").removeClass("submenu");
    $('#root-nav-links ul li').siblings().removeClass('active');
    $(".submenu-wrap-lists ul li").siblings().removeClass('active');
    $('#root-nav-links ul li:first-child').addClass('active');

    this.displayData = [];
    this.displayDataQlink = [];
  }
  public mylinks() {
    $(".tab-2-data").removeClass("active");
    $("#meetingroom").hide()
    $(".tab-1-data").addClass("active");
    $("#contacts").show()

    $(".breadcrum-block").hide();
    $(".main-mavigation").removeClass("submenu");
    $('#root-nav-links ul li').siblings().removeClass('active');
    $(".submenu-wrap-lists ul li").siblings().removeClass('active');
    $('#root-nav-links ul li:first-child').addClass('active');
  }
  public quicklinks() {
    $(".tab-1-data").removeClass("active");
    $("#contacts").hide()
    $(".tab-2-data").addClass("active");
    $("#meetingroom").show()

    $(".breadcrum-block").hide();
    $(".main-mavigation").removeClass("submenu");
    $('#root-nav-links ul li').siblings().removeClass('active');
    $(".submenu-wrap-lists ul li").siblings().removeClass('active');
    // $('#root-nav-links ul li:first-child').addClass('active');
  }

  public render(): React.ReactElement<IRemoHomePageProps> {
    var handler = this;

    const MainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function (item, key) {
      let RawImageTxtOn = item.HoverOnIcon;
      let RawImageTxtOff = item.HoverOffIcon;
      if (RawImageTxtOn != null || RawImageTxtOn != undefined && RawImageTxtOff != null || RawImageTxtOff != undefined) {
        var ImgObjforON = JSON.parse(RawImageTxtOn);
        var ImgObjforOFF = JSON.parse(RawImageTxtOff);

        if (item.LinkMasterID != undefined) { var LinkMasterIDTitle = item.LinkMasterID.Title }

        if (item.OpenInNewTab == true) {
          if (LinkMasterIDTitle == "DEPT_00001") {
            return (
              <li>
                <a href="#" onClick={() => handler.GetDepartments()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" data-interception="off" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists department-wrap">
                  {/* <div className="submenu-clear-wrap" >
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" data-interception="off" onClick={() => handler.ClearNavigation()} >   <img src={`${handler.props.siteurl}/SiteAssets/img/clear.svg`} alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div> */}
                  <ul className="clearfix">
                    {handler.state.showdata}
                  </ul>
                </div>
              </li>
            );
          }
          if (LinkMasterIDTitle == "QLINK_00002") {
            return (
              <li>
                <a href="#" onClick={() => handler.GetQuickLinks()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" data-interception="off" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists q-links-dpt">
                  <div className="submenu-clear-wrap" >
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={() => handler.ClearNavigation()}>   <img src={`${handler.props.siteurl}/SiteAssets/img/clear.svg`} alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div>
                  <ul className="clearfix">
                    {handler.state.showdataqlink}
                  </ul>
                </div>
              </li>
            );
          }
          if (LinkMasterIDTitle == undefined) {

            var str2 = item.Title;

            var ContentEditorURL = item.URL;
            var conturl = ContentEditorURL.toLowerCase();

            conturl = conturl.split("?");
            var DomID2 = str2.replace(/[_\W]+/g, "_");

            if (item.Title == "Home") {

              return (
                <li className="active" id={DomID2}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            } else if (conturl[0] == `${handler.props.siteurl}/sitepages/Content-editor.aspx`) {
              if (handler.state.IsAdminForContentEditor == true) {

                return (
                  <li> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
                );
              }
            } else {

              return (
                <li id={DomID2}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            }
          }
        } else {
          if (LinkMasterIDTitle == "DEPT_00001") {
            return (
              <li>
                <a href="#" onClick={() => handler.GetDepartments()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" data-interception="off" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists department-wrap">
                  {/* <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={() => handler.ClearNavigation()} data-interception="off">   <img src="https://remodigital.sharepoint.com/sites/Remo/SiteAssets/img/clear.svg" alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div> */}
                  <ul className="clearfix">
                    {handler.state.showdata}
                  </ul>
                </div>
              </li>
            );
          }
          if (LinkMasterIDTitle == "QLINK_00002") {
            return (
              <li> <a href="#" onClick={() => handler.GetQuickLinks()}> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" data-interception="off" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a>
                <div className="submenu-wrap-lists q-links-dpt">
                  <div className="submenu-clear-wrap">
                    <a href="#" className="submenu-clear" data-tip data-for={"React-tooltip-clear"} data-custom-class="tooltip-custom" onClick={() => handler.ClearNavigation()} data-interception="off">   <img src={`${handler.props.siteurl}/SiteAssets/img/clear.svg`} alt="image" />  </a>
                    <ReactTooltip id={"React-tooltip-clear"} place="right" type="dark" effect="solid">
                      <span>Clear</span>
                    </ReactTooltip>
                  </div>
                  <ul className="clearfix">
                    {handler.state.showdataqlink}
                  </ul>
                </div>
              </li>
            );
          }
          if (LinkMasterIDTitle == undefined) {
            var str = item.Title;
            var ContentEditorURL = item.URL;

            var conturl = ContentEditorURL.toLowerCase();

            conturl = conturl.split("?");
            var DomID = str.replace(/[_\W]+/g, "_");
            if (item.Title == "Home") {
              return (
                <li className="active" id={DomID}> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            } else if (conturl[0] == `${handler.props.siteurl}/sitepages/content-editor.aspx`) {
              if (handler.state.IsAdminForContentEditor == true) {
                return (
                  <li> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
                );
              }
            } else {
              return (
                <li id={DomID}> <a href={`${item.URL}`} data-interception="off"> <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" /><img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" /> <p>{item.Title}</p>  </a> </li>
              );
            }
          }
        }
      }
    });
    const MyLinks: JSX.Element[] = handler.state.MyLinks.map(function (item, key) {
      let RawImageTxtOn = item.ImageHover;
      let RawImageTxtOff = item.Image;
      if (RawImageTxtOn != null || RawImageTxtOn != undefined && RawImageTxtOff != null || RawImageTxtOff != undefined) {
        var ImgObjforON = JSON.parse(RawImageTxtOn);
        var ImgObjforOFF = JSON.parse(RawImageTxtOff);

        var str2 = item.Title;
        var ContentEditorURL = item.URL.Url;
        var conturl = ContentEditorURL.toLowerCase();
        conturl = conturl.split("?");
        var DomID2 = str2.replace(/[_\W]+/g, "_");
        if (item.OpenInNewTab == true) {
          return (
            <li
              id={DomID2}>
              <a href={`${item.URL.Url}`} target="_blank" data-interception="off">
                <img src={`${ImgObjforOFF.serverRelativeUrl}`} alt="img" className="bhover" />
                <img src={`${ImgObjforON.serverRelativeUrl}`} alt="img" className="hhover" />
                <p>{item.Title}</p>
              </a>
            </li>
          );

        }
      }
    });
    return (
      <div className='tab-view-content'>
        <div className="tab-view">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item active tab-1-data" role="presentation">
              <a className="nav-link active tab-1-data" onClick={this.mylinks} id="home-tab" data-toggle="tab" href="#contacts" role="tab"
                aria-controls="contacts" aria-selected="true">Quick Links </a>
            </li>
            <li className="nav-item tab-2-data" role="presentation">
              <a className="nav-link tab-2-data" onClick={this.quicklinks} id="profile-tab" data-toggle="tab" href="#meetingroom" role="tab"
                aria-controls="meetingroom" aria-selected="false">My Links</a>
            </li>
          </ul>
        </div>

        <div className="tab-content">
          <div className="nav-link active tab-1-data" id="contacts">
            <div className="main-mavigation m-b-20">
              <nav className="sec" id="root-nav-links">
                <div className="breadcrum-block">
                  <a href='#' className="clears-subnav" onClick={() => handler.ClearNavigation()}>All Menu<img src={`${handler.props.siteurl}/SiteAssets/img/right_arrow.svg`} alt="nav" data-interception="off"></img></a>
                  {BreadCrumb.map((item, key) => (
                    <a href="#" id="b-d-crumb" data-index={key} onClick={() => handler.GetSubNodes(item.ID, item.Title, "Breadcrumb", key)}>{item.Title}<img src={`${handler.props.siteurl}/SiteAssets/img/right_arrow.svg`} alt="nav" data-interception="off"></img></a>
                  ))}
                </div>
                <ul className="clearfix">
                  {MainNavigations}
                </ul>
              </nav>

            </div>
          </div>

          <div className="nav-item tab-2-data" id="meetingroom">
            <div className="main-mavigation m-b-20">
              <nav className="sec" id="root-nav-links">
                {/* <div className="breadcrum-block">
                  {BreadCrumb.map((item, key) => (
                    <a href="#" id="b-d-crumb" data-index={key} onClick={() => handler.GetSubNodes(item.ID, item.Title, "Breadcrumb", key)}>{item.Title}<img src={`${handler.props.siteurl}/SiteAssets/img/right_arrow.svg`} alt="nav" data-interception="off"></img></a>
                  ))}
                </div> */}
                <ul className="clearfix">
                  {MyLinks}
                </ul>
              </nav>

            </div>
          </div>
        </div>
      </div>

    );
  }
}
