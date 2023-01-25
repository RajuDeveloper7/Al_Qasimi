import * as React from 'react';
import styles from './AnnouncementsRm.module.scss';
import { IAnnouncementsRmProps } from './IAnnouncementsRmProps';
import { escape, update } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';
import { SPComponentLoader } from '@microsoft/sp-loader';
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';
import pnp from 'sp-pnp-js';
import { IItemAddResult } from '@pnp/sp/items';
import swal from 'sweetalert';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';
var User = "";
var UserEmail = "";
var title = "";
var ID: number;
var likes: number;
var commentscount: number;
var views: number;
var CurrentDate = new Date()  //moment().format("DD/MM/YYYY");
var ItemID;

export interface IAnnouncementsRmState {
  Items: any[];
  ItemID: number;
  commentitems: any[];
  IsUserAlreadyLiked: boolean;
  IsUserAlreadyCommented: boolean;
  IsLikeEnabled: boolean;
  IsCommentEnabled: boolean;
}

var NewWeb;

export default class AnnouncementsRm extends React.Component<IAnnouncementsRmProps, IAnnouncementsRmState, {}> {
  constructor(props: IAnnouncementsRmProps, state: IAnnouncementsRmState) {
    super(props);
    this.state = {
      Items: [],
      ItemID: null,
      commentitems: [],
      IsUserAlreadyLiked: false,
      IsUserAlreadyCommented: false,
      IsLikeEnabled: false,
      IsCommentEnabled: false,

    };
    NewWeb = Web("" + this.props.siteurl + "");
  }

