import * as React from 'react';
import styles from './NewsReadMore.module.scss';
import { INewsReadMoreProps } from './INewsReadMoreProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery'
import { Markup } from 'interweave';
import { Web } from "@pnp/sp/presets/all";
import GlobalSideNav from '../../../extensions/globalCustomFeatures/GlobalSideNav';
import { sp } from '@pnp/sp';
import pnp from 'sp-pnp-js';
import "@pnp/sp/site-users/web";
import swal from 'sweetalert';
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';

var User = "";
var UserEmail = "";
var title = "";
var ID: number;
var likes: number;
var commentscount: number;
var views: number;
var CurrentDate = new Date()

export interface INewsRmState {
  Items: any[];
  TagBasedMoreNews: any[];
  RawJsonHtml: any[];
  Tag: string;
  Department: string;
  SitePageID: number;
  NewsViewCount: number;
  ActiveMainNewsID: number;
  commentitems: any[];
  IsUserAlreadyLiked: boolean;
  IsUserAlreadyCommented: boolean;
  IsLikeEnabled: boolean;
  IsCommentEnabled: boolean;
}

var NewWeb

export default class NewsRm extends React.Component<INewsReadMoreProps, INewsRmState, {}> {
  constructor(props: INewsReadMoreProps, state: INewsRmState) {
    super(props);
    pnp.setup({
      spfxContext: this.props.context
    });

    this.state = {
      Items: [],
      TagBasedMoreNews: [],
      RawJsonHtml: [],
      Tag: "",
      Department: "",
      SitePageID: null,
      NewsViewCount: 0,
      ActiveMainNewsID: null,
      commentitems: [],
      IsUserAlreadyLiked: false,
      IsUserAlreadyCommented: false,
      IsLikeEnabled: false,
      IsCommentEnabled: false
    };
    NewWeb = Web(this.props.siteurl);
  }

