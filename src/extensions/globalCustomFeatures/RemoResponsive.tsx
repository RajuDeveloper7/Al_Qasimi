import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { ServiceProvider } from '../globalCustomFeatures/services/ServiceProvider';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/profiles";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import ReactTooltip from "react-tooltip";
import pnp from 'sp-pnp-js';
import * as moment from 'moment';
import { sp } from '@pnp/sp/presets/all';


export interface IResponsiveProps {
    siteurl: string;
    context: any;
    currentWebUrl: string;
    CurrentPageserverRequestPath: string;
}

export interface IResponsiveState {
    myMailDatas: any[];
    myMeetingsDatas: any[];
    EmailCount: any;
    MeetingsCount: any;
    CurrentPageUrl: any;
    IsAdminForContentEditor: boolean;

    MainNavItems: any[];
    DeptandQuickLinksItems: any[];
    QuickLinkItems: any[];
    SelectedNav: any[];
    showdata: any[];
    showdataLevelTwo: any[];
    showdataqlink: any[];

    showdataResponsive: any[];
    showdataLevelTwoResponsive: any[];
    showdataqlinkResponsive: any[];

    CurrentUserName: string;
    CurrentUserDesignation: string;
    CurrentUserProfilePic: string;
    SiteLogo: string;
}

let BreadCrumb = [];
var NewWeb;

export default class RemoResponsive extends React.Component<IResponsiveProps, IResponsiveState, {}>

{
    private serviceProvider;
    private displayData;
    private displayDataLevel2;
    private displayDataQlink;


    private displayDataResponsive;
    private displayDataLevel2Responsive;
    private displayDataQlinkResponsive;
    public constructor(props: IResponsiveProps, state: {}) {
        super(props);
        sp.setup({
            spfxContext: this.props.context
        });
        this.serviceProvider = new ServiceProvider(this.props.context);

        this.displayData = [];
        this.displayDataLevel2 = [];
        this.displayDataQlink = [];

        this.displayDataResponsive = [];
        this.displayDataLevel2Responsive = [];
        this.displayDataQlinkResponsive = [];
        this.appendData = this.appendData.bind(this);
        this.appendDataLevelTwo = this.appendDataLevelTwo.bind(this);
        this.appendDataQLink = this.appendDataQLink.bind(this);

        this.state = {
            myMailDatas: [],
            myMeetingsDatas: [],
            EmailCount: "",
            MeetingsCount: "",
            CurrentPageUrl: "",
            IsAdminForContentEditor: false,

            MainNavItems: [],
            DeptandQuickLinksItems: [],
            QuickLinkItems: [],
            SelectedNav: [],
            showdata: [],
            showdataLevelTwo: [],
            showdataqlink: [],

            showdataResponsive: [],
            showdataLevelTwoResponsive: [],
            showdataqlinkResponsive: [],

            CurrentUserName: "",
            CurrentUserDesignation: "",
            CurrentUserProfilePic: "",
            SiteLogo: ""
        };
        NewWeb = Web("" + this.props.siteurl + "")
    }


    public componentDidMount() {

        $('#spLeftNav').attr('style', 'display: none !important');
        $("#spCommandBar").attr("style", "display: none !important");
        $("#SuiteNavWrapper").hide();

        const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();
        this.getUnreadmailCount();
        this.GetMainNavItems();
        this.GetQuickLinks();
        this.GetCurrentUserDetails();
        this.EnableContentEditorForSuperAdmins();
        this.setState({
            CurrentPageUrl: ActivePageUrl
        });

        $('.globalleftmenu-fixed-area ul li').on('click', function () {
            $(this).siblings().removeClass('active');
            $(this).siblings().removeClass('open');
            $(this).addClass('active');
            $(this).toggleClass('open');
        });

        $(".reponsive-quick-wrap .main-menu ul li.submenu a img").on("click", function () {
            //$(this).toggleClass('active');
            var self = $(this).parent();
            self.toggleClass("active");
        });




    }