  public componentDidMount() {

    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
    }, 2000);

    var reactHandler = this;
    reactHandler.GetCurrentUser();
    const url: any = new URL(window.location.href);
    ItemID = url.searchParams.get("ItemID");
    reactHandler.GetAnnouncementsDetails(ItemID);

  }
  public pagereload() {
    const nextURL = '' + this.props.siteurl + '/SitePages/Announcement-Read-More.aspx?ItemID=' + ItemID + '&mode=reload';
    const nextTitle = 'Announcement-Read-More';
    const nextState = { additionalInformation: 'Updated the URL with JS' };
    window.history.replaceState(nextState, nextTitle, nextURL);
  }
  public async GetCurrentUser() {
    User = this.props.userid;
    UserEmail = this.props.useremail;
  }
  public AddViews() {
    const url: any = new URL(window.location.href);
    const mode = url.searchParams.get("mode");
    var handler = this;
    // if(mode == "reload"){
    //   handler.viewsCount();
    // }else{

    // handler.pagereload();

    const item = sp.web.lists.getByTitle("ViewsCountMaster").items.add({
      EmployeeNameId: User,
      ViewedOn: CurrentDate,
      EmployeeEmail: UserEmail,
      ContentPage: "Announcements",
      Title: title,
      ContentID: ID,
    })
  }

  public viewsCount() {
    sp.web.lists.getByTitle("ViewsCountMaster").items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending      
      if (items.length != 0) {
        views = items.length;
      } else {
        views = 0;
      }
    });
  }
  public GetAnnouncementsDetails(ItemID) {
    var reactHandler = this;
    sp.web.lists.getByTitle("Announcement").items.select("Title", "EnableComments", "EnableLikes", "Description", "Created", "Image", "ID").filter(`IsActive eq '1' and ID eq '${ItemID}'`).getAll().then((items) => { // //orderby is false -> decending          
      title = items[0].Title;
      ID = items[0].ID
      reactHandler.setState({
        Items: items, ItemID: items[0].Id
      });
      if (items[0].EnableLikes == true) {
        reactHandler.setState({
          IsLikeEnabled: true
        })
      }
      if (items[0].EnableComments == true) {
        reactHandler.setState({
          IsCommentEnabled: true
        })
      } else {
        $(".all-commets").hide();
        $("#commentedpost").hide();
      }

      reactHandler.AddViews();
      reactHandler.checkUserAlreadyLiked();
      reactHandler.checkUserAlreadyCommented();
      reactHandler.viewsCount();
      reactHandler.likesCount();
      reactHandler.commentsCount();
    })
  }
  public checkUserAlreadyLiked() {
    sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        $(".like-selected").show();
        $(".like-default").hide();
        this.setState({
          IsUserAlreadyLiked: true
        });
      }
    });
  }
  public async checkUserAlreadyCommented() {
    await sp.web.lists.getByTitle("CommentsCountMaster").items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {

        this.setState({
          IsUserAlreadyCommented: true
        });
        $(".reply-tothe-post").hide();
      }
    });
  }
  public likesCount() {
    sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        likes = items.length;
      } else {
        likes = 0;
      }
    });
  }
  public commentsCount() {
    sp.web.lists.getByTitle("CommentsCountMaster").items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        commentscount = items.length;
      } else {
        commentscount = 0;
      }
    });
    this.checkUserAlreadyCommented();
    this.getusercomments();
  }
  public getusercomments() {
    sp.web.lists.getByTitle("CommentsCountMaster").items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      this.setState({
        commentitems: items,
      });
    });
  }

  public async liked(mode) {

    var handler = this;
    if (mode == "like") {

      sp.web.lists.getByTitle("LikesCountMaster").items.add({
        EmployeeNameId: User,
        LikedOn: CurrentDate,
        EmployeeEmail: UserEmail,
        ContentPage: "Announcements",
        Title: title,
        ContentID: ID,
      }).then(() => {
        $(".like-default").hide()
        $(".like-selected").show();
        sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
          var like = items.length;
          var newspan = like.toString()
          document.getElementById("likescount").textContent = newspan;
        });
      })
    } else {
      $(".like-selected").hide();
      $(".like-default").show();
      sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).get().then((data) => {
        sp.web.lists.getByTitle("LikesCountMaster").items.getById(data[0].Id).delete().then(() => {

          sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
            var like = items.length;
            var newspan = like.toString()
            document.getElementById("likescount").textContent = newspan;

          });
        })
      })
    }

  }

  public showComments() {
    $(".all-commets").toggle();
    sp.web.lists.getByTitle("CommentsCountMaster").items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending           

      this.setState({
        commentitems: items,
      });
    });

  }
  public saveComments() {

    var handler = this;
    var comments = $("#comments").val();
    if (comments.toString().length == 0) {
      swal({
        title: "Minimum 1 character is required!",
        icon: "warning",
      } as any)
    } else {
      const item = sp.web.lists.getByTitle("CommentsCountMaster").items.add({
        EmployeeNameId: User,
        CommentedOn: CurrentDate,
        EmployeeEmail: UserEmail,
        ContentPage: "Announcements",
        Title: title,
        ContentID: ID,
        UserComments: comments
      }).then(() => {
        $("#commentedpost").hide();
        $(".reply-tothe-post").hide();
        sp.web.lists.getByTitle("CommentsCountMaster").items.filter(`ContentPage eq 'Announcements' and ContentID eq ${ID}`).top(5000).get().then((items) => {

          commentscount = items.length;
          var newspan = commentscount.toString()
          document.getElementById("commentscount").textContent = newspan;
        })
      })

    }
  }
  public render(): React.ReactElement<IAnnouncementsRmProps> {

    var handler = this;
    var Dte = "";

    const AnncDetails: JSX.Element[] = this.state.Items.map(function (item, key) {
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
          <div className="col-md-12 view-all-news-l-col home-detail-banner">
            <div className="view-all-news-recent-left">
              <div className="view-all-news-recent-img-cont">
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
              </div>
              <h2 className="nw-list-main"> {item.Title} </h2>
              <div className="ns-tag-duration clearfix">
                <div className="pull-left">
                  <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off"> {Dte} </a>
                </div>
              </div>
              <div className="mews-details-para">
                <p> <Markup content={item.Description} /> </p>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="col-md-12 view-all-news-l-col home-detail-banner">
            <div className="view-all-news-recent-left">
              <div className="view-all-news-recent-img-cont">
                <img src={`${handler.props.siteurl}/SiteAssets/Img/Error%20Handling%20Images/home_banner_noimage.png`} alt="image" />
              </div>
              <h2 className="nw-list-main"> {item.Title} </h2>
              <div className="ns-tag-duration clearfix">
                <div className="pull-left">
                  <a href="#" className="tags" style={{ pointerEvents: "none" }} data-interception="off"> {Dte} </a>
                </div>
              </div>
              <div className="mews-details-para">
                <p> <Markup content={item.Description} /> </p>
              </div>
            </div>
          </div>
        );
      }
    });
    const pagecomments: JSX.Element[] = this.state.commentitems.map(function (item, key) {
      var EmpName = item.EmployeeName.Title;
      var dated = moment(item.CommentedOn).format("DD/MM/YYYY");
      var comment = item.UserComments;

      return (
        <li>
          <div className="commentor-desc clearfix">
            <div className="commentor-image">
              <img src={`${handler.props.siteurl}/SiteAssets/test/img/userphoto.jpg`} alt="image" />
            </div>
            <div className="commentor-details-desc">
              <h3>  {EmpName} </h3> <span>  {dated}  </span>
              <p>  {comment} </p>
            </div>
          </div>
        </li>
      );

    });

    return (
      <div className={styles.announcementsRm} id="annc-read-mb-t-50">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Announcements </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href={`${this.props.siteurl}/SitePages/Announcement-View-More.aspx`} data-interception="off"> All Announcements </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off">Announcements Read More </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="row">
                    {AnncDetails}
                  </div>
                  <div>
                    <div className="comments-like-view">
                      <div className="comments-like-view-block">
                        <ul className="comments-like-view-block">
                          {this.state.IsLikeEnabled == true ?
                            <li>

                              <img className="like-selected" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_like_selected.svg`} alt="image" onClick={() => this.liked("dislike")} />

                              <img className="like-default" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_like.svg`} alt="image" onClick={() => this.liked("like")} />
                              <span id="likescount"> {likes} </span>

                            </li>
                            : <></>
                          }
                          {this.state.IsCommentEnabled == true &&
                            <li>
                              <img src={`${this.props.siteurl}/SiteAssets/test/img/lcv_comment.svg`} alt="image" onClick={() => this.showComments()} /> <span id="commentscount"> {commentscount} </span>
                            </li>
                          }
                          <li>
                            <img className="nopointer" src={`${this.props.siteurl}/SiteAssets/test/img/lcv_view.svg`} alt="image" /> <span> {views} </span>
                          </li>
                        </ul>
                      </div>
                      <div className="reply-tothe-post all-commets">
                        <h2> All Comments </h2>
                        <ul>
                          {pagecomments.length != 0 ? pagecomments : <p>No comments yet....!</p>}
                        </ul>
                      </div>
                      {this.state.IsUserAlreadyCommented == false ?
                        <div className="reply-tothe-post" id="commentedpost">
                          <h2> Comment to this post </h2>
                          <textarea id="comments" placeholder="Message Here" style={{ resize: "none" }} className="form-control"></textarea>
                          <input type="button" className="btn btn-primary" value="Submit" onClick={() => this.saveComments()} />
                        </div>
                        :
                        <></>
                      }
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