  public componentDidMount() {
    setTimeout(() => {
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#spLeftNav').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('#newsRm').show();
    }, 1000);

    var reactHandler = this;
    reactHandler.GetCurrentUser();
    const url: any = new URL(window.location.href);
    const ItemID = url.searchParams.get("ItemID");
    const AppliedTage: string = url.searchParams.get("AppliedTag");
    const Dept: string = url.searchParams.get("Dept");
    const SitePageID = url.searchParams.get("SitePageID");
    reactHandler.setState({ Tag: "" + AppliedTage + "", Department: "" + Dept + "", SitePageID: SitePageID, ActiveMainNewsID: ItemID });
    reactHandler.GetNews(ItemID);
    reactHandler.GetTagBasedNews(AppliedTage, Dept, ItemID);

  }
  public pagereload() {
    // // const nextURL = '' + this.props.siteurl + '/SitePages/News-Read-More.aspx?ItemID=' + ID + '&mode=reload';
    // // const nextTitle = 'News-Read-More';
    // // const nextState = { additionalInformation: 'Updated the URL with JS' };
    // window.history.replaceState(nextState, nextTitle, nextURL);
  }
  public async GetCurrentUser() {

    User = this.props.userid;
    UserEmail = this.props.useremail;
  }
  public AddViews() {
    // const url: any = new URL(window.location.href);
    // const mode = url.searchParams.get("mode");
    var handler = this;
    // if (mode == "reload") {

    // } else {
    // handler.pagereload();
    //  var CurrentDate = moment().format("DD/MM/YYYY");
    const item = NewWeb.lists.getByTitle("ViewsCountMaster").items.add({
      EmployeeNameId: User,
      ViewedOn: CurrentDate,
      EmployeeEmail: UserEmail,
      ContentPage: "News",
      Title: title,
      ContentID: ID,
    })
    handler.viewsCount();
    // }
  }
  public viewsCount() {
    NewWeb.lists.getByTitle("ViewsCountMaster").items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending      
      if (items.length != 0) {
        views = items.length;
      } else {
        views = 0;
      }
      this.pageviewscount(items.length);
    });
  }

  //news code<
  private async GetNews(ItemID) {
    var reactHandler = this;
    await NewWeb.lists.getByTitle("News").items.select("ID", "Title", "EnableComments", "EnableLikes", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id", "TransactionItemID/Id").filter(`ID eq ${ItemID}`).orderBy("Created", false).expand("SitePageID", "TransactionItemID", "Dept").get().then((items) => {
      title = items[0].Title;
      ID = items[0].ID
      reactHandler.setState({
        Items: items
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
        $(".all-commets").remove();
        $("#commentedpost").remove();
      }
      reactHandler.AddViews();
      reactHandler.checkUserAlreadyLiked();
      reactHandler.checkUserAlreadyCommented();
      reactHandler.viewsCount();
      reactHandler.likesCount();
      reactHandler.commentsCount();
      var SiteUrl = items[0].DetailsPageUrl;
      var temp = SiteUrl.split("/").pop();
      // var TransID = items[0].TransactionItemID.Id;
      //reactHandler.GetNewsViewCount(temp, TransID);
    });
  }

  public async GetTagBasedNews(AppliedTage, Dept, ItemID) {
    var reactHandler = this;
    await NewWeb.lists.getByTitle('News').items.select("ID", "Title", "Description", "Created", "Dept/Title", "Image", "Tag", "DetailsPageUrl", "SitePageID/Id").filter(`Tag eq '${AppliedTage}' and IsActive eq 1 and Id ne ${ItemID} `).orderBy("Created", false).expand("SitePageID", "Dept").getAll().then((items) => {

      reactHandler.setState({
        TagBasedMoreNews: items
      });
      if (items.length == 0) {
        $('.view-all-news-l-col').addClass('col-md-12').removeClass('col-md-8');
        $(".sub-news-section").hide();
      } else {
        $('.view-all-news-l-col').addClass('col-md-8').removeClass('col-md-12');
        $(".sub-news-section").show();
      }

    });

  }


  public GetNewsViewCount(Page, TransID) { // Page ==> PageName.aspx
    var reactHandler = this;
    let siteID = reactHandler.props.siteID;
    let ViewCount;
    // })


    $.ajax({
      url: `${this.props.siteurl}/_api/search/query?querytext='${Page}'&selectproperties='ViewsLifetime'`,
      type: "GET",
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: function (resultData) {
        let ResultsArr = resultData.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results[0].Cells.results;
        for (var i = 0; i < ResultsArr.length; i++) {
          if (ResultsArr[i].Key == "ViewsLifeTime") {
            if (ResultsArr[i].Value == null || ResultsArr[i].Value == "null") {
              ViewCount = 0;
            } else {
              ViewCount = ResultsArr[i].Value;
            }

            reactHandler.setState({ NewsViewCount: ViewCount });
            reactHandler.AddViewcounttoList(ViewCount, TransID);
          }
        }
        $(".no-of-views").text(reactHandler.state.NewsViewCount + " Views ");
      },
      error: function (jqXHR, textStatus, errorThrown) {
      }
    });
  }

  public async AddViewcounttoList(ViewCount, TransID) {
    let list = await NewWeb.lists.getByTitle("TransactionViewsCount");
    const i = await list.items.getById(TransID).update({
      ViewCountofNews: ViewCount
    });
  }
  // news code >

  public checkUserAlreadyLiked() {
    NewWeb.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'News' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        $(".like-selected").show();
        $(".like-default").hide();
        this.setState({
          IsUserAlreadyLiked: true
        });

      }
    });
  }
  public checkUserAlreadyCommented() {
    NewWeb.lists.getByTitle("CommentsCountMaster").items.filter(`ContentPage eq 'News' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        this.setState({
          IsUserAlreadyCommented: true
        });
        $(".reply-tothe-post").hide();
      }
    });
  }
  public likesCount() {
    NewWeb.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      if (items.length != 0) {
        likes = items.length;
      } else {
        likes = 0;
      }
    });

  }
  public commentsCount() {
    NewWeb.lists.getByTitle("CommentsCountMaster").items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
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
    NewWeb.lists.getByTitle("CommentsCountMaster").items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
      this.setState({
        commentitems: items,
      });
    });
  }
  public async liked(mode) {
    var handler = this;
    if (mode == "like") {

      NewWeb.lists.getByTitle("LikesCountMaster").items.add({
        EmployeeNameId: User,
        LikedOn: CurrentDate,
        EmployeeEmail: UserEmail,
        ContentPage: "News",
        Title: title,
        ContentID: ID,
      }).then(() => {
        $(".like-default").hide()
        $(".like-selected").show();
        NewWeb.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
          var like = items.length;
          var newspan = like.toString()
          document.getElementById("likescount").textContent = newspan;
        });
      })
    } else {
      $(".like-selected").hide();
      $(".like-default").show();
      NewWeb.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'News' and ContentID eq ${ID} and EmployeeName/Id eq ${User}`).get().then((data) => {
        NewWeb.lists.getByTitle("LikesCountMaster").items.getById(data[0].Id).delete().then(() => {

          NewWeb.lists.getByTitle("LikesCountMaster").items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending          
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
    NewWeb.lists.getByTitle("CommentsCountMaster").items.select("Title", "EmployeeName/Title", "CommentedOn", "EmployeeEmail", "ContentPage", "ContentID", "UserComments").expand("EmployeeName").filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => { // //orderby is false -> decending           

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
      const item = NewWeb.lists.getByTitle("CommentsCountMaster").items.add({
        EmployeeNameId: User,
        CommentedOn: CurrentDate,
        EmployeeEmail: UserEmail,
        ContentPage: "News",
        Title: title,
        ContentID: ID,
        UserComments: comments
      }).then(() => {
        $("#commentedpost").hide();
        $(".reply-tothe-post").hide();
        NewWeb.lists.getByTitle("CommentsCountMaster").items.filter(`ContentPage eq 'News' and ContentID eq ${ID}`).top(5000).get().then((items) => {

          commentscount = items.length;
          var newspan = commentscount.toString()
          document.getElementById("commentscount").textContent = newspan;
        })
      })

    }
  }
  public async pageviewscount(views) {

    await NewWeb.lists.getByTitle("News").items.getById(ID).update({
      'PageViewCount': views
    })
  }
  public render(): React.ReactElement<INewsReadMoreProps> {
    var reactHandler = this;
    var Dt = "";

    const NewsDetails: JSX.Element[] = this.state.Items.map(function (item, key) {
      let RawImageTxt = item.Image;
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
        var tdaydt = moment().format("DD/MM/YYYY");
        if (RawPublishedDt == tdaydt) {
          Dt = "Today";
        } else {
          Dt = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
        }
        return (
          <div className='view-all-news-recent-left'>
            <a href='#' className='nw-list-main' data-interception="off"> {item.Title} </a>
            <div className='ns-tag-duration clearfix'>
              <div className='pull-left'>
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className='tags'> {item.Tag} </a>
              </div>
              <div className='pull-right'>
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt='image' />  {Dt}
              </div>
            </div>
            <div className='view-all-news-recent-img-cont'>
              <img className='placeholder-main-banner-image' src={`${ImgObj.serverRelativeUrl}`} alt='image' />
            </div>
            <div className='ns-tag-duration clearfix'>
              <div className='pull-left det-pg-post-dura'>
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt='image' /> {Dt} <p className='no-of-views'>  </p>
              </div>
            </div>
            <div className='mews-details-para'>
              <p> <Markup content={item.Description} /> </p>
            </div>
          </div>
        );
      } else {
        return (
          <div className='view-all-news-recent-left'>
            <a href='#' className='nw-list-main' data-interception="off"> {item.Title} </a>
            <div className='ns-tag-duration clearfix'>
              <div className='pull-left'>
                <a href={`${reactHandler.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${item.Tag}`} data-interception='off' className='tags'> {item.Tag} </a>
              </div>
              <div className='pull-right'>
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt='image' />  {Dt}
              </div>
            </div>
            <div className='view-all-news-recent-img-cont'>
              <img className='placeholder-main-banner-image' src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt='image' />
            </div>
            <div className='ns-tag-duration clearfix'>
              <div className='pull-left det-pg-post-dura'>
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/clock.svg`} alt='image' /> {Dt} <p className='no-of-views'> 0 Views </p>
              </div>
            </div>
            <div className='mews-details-para'>
              <p> <Markup content={item.Description} /> </p>
            </div>
          </div>
        );
      }
    });

    const MoreNewsBasedonTag: JSX.Element[] = this.state.TagBasedMoreNews.map(function (item, key) {
      let RawImageTxt = item.Image;
      if (RawImageTxt != "" && RawImageTxt != null) {
        var ImgObj = JSON.parse(RawImageTxt);
        var RawPublishedDt = moment(item.Created).format("DD/MM/YYYY");
        var tdaydt = moment().format("DD/MM/YYYY");
        if (RawPublishedDt == tdaydt) {
          Dt = "Today";
        } else {
          Dt = "" + moment(RawPublishedDt, "DD/MM/YYYY").format("MMM Do, YYYY") + "";
        }
        if (item.Dept != undefined) {
          var depttitle = item.Dept.Title
        }
        if (item.SitePageID != undefined) {
          var sitepageid = item.SitePageID.Id
        }

        return (
          <li className="clearfix">
            <div className="list-li-recent-news-img">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="list-li-recent-news-desc">
              <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main"> {item.Title} </a>
              <div className="ns-tag-duration ">
                <p> {Dt} </p>
              </div>
            </div>
          </li>
        );
      } else {
        return (
          <li className="clearfix">
            <div className="list-li-recent-news-img">
              <img src={`${reactHandler.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/home_news_noimage.png`} alt="image" />
            </div>
            <div className="list-li-recent-news-desc">
              <a href={`${item.DetailsPageUrl}?ItemID=${item.ID}&AppliedTag=${item.Tag}&Dept=${depttitle}&SitePageID=${sitepageid}&env=WebView`} data-interception="off" className="nw-list-main"> {item.Title} </a>
              <div className="ns-tag-duration ">
                <p> {Dt} </p>
              </div>
            </div>
          </li>
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
              <img src={`${reactHandler.props.siteurl}/SiteAssets/test/img/userphoto.jpg`} alt="image" />
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
      <div className="newsReadMore" id="newsRm" style={{ display: "none" }}>
        {/* <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div> */}
        <section>
          <div className='container relative'>
            <div className='section-rigth'>
              <div className='inner-banner-header relative m-b-20'>
                <div className='inner-banner-overlay'></div>
                <div className='inner-banner-contents'>
                  <h1> News </h1>
                  <ul className='breadcums'>
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href={`${this.props.siteurl}/SitePages/NewsViewMore.aspx?env=WebView`} data-interception="off"> All News </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off">News Read More </a> </li>
                  </ul>
                </div>
              </div>
              <div className='inner-page-contents '>
                <div className='sec m-b-20'>
                  <div className='row news-details-page'>
                    <div className='col-md-8 view-all-news-l-col'>

                      {NewsDetails}
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

                    <div className='col-md-4 sub-news-section'>
                      <div className='heading clearfix'>
                        <a href={`${this.props.siteurl}/SitePages/News-CategoryBased.aspx?Mode=TagBased&Tag=${this.state.Tag}`} data-interception='off' >
                          More news on {this.state.Tag}
                        </a>
                      </div>
                      <div className="section-part clearfix">
                        <div className="list-news-latests">
                          <ul>
                            {MoreNewsBasedonTag}
                          </ul>
                        </div>
                      </div>
                      <div>

                      </div>
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