    public async GetCurrentUserDetails() {
        var reacthandler = this
        const profile = await pnp.sp.profiles.myProperties.get();

        var email = profile.Email;
        var Name = profile.DisplayName;
        var Designation = profile.Title;

        reacthandler.setState({
            CurrentUserName: Name,
            CurrentUserDesignation: Designation,
            CurrentUserProfilePic: `${reacthandler.props.siteurl}/_layouts/15/userphoto.aspx?size=l&username=${email}`
        });
    }
    public async EnableContentEditorForSuperAdmins() {
        let groups = await sp.web.currentUser.groups();
        for (var i = 0; i < groups.length; i++) {
            if (groups[i].Title == "ContentPageEditors") {
                this.setState({ IsAdminForContentEditor: true }); //To Show Content Editor on Center Nav to Specific Group Users alone

            } else {
                // this.setState({IsAdminForContentEditor:true});
            }
        }
    }

    public getUnreadmailCount() {
        this.serviceProvider.getmymailcount()
            .then(
                (result: any[]): void => {
                    this.setState({ myMailDatas: result });
                    var mailcount = this.state.myMailDatas.length;
                    if (this.state.myMailDatas.length > 0) {
                        this.setState({ EmailCount: mailcount });
                        if (this.state.myMailDatas.length > 999) {
                            $(".count-email").addClass("more");
                        }
                    } else {
                        this.setState({ EmailCount: "0" });
                        $("#Emails_count").hide();
                    }
                }
            )
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

            $('.main-menu ul li').on('click', function () {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            });

        });
    }

    public async GetDepartments() {
        //$(".global-qlink-main").hide();
        //$(".global-dept-main").show();
        $(".dep-res").removeClass("active-submenu");
        $(".resp-dept-submenu-mob").toggleClass("active");
        $(".responsi-inner-submenu").toggleClass("open");
        $(".resp-dept-submenu-mob").toggleClass("active");
        $(".resp-qlink-submenu").removeClass("active");
        $(".global-qlink-main").removeClass("open");
        $(".global-dept-main").toggleClass("open");
        var reactHandler = this;
        reactHandler.displayData = [];
        reactHandler.displayDataResponsive = [];
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
            }

            $(".submenu-clear-wrap").show()
            $(".submenu-wrap-lists ul li").on("click", function () {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
            });
            $(".dep-res").on("click", function () {
                $(this).siblings().removeClass("active-submenu");
                $(this).addClass("active-submenu");
            });
        });
    } catch(err) {
        console.log("Navigation Department Link : " + err);
    }

    public async GetQuickLinks() {
        //$(".global-dept-main").hide();
        //$(".global-qlink-main").show();
        $(".resp-qlink-submenu").toggleClass("active");
        $(".resp-dept-submenu-mob").removeClass("active");
        $(".third-level-submenu").removeClass("open");
        $(".global-dept-main").removeClass("open");
        $(".global-qlink-main").toggleClass("open");
        var reactHandler = this;
        reactHandler.displayDataQlink = [];
        reactHandler.displayDataQlinkResponsive = [];
        try {
            NewWeb.lists.getByTitle("Quick Links").items.select("Title", "Image", "ImageHover", "OpenInNewTab", "Order", "URL").filter(`IsActive eq 1`).orderBy("Order0", true).get().then((items) => {
                //url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('Quick Links')/items?$select=Title,OpenInNewPage,URL,Image,ImageHover,centernavigationicon&$filter=IsActive eq 1&$orderby=Order0 asc`,
                reactHandler.setState({
                    QuickLinkItems: items
                });
                $('.quicklink-menu ul li').on('click', function () {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                });
                for (var i = 0; i < items.length; i++) {
                    var Title = items[i].Title;
                    var Url = items[i].URL.Url;
                    let OpenInNewTab = items[i].OpenInNewTab;
                    var HoverOff = items[i].Image;
                    var HoverOffImage = JSON.parse(HoverOff);
                    let HoverOn = items[i].ImageHover;
                    var HoverOnImage = JSON.parse(HoverOn);
                    let Centernav = items[i].centernavigationicon;
                    reactHandler.appendDataQLink(Title, OpenInNewTab, Url);
                }
            });
        } catch (err) {
            console.log("Navigation Quick Link : " + err);
        }

    }

    public GetSubNodes(ID, Title, ClickFrom, key) {
        $("#" + ID + "-Dept-Child").empty();
        //$("#"+ID+"-Dept-Child").show();
        $("#" + ID + "-Dept-Child-parent").toggleClass("open");
        //$("#"+ID+"-Dept-Child").css("display" , "block !important");
        var reactHandler = this;
        this.displayDataLevel2 = [];
        this.displayDataLevel2Responsive = [];
        NewWeb.lists.getByTitle("DepartmentsMaster").items.select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id").filter(`IsActive eq '1' and PlaceDepartmentUnder/Id eq '${ID}'`).orderBy("Order0", true).expand("PlaceDepartmentUnder").get().then((items) => {
            //  url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDepartment,OpenInNewTab,PlaceDepartmentUnder/Title,PlaceDepartmentUnder/Id&$filter=IsActive eq 1 and PlaceDepartmentUnder/Id eq '${ID}' &$orderby=Order0 asc&$expand=PlaceDepartmentUnder`,
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
                reactHandler.appendDataLevelTwo(ID, Title, OpenInNewTab, HasSubDept, Url);
            }
        });
    }

    public GetSubNodesLevelTwo(ID, Title, ClickFrom, key) {
        var reactHandler = this;
        //reactHandler.displayData=[];
        NewWeb.lists.getByTitle("DepartmentsMaster").items.select("Title", "ID", "URL", "HasSubDepartment", "OpenInNewTab", "PlaceDepartmentUnder/Title", "PlaceDepartmentUnder/Id").filter(`IsActive eq '1' and PlaceDepartmentUnder/Id eq '${ID}'`).orderBy("Order0", true).expand("PlaceDepartmentUnder").get().then((items) => {
            //  url: `${reactHandler.props.siteurl}/_api/web/lists/getbytitle('DepartmentsMaster')/items?$select=Title,ID,URL,HasSubDepartment,OpenInNewTab,PlaceDepartmentUnder/Title,PlaceDepartmentUnder/Id&$filter=IsActive eq 1 and PlaceDepartmentUnder/Id eq '${ID}' &$orderby=Order0 asc&$expand=PlaceDepartmentUnder`,
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
                reactHandler.appendDataLevelTwo(ID, Title, OpenInNewTab, HasSubDept, Url);
            }
        });
    }

    public appendData(ID, Title, OpenInNewTab, HasSubDept, Url) {

        var reactHandler = this;
        if (OpenInNewTab == true) {
            if (HasSubDept == true) {

                reactHandler.displayData.push(<li className="GetSubNodes">
                    <a href={Url} target="_blank" data-interception="off" role="button">{Title}  </a>
                    <a href="#" className="inner-deptdd" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
                    <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
                        <ul id={`${ID}-Dept-Child`}>
                            {reactHandler.state.showdataLevelTwo}
                        </ul>
                    </div>
                </li>);

                //For Responsive
                reactHandler.displayDataResponsive.push(<li className="GetSubNodes">
                    <a href={Url} target="_blank" data-interception="off" role="button"><span>{Title}</span>  </a>
                    <a href="#" className="inner-deptdd" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")}><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
                    <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
                        <ul id={`${ID}-Dept-Child`}>
                            {reactHandler.state.showdataLevelTwoResponsive}
                        </ul>
                    </div>
                </li>);


                reactHandler.setState({
                    showdata: this.displayData,
                    showdataResponsive: this.displayDataResponsive
                });

            } else {
                reactHandler.displayData.push(<li>
                    <a href={Url} target="_blank" data-interception="off" role="button" >{Title}</a>
                </li>);

                //For Responsive
                reactHandler.displayDataResponsive.push(<li className="dep-res">
                    <a href={Url} target="_blank" data-interception="off" role="button" ><span>{Title}</span></a>
                </li>);

                reactHandler.setState({
                    showdata: this.displayData,
                    showdataResponsive: this.displayDataResponsive
                });
            }

        } else {
            if (HasSubDept == true) {
                reactHandler.displayData.push(<li className="GetSubNodes">
                    <a href={Url} data-interception="off" role="button">{Title} </a>
                    <a href="#" className="inner-deptdd" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
                    <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
                        <ul id={`${ID}-Dept-Child`}>
                            {reactHandler.state.showdataLevelTwo}
                        </ul>
                    </div>
                </li>);

                //For Responsive
                reactHandler.displayDataResponsive.push(<li className="GetSubNodes">
                    <a href={Url} data-interception="off" role="button">{Title} </a>
                    <a href="#" className="inner-deptdd" onClick={() => reactHandler.GetSubNodes(ID, Title, "NavMain", " ")} data-interception="off"><i className="fa fa-caret-down" aria-hidden="true" ></i></a>
                    <div className="third-level-submenu relative" id={`${ID}-Dept-Child-parent`}>
                        <ul id={`${ID}-Dept-Child`}>
                            {reactHandler.state.showdataLevelTwoResponsive}
                        </ul>
                    </div>
                </li>);

                reactHandler.setState({
                    showdata: this.displayData,
                    showdataResponsive: this.displayDataResponsive
                });
            } else {
                reactHandler.displayData.push(<li>
                    <a href={Url} data-interception="off" role="button"> {Title}</a>
                </li>);

                //For Responsive
                reactHandler.displayDataResponsive.push(<li>
                    <a href={Url} data-interception="off" role="button"><span> {Title}</span></a>
                </li>);

                reactHandler.setState({
                    showdata: this.displayData,
                    showdataResponsive: this.displayDataResponsive
                });
            }

        }
    }

    public appendDataLevelTwo(ID, Title, OpenInNewTab, HasSubDept, Url) {
        var reactHandler = this;
        if (OpenInNewTab == true) {
            if (HasSubDept == true) {

                $("#" + ID + "-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
            } else {

                $("#" + ID + "-Dept-Child").append(`<li> 
      <a href=${Url} target="_blank" data-interception="off" role="button" >${Title}</a>
      </li>`);
            }
            reactHandler.setState({
                showdataLevelTwo: this.displayDataLevel2,
                showdataLevelTwoResponsive: this.displayDataLevel2Responsive
            });
        } else {
            if (HasSubDept == true) {

                $("#" + ID + "-Dept-Child").append(`<li class="GetSubNodesLevelTwo"> 
      <a href=${Url} target="_blank" data-interception="off" role="button">${Title}</a> <i class="fa fa-caret-down" aria-hidden="true""></i>        
        <div class="third-level-submenu relative">
          <ul class="clearfix" id="${ID}-Dept-Child">                                                            
            
          </ul>    
        </div>
      </li>`);
            } else {

                $("#" + ID + "-Dept-Child").append(`<li> 
      <a href=${Url} data-interception="off" role="button"> ${Title}</a>
      </li>`);
            }
            reactHandler.setState({
                showdataLevelTwo: this.displayDataLevel2,
                showdataLevelTwoResponsive: this.displayDataLevel2Responsive
            });
        }

    }


    public appendDataQLink(Title, OpenInNewTab, Url) {
        var reactHandler = this;
        if (OpenInNewTab == true) {
            reactHandler.displayDataQlink.push(<li>
                <a href={`${Url}`} target="_blank" data-interception="off" role="button">{Title}</a>
            </li>);

            //For Responsive
            reactHandler.displayDataQlinkResponsive.push(<li>
                <a href={`${Url}`} target="_blank" data-interception="off" role="button"><span>{Title}</span></a>
            </li>);
        } else {
            reactHandler.displayDataQlink.push(<li>
                <a href={`${Url}`} data-interception="off" role="button">{Title}</a>
            </li>);

            //For Responsive
            reactHandler.displayDataQlinkResponsive.push(<li>
                <a href={`${Url}`} data-interception="off" role="button"><span>{Title}</span></a>
            </li>);
        }
        reactHandler.setState({
            showdataqlink: reactHandler.displayDataQlink,
            showdataqlinkResponsive: reactHandler.displayDataQlinkResponsive
        });
    }


    public OpenSearchPage(e, url) {

        var pathname = window.location.pathname.indexOf("UnifiedSearch")
        console.log(pathname)
        if (e.keyCode == 13) {
            if (pathname == -1) {
                window.open(
                    `${url}/SitePages/UnifiedSearch.aspx?q=${e.target.value}&env=WebView`,
                    "_blank"
                )
            } else {
                ""
                window.open(
                    `${url}/SitePages/UnifiedSearch.aspx?q=${e.target.value}&env=WebView`,
                    "_self"
                )
            }
        }

    }

    public OpenBurggerMainMenu() {
        $(".responsive-menu-wrap").addClass("open");
        $(".main-menu").show();
        $(".quicklink-menu").hide()
    }
    public OpenBurggerQuickLinkMenu() {
        $(".responsive-menu-wrap").addClass("open");
        $(".quicklink-menu").show();
        $(".main-menu").hide();
    }
    public CloseBurggerMenu() {

        $(".responsive-menu-wrap").removeClass("open");
        $(".dep-res").removeClass("active-submenu");
        $(".resp-dept-submenu-mob").removeClass("active");
        $(".responsi-inner-submenu").removeClass("open");


    }
    public OpenSearch() {
        $(".responsive-background").addClass("open");
        $(".search").addClass("open");
    }

    public render(): React.ReactElement<IResponsiveProps> {
        $('.globalleftmenu-fixed-area ul li').on('click', function () {
            $(this).siblings().removeClass('active');
            $(this).siblings().removeClass('open');
            $(this).addClass('active');
            $(this).toggleClass('open');
        });

        var handler = this;

        const ResponsiveMainNavigations: JSX.Element[] = handler.state.MainNavItems.map(function (item, key) {

            if (item.OpenInNewTab == true) {
                if (item.LinkMasterID != undefined) { var LinkMasterIDTitle = item.LinkMasterID.Title }
                if (LinkMasterIDTitle == "DEPT_00001") {
                    return (
                        <li className="submenu resp-dept-submenu-mob"> <a href="#" onClick={() => handler.GetDepartments()} data-interception="off"><span>{item.Title}</span><img src={`${handler.props.siteurl}/SiteAssets/img/next.svg`} alt="image" /></a>
                            <div className="responsi-inner-submenu">
                                <ul>
                                    {handler.state.showdataResponsive}
                                </ul>
                            </div>
                        </li>
                    );
                }
                if (LinkMasterIDTitle == "QLINK_00002") {
                    return (
                        <li className="submenu resp-qlink-submenu"> <a href="#" onClick={() => handler.GetQuickLinks()} data-interception="off"><span>{item.Title}</span><img src={`${handler.props.siteurl}SiteAssets/img/next.svg`} alt="image" /></a>
                            <div className="responsi-inner-submenu">
                                <ul>
                                    {handler.state.showdataqlinkResponsive}
                                </ul>
                            </div>
                        </li>
                    );
                }
                if (LinkMasterIDTitle == undefined) {
                    var str = item.Title;
                    var DomID = str.replace(/[_\W]+/g, "_");
                    if (item.Title == "HomePage") {
                        return (
                            <li className=" " id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"><span> {item.Title}</span></a> </li>
                        );
                    } else if (item.Title == "Content Editor") {
                        if (handler.state.IsAdminForContentEditor == true) {
                            return (
                                <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"> <span>{item.Title}</span></a> </li>
                            );
                        }
                    } else {
                        return (
                            <li id={DomID}> <a href={`${item.URL}`} target="_blank" data-interception="off"><span> {item.Title}</span></a> </li>
                        );
                    }

                }
            } else {
                if (LinkMasterIDTitle == "DEPT_00001") {
                    return (
                        <li className="submenu resp-dept-submenu-mob"> <a href="#" onClick={() => handler.GetDepartments()} data-interception="off"><span>{item.Title}</span><img src={`${handler.props.siteurl}/SiteAssets/img/next.svg`} alt="image" /></a>
                            <div className="responsi-inner-submenu">
                                <ul>
                                    {handler.state.showdataResponsive}
                                </ul>
                            </div>
                        </li>
                    );
                }
                if (LinkMasterIDTitle == "QLINK_00002") {
                    return (
                        <li className="submenu resp-qlink-submenu"> <a href="#" onClick={() => handler.GetQuickLinks()} data-interception="off"><span>{item.Title}</span><img src={`${handler.props.siteurl}/SiteAssets/img/next.svg`} alt="image" /></a>
                            <div className="responsi-inner-submenu">
                                <ul>
                                    {handler.state.showdataqlinkResponsive}
                                </ul>
                            </div>
                        </li>
                    );
                }
                if (LinkMasterIDTitle == undefined) {
                    var str2 = item.Title;
                    var DomID2 = str2.replace(/[_\W]+/g, "_");
                    if (item.Title == "HomePage") {
                        return (
                            <li className=" " id={DomID2}> <a href={`${item.URL}`} data-interception="off"><span> {item.Title}</span></a> </li>
                        );
                    } else if (item.Title == "Content Editor") {
                        if (handler.state.IsAdminForContentEditor == true) {
                            return (
                                <li id={DomID}> <a href={`${item.URL}`} data-interception="off"><span> {item.Title}</span></a> </li>
                            );
                        }
                    } else {
                        return (
                            <li id={DomID}> <a href={`${item.URL}`} data-interception="off"><span> {item.Title}</span></a> </li>
                        );
                    }
                }

            }
        });
        const ResponsiveQuicklinks: JSX.Element[] = handler.state.QuickLinkItems.map(function (item, key) {
            if (item.OpenInNewTab == true) {
                return (
                    <li>
                        <a href={`${item.URL.Url}`} target="_blank" data-interception="off" role="button">{item.Title}</a>
                    </li>
                );

            }
        });
        return (

            <>
                {/*reponaive contents  menu */}

                <div className="responsive-menu-wrap">
                    <div className="reponsive-quick-wrap">
                        <div className="main-menu">
                            <ul>
                                {ResponsiveMainNavigations}

                            </ul>
                        </div>
                        <div className="quicklink-menu">
                            <ul>
                                {ResponsiveQuicklinks}

                            </ul>
                        </div>
                    </div>
                    <div className="responsive-qiuck-close">
                        <a href="#" onClick={this.CloseBurggerMenu} onTouchStart={this.CloseBurggerMenu} data-interception="off"><i className="fa fa-close"></i></a>
                    </div>
                    <div className="responsive-background">

                    </div>
                </div>

                <div className="responsive-notifications">
                    <ul>
                        <li className="meet-count" data-tip data-for={"React-tooltip-calendar-resp"} data-custom-class="tooltip-custom">
                            <a href="https://outlook.office365.com/calendar/view/month" target="_blank" data-interception="off" className="notification relative" >
                                <img src={`${this.props.siteurl}/SiteAssets/img/rn4.svg`} alt="images" />
                                <span id="Meetings_count"> {this.state.MeetingsCount} </span>
                            </a>
                            <ReactTooltip id={"React-tooltip-calendar-resp"} place="top" type="dark" effect="solid">
                                <span>Calendar</span>
                            </ReactTooltip>
                        </li>
                        <li data-tip data-for={"React-tooltip-my-team-resp"} data-custom-class="tooltip-custom">
                            <a href={`${this.props.siteurl}/SitePages/My-Team.aspx?env=WebViewList`} data-interception="off" className="notification relative">
                                <img src={`${this.props.siteurl}/SiteAssets/img/rn1.svg`} alt="images" />
                            </a>
                            <ReactTooltip id={"React-tooltip-my-team-resp"} place="top" type="dark" effect="solid">
                                <span>Teams</span>
                            </ReactTooltip>
                        </li>
                        <li className="count-email" data-tip data-for={"React-tooltip-Email-resp"} data-custom-class="tooltip-custom">
                            <a href="https://outlook.office365.com/mail/inbox" target="_blank" data-interception="off" className="notification relative">
                                <img src={`${this.props.siteurl}/SiteAssets/img/rn2.svg`} alt="images" />
                                <span id="Emails_count"> {this.state.EmailCount} </span>
                            </a>
                            <ReactTooltip id={"React-tooltip-Email-resp"} place="top" type="dark" effect="solid">
                                <span>EMail</span>
                            </ReactTooltip>
                        </li>

                    </ul>
                </div>
            </>

        );
    }
}
