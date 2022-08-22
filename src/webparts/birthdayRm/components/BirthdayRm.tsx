import * as React from 'react';
import styles from './BirthdayRm.module.scss';
import { IBirthdayRmProps } from './IBirthdayRmProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { Web } from "@pnp/sp/presets/all"
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';
import { sp } from '@pnp/sp';
import pnp from 'sp-pnp-js';
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
var bdaydate = "raju";
export interface IBirthdayState {
  Items: any[];
  commentitems: any[];
  IsUserAlreadyLiked: boolean;
  IsUserAlreadyCommented: boolean;
  IsLikeEnabled: boolean;
  IsCommentEnabled: boolean;
}

export default class BirthdayRm extends React.Component<IBirthdayRmProps, IBirthdayState, {}> {
  public constructor(props: IBirthdayRmProps, state: IBirthdayState) {
    super(props);
    this.state = {
      Items: [],
      commentitems: [],
      IsUserAlreadyLiked: false,
      IsUserAlreadyCommented: false,
      IsLikeEnabled: false,
      IsCommentEnabled: false,
    };
  }
  public componentDidMount() {

    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    }, 2000);

    var reactHandler = this;
    reactHandler.GetCurrentUser();
    const url: any = new URL(window.location.href);
    ItemID = url.searchParams.get("ItemID");
    reactHandler.GetBirthday(ItemID);
  }
  public pagereload() {
    const nextURL = '' + this.props.siteurl + '/SitePages/Birthday.aspx?ItemID=' + ItemID + '&mode=reload';
    const nextTitle = 'Birthday';
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
    // if (mode == "reload") {
    //   handler.viewsCount();
    // } else {

    //   handler.pagereload();

    const item = sp.web.lists.getByTitle("ViewsCountMaster").items.add({
      EmployeeNameId: User,
      ViewedOn: CurrentDate,
      EmployeeEmail: UserEmail,
      ContentPage: "Birthday",
      Title: title,
      ContentID: ID,
    })
  }
  public viewsCount() {
    sp.web.lists.getByTitle("ViewsCountMaster").items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending      
      if (items.length != 0) {
        views = items.length;
      } else {
        views = 0;
      }
    });
  }
  //brithday code <
  public async GetBirthday(ItemID) {
    var reactHandler = this;
    await sp.web.lists.getByTitle("Birthday").items.select("Title", "DOB", "Name", "Picture", "Designation", "Description", "ID", "EnableComments", "EnableLikes", "Created").filter(`IsActive eq '1'and ID eq '${ItemID}'`).getAll().then((items) => { // //orderby is false -> decending          
      title = items[0].Title;
      ID = items[0].ID;
      var tdaydate = moment().format('MM/DD');
      var bday = moment(items[0].DOB).format('MM/DD');

      if (tdaydate == bday) {
        bdaydate = "Today"
      } else {
        bdaydate = "" + moment(items[0].DOB).format('MMM DD') + "";
      }

      reactHandler.setState({
        Items: items,
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
      }
      reactHandler.AddViews();
      reactHandler.checkUserAlreadyLiked();
      reactHandler.checkUserAlreadyCommented();
      reactHandler.viewsCount();
      reactHandler.likesCount();
      reactHandler.commentsCount();
    })
  }
  //brithday code >
  public async checkUserAlreadyLiked() {
    await sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => { // //orderby is false -> decending          
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
    await sp.web.lists.getByTitle("CommentsCountMaster").items.filter(`ContentPage eq 'Birthday' and ContentID eq '${ID}' and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {

        this.setState({
          IsUserAlreadyCommented: true
        });
        $(".reply-tothe-post").hide();
      }
    });
  }
  public likesCount() {
    sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        likes = items.length;
      } else {
        likes = 0;
      }
    });

  }
  public commentsCount() {
    sp.web.lists.getByTitle("CommentsCountMaster").items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
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

    sp.web.lists.getByTitle("CommentsCountMaster").items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending           

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
        ContentPage: "Birthday",
        Title: title,
        ContentID: ID,
      }).then(() => {
        $(".like-default").hide()
        $(".like-selected").show();
        sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
          var like = items.length;
          var newspan = like.toString()
          document.getElementById("likescount").textContent = newspan;
        });
      })
    } else {
      $(".like-selected").hide();
      $(".like-default").show();
      sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).get().then((data) => {

        sp.web.lists.getByTitle("LikesCountMaster").items.getById(data[0].Id).delete().then(() => {

          sp.web.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
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
    sp.web.lists.getByTitle("CommentsCountMaster").items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending           

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
        ContentPage: "Birthday",
        Title: title,
        ContentID: ID,
        UserComments: comments
      }).then(() => {
        $("#commentedpost").hide();
        $(".reply-tothe-post").hide();
        sp.web.lists.getByTitle("CommentsCountMaster").items.filter(`ContentPage eq 'Birthday' and ContentID eq ${ID}`).top(5000).get().then((items) => {

          commentscount = items.length;
          var newspan = commentscount.toString()
          document.getElementById("commentscount").textContent = newspan;
        })
      })

    }
  }

  public render(): React.ReactElement<IBirthdayRmProps> {
    var handler = this;
    const Birthday: JSX.Element[] = this.state.Items.map(function (item, key) {

      let RawImageTxt = item.Picture;
      var Name = item.Name;
      var Designation = item.Designation

      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        return (
          <>
            <div className="people-highlights">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" className="people-img" />
              <img src={`${handler.props.siteurl}/SiteAssets/img/highlight.svg`} alt="image" className="highlight-img" />
            </div>
            <div className="row home-detail-banner people-detail">
              <div className="col-md-12">
                <div className="ceo-readmore-wrap clearfix">
                  <div className="ceo-radmore-right">
                    <h2 className="nw-list-main birthday"> {item.Name} </h2>
                    <p>{item.Designation}</p>
                  </div>
                  <div className="mews-details-para">
                    <p>{item.Description}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="people-highlights">
              <img src={`${handler.props.siteurl}/SiteAssets/img/userphoto.jpg`} alt="image" className="people-img" />

              <img src={`${handler.props.siteurl}/SiteAssets/img/highlight.svg`} alt="image" className="highlight-img" />
            </div>
            <div className="row home-detail-banner people-detail">
              <div className="col-md-12">
                <div className="ceo-readmore-wrap clearfix">
                  <div className="ceo-radmore-right">
                    <h2 className="nw-list-main birthday"> {item.Name} </h2>
                    <p>{item.Designation}</p>
                  </div>
                  <div className="mews-details-para">
                    <p>{item.Description}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
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
    return (<>
      <div id="Birthday">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">

            <div className="section-rigth">
              <div className="inner-page-contents ">
                <div className="sec m-b-20">
                  <div className="inner-banner-header email-banner relative m-b-20">

                    {/* <!-- <div className="inner-banner-overlay"></div> --> */}
                    <div className="inner-banner-contents banner-contents">
                      <h1> Celebrating his birthday on {bdaydate}</h1>
                      <ul className="breadcums mail-breadcums">
                        <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`}> Home </a> </li>
                        <li style={{ pointerEvents: "none" }}>  <a href="#">Birthday Read More </a> </li>
                      </ul>
                    </div>

                  </div>

                  {Birthday}
                  {/* <div className="align-center">
                  <a href="#" type="button" className="btn filter-btn">
                    <span>
                      <img src={`${this.props.siteurl}/Siteassets/img/like.svg"} className="filter-icon b-hover" />
                      <img src={`${this.props.siteurl}/Siteassets/img/like-w.svg"} className="filter-icon h-hover" />
                    </span>Let Wish Him</a>
                </div> */}

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
    </>
    );
  }
}
