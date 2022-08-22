import * as React from 'react';
import styles from './ManageQuickLinks.module.scss';
import { IManageQuickLinksProps } from './IManageQuickLinksProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult } from "@pnp/sp/items";
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import swal from 'sweetalert';
import { Web } from "@pnp/sp/presets/all";
import Sortable from 'sortablejs/modular/sortable.complete.esm.js';
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';
import { sp } from '@pnp/sp';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';

export interface IQuickLinkManagerState {
  items: any[];
  ExistingQuickLinksCount: any;
  BgBanner: any[];
  MyQuickLinksPrefference: any[];
  ExistingQL: any[];
  MyQLinksArray: any[];
  AvailableSpaceCount: number;
  IsEditModeisON: boolean;
  CurrentlyOpened: string;
  IsMyQuickLinksEmpty: boolean;
}
let ExistingQlinks = [];
let MyQlinkArr = [];
var tempFavHolderArr = [];

export default class NewQuickLinkManager extends React.Component<IManageQuickLinksProps, IQuickLinkManagerState, {}> {
  public constructor(props: IManageQuickLinksProps, state: IQuickLinkManagerState) {
    super(props);
    this.state = {
      items: [],
      ExistingQuickLinksCount: 0,
      BgBanner: [],
      MyQuickLinksPrefference: [],
      ExistingQL: [],
      MyQLinksArray: [],
      AvailableSpaceCount: 5,
      IsEditModeisON: false,
      CurrentlyOpened: "",
      IsMyQuickLinksEmpty: true
    };
  }
  public componentDidMount() {

    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
    }, 2000);

    this.getcurrentusersQuickLinksForEdit();
    this.GetAllQuickLinks();

    var el = document.getElementById('quicklink-tab-area');
    var sortable = Sortable.create(el, {
      dataIdAttr: 'data-id',
      onEnd: function (/**Event*/evt) {
        $(evt.item).parent().find('.qlink-with-index').each(function () {
          $(this).find('span').text($(this).index() + 1);
        });
        UpdateQuickLinkOrder();
      },
    });
  }
  public async GetAllQuickLinks() {
    var reactHandler = this;
    var AllID = "";
    for (var i = 0; i < ExistingQlinks.length; i++) {
      if (ExistingQlinks.length != 0) {
        let LastIndex = ExistingQlinks.length - 1;
        if (i == LastIndex) {
          AllID += "Id ne " + ExistingQlinks[i].ItemId + "";
        } else {
          AllID += "Id ne " + ExistingQlinks[i].ItemId + " and ";
        }
      }
    }
    if (ExistingQlinks.length != 0) {
      await sp.web.lists.getByTitle("Quick Links").items.select("Title", "ID", "URL", "Image", "ImageHover").filter(`IsActive eq '1' and ${AllID}`).orderBy("Order0", true).get().then((items) => {
        reactHandler.setState({
          items: items
        });
      })

    } else {
      await sp.web.lists.getByTitle("Quick Links").items.select("Title", "ID", "URL", "Image", "ImageHover").filter(`IsActive eq '1'`).orderBy("Order0", true).get().then((items) => {
        reactHandler.setState({
          items: items
        });
      })

    }

  }
  public async getcurrentusersQuickLinksForEdit() {
    var reactHandler = this;
    let UserID = this.props.userid;
    let ITemID = null;
    ExistingQlinks = [];

    await sp.web.lists.getByTitle("UsersQuickLinks").items.select("ID", "SelectedQuickLinks/Id", "SelectedQuickLinks/Title", "URL", "Order0", "ImageSrc", "HoverImageSrc").filter(`Author/Id eq '${UserID}'`).expand("SelectedQuickLinks").orderBy("Order0", true).get().then(async (items) => {
      reactHandler.setState({
        MyQuickLinksPrefference: items
      });
      if (this.state.IsEditModeisON == true) {
        setTimeout(() => {
          $(".delete-quicklinks").addClass("open");
        }, 1500);
      }
      if (items.length != 0) {
        this.setState({
          IsMyQuickLinksEmpty: false
        });
      } else {
        this.setState({
          IsMyQuickLinksEmpty: true
        });
        // setTimeout(() => {
        //   $(".mode-edit-on,.mode-edit-off").hide();
        // }, 200);

      }

      this.setState({ MyQLinksArray: items });
      for (var i = 0; i < items.length; i++) {
        // $(`#${items[i].SelectedQuickLinks.Id}`).hide();
        tempFavHolderArr.push(items[i].SelectedQuickLinks.Id)
      }
      let QlinkCount = ExistingQlinks.length;
      reactHandler.setState({ AvailableSpaceCount: 5 - QlinkCount });
      reactHandler.GetAllQuickLinks();
    });
  }
  public EnableEditMode(CurrentTab) {

    this.setState({
      IsEditModeisON: true
    })
    this.ShowDeletedBtn();
    this.ShowAddBtn();
    //this.RemoveActionMenu();
  }

  public ExitEditMode(CurrentTab) {
    this.setState({
      IsEditModeisON: false
    })

    this.HideDeletedBtn();
    this.HideAddBtn();
  }

  public ShowDeletedBtn() {
    $(".delete-quicklinks").addClass("open");
  }

  public HideDeletedBtn() {
    $(".delete-quicklinks").removeClass("open");
  }

  public ShowAddBtn() {
    $(".add-quicklinks").addClass("open");
  }

  public HideAddBtn() {
    $(".add-quicklinks").removeClass("open");
  }

  public async AddToMyQuickLinkPreference(ItemID, ImageSrc, HoverImageSrc, URL, index) {

    sp.web.lists.getByTitle("UsersQuickLinks").items.filter(`Author/Id eq ${this.props.userid}`).get().then(async (resp) => {
      if (resp.length < 5) {
        if (tempFavHolderArr.indexOf(ItemID) === -1) {
          const iar: IItemAddResult = await sp.web.lists.getByTitle("UsersQuickLinks").items.add({
            SelectedQuickLinksId: ItemID,
            ImageSrc: ImageSrc,
            HoverImageSrc: HoverImageSrc,
            URL: URL,
            Order0: index
          });
          MyQlinkArr = [];
          this.setState({ MyQLinksArray: [] });
          this.getcurrentusersQuickLinksForEdit();
        } else {

          $("#bt-qlink-adder").prop("disabled", false);
          swal({
            title: "Aleady exist",
            icon: "warning",
            showConfirmButton: false,
            // timer: 1500,
          } as any)
        }
      } else {
        $("#bt-qlink-adder").prop("disabled", false);
        swal({
          title: "No space, only 5 links can be added!",
          icon: "warning",
          showConfirmButton: false,
          //  timer: 1500,
        } as any)

      }
    })


  }
  public DeleteMyQuickLink(ID: any) {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    } as any)
      .then((willDelete) => {
        if (willDelete) {
          let list = sp.web.lists.getByTitle("UsersQuickLinks");
          list.items.getById(ID).delete().then(() => {
            swal({
              title: "Deleted Successfully",
              icon: "success",
              showConfirmButton: false,
              // timer: 1500,
            } as any).then(() => {
              tempFavHolderArr = []
              this.getcurrentusersQuickLinksForEdit();
            });
          });
        }
      });
  }

  public render(): React.ReactElement<IManageQuickLinksProps> {
    var reactHandler = this;

    const MyQuickLinks: JSX.Element[] = reactHandler.state.MyQLinksArray.map(function (item, key) {
      return (

        <li className='qlink-with-index' >
          <span className="indexers" style={{ display: "none" }} data-value={`${key + 1}|${item.Id}`}>{key + 1}</span>
          <a href={`${item.URL}`} data-interception="off" target="_blank">
            <img src={`${item.HoverImageSrc}`} alt="image" />
            <h5> {item.SelectedQuickLinks.Title} </h5>
          </a>
          <div className="delete-quicklinks" onClick={() => reactHandler.DeleteMyQuickLink(item.ID)}>
            <img src={`${reactHandler.props.siteurl}/SiteAssets/img/remove_q.svg`} alt="image" />
          </div>
        </li>

      );
    });

    const AllQuickLinks: JSX.Element[] = reactHandler.state.items.map(function (item, key) {
      let RawImageTxt = item.Image;
      let RawImageHoverTxt = item.ImageHover;

      if (RawImageTxt != "") {
        var ImgObj = JSON.parse(RawImageTxt);
        var ImgObjHover = JSON.parse(RawImageHoverTxt);

        return (
          <li>
            <a href="#" data-interception="off">   <img src={`${ImgObjHover.serverRelativeUrl}`} alt="image" />
              <h5> {item.Title} </h5>
              <div className="add-quicklinks" id={item.ID}>
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/add_quick.png`} alt="image"
                  onClick={() => reactHandler.AddToMyQuickLinkPreference(item.ID, ImgObj.serverRelativeUrl, ImgObjHover.serverRelativeUrl, item.URL.Url, key + 1)} />
              </div>
            </a>
          </li>
        );
      }
    });
    return (
      <div className={styles.quickLinkManager} id="quickLinkManager">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>

        <section>
          <div className="relative container">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Manage Quick Links </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Manage Quick Links </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec">
                  <div className="added-quickis-part">

                    <div className="heading clearfix"><div className="header-left">Added Quicklinks</div>
                      <div className="dragnddrop_text" >
                        <img src={`${this.props.siteurl}/SiteAssets/img/drap_drop.png`} alt="image" data-themekey="#" />
                        You can drag and drop to change position
                      </div>
                      <div className="header-right drap-drop-p">
                        {this.state.IsEditModeisON == false ?
                          <a href="#" className='editor-mode-enabler mode-edit-on' onClick={() => this.EnableEditMode(this.state.CurrentlyOpened)} >
                            <img src={`${this.props.siteurl}/SiteAssets/img/add_quick.png`} alt="image" data-themekey="#" />
                            Edit Mode</a>
                          :
                          <a href="#" className='editor-mode-enabler mode-edit-off' onClick={() => this.ExitEditMode(this.state.CurrentlyOpened)}>
                            <img src={`${this.props.siteurl}/SiteAssets/img/newdrap_drop.png`} alt="image" data-themekey="#" />
                            Exit</a>
                        }


                      </div>
                    </div>
                    {/* <div className="heading clearfix">
                      <div className="header-left">
                        Added Quicklinks
                      </div>
                      <div className="header-right drap-drop-p">
                        <img src={`${this.props.siteurl}/SiteAssets/img/drap_drop.png`} alt="image" />  You can drag and drop to change position...
                        {this.state.IsEditModeisON == false ?
                          <a href="#" className='editor-mode-enabler mode-edit-on' onClick={() => this.EnableEditMode(this.state.CurrentlyOpened)}>Edit Mode</a>
                          :
                          <a href="#" className='editor-mode-enabler mode-edit-off' onClick={() => this.ExitEditMode(this.state.CurrentlyOpened)}>Exit Edit Mode</a>
                        }
                      </div>
                    </div> */}
                    <div className="section-part">
                      <ul className="qq-links-part clearfix my-qlink-block" id="quicklink-tab-area">
                        {this.state.IsMyQuickLinksEmpty == false ?
                          MyQuickLinks
                          :
                          <div className='no-fav-records if-favtab-empty if-tab-empty'>

                            <img src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/error-icon.svg`} alt="no-fav" />
                            <h3> No Quicklinks Added </h3>
                            <p> In Aswaq you mark as quicklinks are shown here </p>
                          </div>
                        }

                      </ul>
                    </div>
                  </div>
                  <div className="whole-quickis-part">
                    <div className="heading clearfix">
                      <div className="header-left">
                        Quicklinks <span> {this.state.AvailableSpaceCount == 0 ? "Delete any quick link to add new" : `Select any ${this.state.AvailableSpaceCount} links to show in the Home page`}  </span>
                      </div>
                    </div>
                    <div className="section-part">
                      <ul className="qq-links-part clearfix">
                        {AllQuickLinks}
                      </ul>
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
function UpdateQuickLinkOrder() {
  let list = sp.web.lists.getByTitle("UsersQuickLinks");
  $("ul.my-qlink-block li.qlink-with-index").each(function () {
    var newIndexValue: any = $(this).data("value");
    newIndexValue = newIndexValue.split("|");
    var ItemID = newIndexValue[1];
    const i = list.items.getById(ItemID).update({
      Order0: $(this).text()
    });
  });
}
