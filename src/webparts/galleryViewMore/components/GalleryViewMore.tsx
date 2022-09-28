import * as React from 'react';
import styles from './GalleryViewMore.module.scss';
import { IGalleryViewMoreProps } from './IGalleryViewMoreProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import * as $ from 'jquery';
import { Item, Items } from '@pnp/sp/items';
import { SPComponentLoader } from '@microsoft/sp-loader';
import Slider from "react-slick";
import { Web } from "@pnp/sp/webs";
import GlobalSideNav from "../../../extensions/globalCustomFeatures/GlobalSideNav";
import RemoResponsive from '../../../extensions/globalCustomFeatures/RemoResponsive';
import { sp } from "@pnp/sp/presets/all";



export interface IGalleryVmState {
  Galleryitems: any[];
  VideoItemsss: any[];
  FolderItems: any[];
  nav1;
  nav2;
  FolderURL: string;
  Mode: string;
  Images: any[];
  Videos: any[];
  SliderIsOpen: boolean;
}

var FolderNames = [];
var FolderNamesExits = [];

var FolderNamesVideo = [];
var FolderNamesExitsVideo = [];


let ImgArr = [];
export default class GalleryVm extends React.Component<IGalleryViewMoreProps, IGalleryVmState, {}> {
  slider2: any;
  slider1: any;
  public lightGallery: any;
  private displayDataImages;
  private displayDataVideos;
  public constructor(props: IGalleryViewMoreProps, state: IGalleryVmState) {

    super(props);
    this.displayDataImages = [];
    this.displayDataImages = [];
    this.appendDataImages = this.appendDataImages.bind(this);
    this.appendDataVideos = this.appendDataVideos.bind(this);
    sp.setup({
      ie11: false,
      sp: {
        headers: {
          Accept: "application/json; odata=verbose",
          "Content-Type": "application/json;odata=verbose",
        }
      },
      spfxContext: this.props.context
    });

    this.state = {
      Galleryitems: [],
      VideoItemsss: [],
      FolderItems: [],
      nav1: null,
      nav2: null,
      FolderURL: "",
      Mode: "",
      Images: [],
      Videos: [],
      SliderIsOpen: false
    };
  }

  public componentDidMount() {

    setTimeout(function () {
      $('#spCommandBar').attr('style', 'display: none !important');
      $('#CommentsWrapper').attr('style', 'display: none !important');
      $('div[data-automation-id="pageHeader"]').attr('style', 'display: none !important');
    }, 2000);

    this.GetGalleryFilesFolder();
    this.GetGalleryFilesFolderVideos();

    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  public GetGalleryFilesFolder() {
    ImgArr = [];
    var reactHandler = this;
    sp.web.lists.getByTitle('Picture Gallery').items
      .select("ID", "Title", "FileRef", "FileSystemObjectType", "FileLeafRef", "Folder/ServerRelativeUrl", "Folder/Name")
      .expand("Folder", "File").orderBy("Created", false).top(1000)
      .get().then((items) => {

        if (items.length != 0) {
          // reactHandler.setState({
          //   Galleryitems: items,
          // });
          ImgArr.push(items);
          for (var i = 0; i < items.length; i++) {

            if (items[i].FileSystemObjectType == 1) {

            }
            if (items[i].FileSystemObjectType != 1) {

              var filename = items[i].File.Name;
              var filename = items[i].FileLeafRef;
              var completeurl = items[i].FileRef;
              var Len = filename.length;
              var Dot = filename.lastIndexOf(".");
              var type = Len - Dot;
              var res = filename.substring(Dot + 1, Len);
              var ext = res.toLowerCase();

              var string = completeurl.split('/');
              var str2 = "Videos";
              if (string.indexOf(str2) == -1) {
                if (ext != "mp4" && ext != "mov" && ext != "wmv" && ext != "flv" && ext != "mov" && ext != "avi" && ext != "avchd" && ext != "webm" && ext != "mkv") {
                  var foldernameval = string[string.length - 2];
                  var gFolderUrl = (completeurl).replace(filename, '');

                  FolderNames.push(foldernameval);
                  if (reactHandler.findValueInArray(foldernameval, FolderNamesExits)) {

                  }
                  else {
                    if (reactHandler.findValueInArray(foldernameval, FolderNames)) {

                      FolderNamesExits.push(foldernameval);
                    }
                    var fileref = items[i].FileRef
                    var fileleafref = items[i].FileLeafRef

                    reactHandler.appendDataImages(fileref, fileleafref, foldernameval, gFolderUrl)

                  }
                }
              }

            }
          }
        } else {
          $("#if-gallery-present").hide();
          $("#if-no-gallery-present").show();
        }
      });

  }
  public GetGalleryFilesFolderVideos() {
    ImgArr = [];
    var reactHandler = this;
    sp.web.lists.getByTitle('Picture Gallery').items
      .select("ID", "Title", "FileRef", "FileSystemObjectType", "FileLeafRef", "Folder/ServerRelativeUrl", "Folder/Name")
      .expand("Folder", "File").orderBy("Created", false).top(1000)
      .get().then((items) => {

        if (items.length != 0) {
          // reactHandler.setState({
          //   VideoItemsss: items
          // });
          ImgArr.push(items);
          for (var i = 0; i < items.length; i++) {

            if (items[i].FileSystemObjectType == 1) {

            }
            if (items[i].FileSystemObjectType != 1) {

              var filename = items[i].File.Name;
              var filename = items[i].FileLeafRef;
              var completeurl = items[i].FileRef;
              var Len = filename.length;
              var Dot = filename.lastIndexOf(".");
              var type = Len - Dot;
              var res = filename.substring(Dot + 1, Len);
              var ext = res.toLowerCase();

              var string = completeurl.split('/');
              var str2 = "Videos";
              if (string.indexOf(str2) != -1) {
                var foldernamevalVideo = string[string.length - 3];

                var gFolderUrl = (completeurl).replace(filename, '');

                if (reactHandler.findValueInArray(foldernamevalVideo, FolderNamesExits)) {

                  $("#vid").remove();
                }
                else {

                  if (ext == "mp4" || ext == "mov" || ext == "wmv" || ext == "flv" || ext == "mov" || ext == "avi" || ext == "avchd" || ext == "webm" || ext == "mkv") {

                    FolderNamesExits.push(foldernamevalVideo);
                    reactHandler.appendDataVideos(items[i].FileRef, foldernamevalVideo, gFolderUrl)


                  }
                }
              }
            }
          }
        } else {
          $("#if-gallery-present").hide();
          $("#if-no-gallery-present").show();
        }
      });

  }
  public appendDataImages(fileref, fileleafref, foldernameval, gFolderUrl) {
    var reactHandler = this
    reactHandler.displayDataImages.push(
      <li onClick={() => reactHandler.GetImagesInsideFolder(gFolderUrl, "Image")} >
        <a href="#" data-interception="off">
          <div className='gallery-vm'>
            <img src={`${fileref}`} alt={fileleafref} data-interception="off" />
          </div>
          <p>{foldernameval} </p>
        </a>
      </li>
    );
    reactHandler.setState({
      Images: reactHandler.displayDataImages
    })
  }
  public appendDataVideos(fileref, foldernamevalVideo, gFolderUrl) {
    var reactHandler = this
    reactHandler.displayDataVideos.push(
      <li onClick={() => reactHandler.GetImagesInsideFolder(gFolderUrl, "Video")}>
        <a href="#">
          <div className='gallery-vm'>
            <video className="lg-video-object lg-html5" controls >
              <source src={`${fileref}`} type="video/mp4" data-interception="off" />

            </video>
          </div>
          <p>{foldernamevalVideo} </p>
        </a>
      </li>
    );

    reactHandler.setState({
      Videos: reactHandler.displayDataVideos
    })
  }
  public findValueInArray(value, arr) {
    var result = false;

    for (var i = 0; i < arr.length; i++) {
      var name = arr[i];
      if (name == value) {
        result = true;
        break;
      }
    }
    return result;
  }

  public findValueInArrayVideos(value, arr) {
    var result1 = false;

    for (var j = 0; j < arr.length; j++) {
      var name = arr[j];


      if (name == value) {
        result1 = true;
        break;
      }
    }
    return result1;
  }

  public GetImagesInsideFolder(FolderURL, Mode) {

    var result;
    var siteurl: string;
    this.setState({ FolderURL: FolderURL, SliderIsOpen: true });

    var reactHandler = this;
    reactHandler.setState({ Mode: Mode });
    if (Mode == "Image") {
      $("#trigger-image").hide();
      $("#trigger-video").show();

      result = sp.web.getFolderByServerRelativeUrl(FolderURL).select("ID", "Title", "FileRef", "FileSystemObjectType", "FileLeafRef", "File/ServerRelativeUrl", "File/Name").expand("Folders", "Files").files

    } else if (Mode == "Video") {
      $("#trigger-video").hide();
      $("#trigger-image").show();
      var string = FolderURL.split('/');
      var str2 = "Videos";
      if (string.indexOf(str2) != -1) {

        $("#trigger-image").hide();

        result = sp.web.getFolderByServerRelativeUrl(FolderURL).select("ID", "Title", "FileRef", "FileSystemObjectType", "FileLeafRef", "File/ServerRelativeUrl", "File/Name").expand("Folders", "Files").files

      }
      else {
        result = sp.web.getFolderByServerRelativeUrl(`${FolderURL}Videos`).select("ID", "Title", "FileRef", "FileSystemObjectType", "FileLeafRef", "File/ServerRelativeUrl", "File/Name").expand("Folders", "Files").files

      }
    }

    this.ShowHideVideos(FolderURL, Mode);

    result.get().then(async (items) => {

      reactHandler.setState({
        FolderItems: items

      });
      $(".lightbox").addClass("open");
    })


  }
  public ShowHideVideos(FolderURL, Mode) {

    var Videourl: string;
    this.setState({ FolderURL: FolderURL });
    $(".lightbox").addClass("open");
    var reactHandler = this;
    reactHandler.setState({ Mode: Mode });
    var FolderPath = FolderURL.replace(/[']/g, '');
    var FolderServerRelativeUrl = "" + FolderPath + "/Videos";
    try {
      sp.web.getFolderByServerRelativeUrl(FolderServerRelativeUrl).files.get().then((items) => {

        if (items.length == 0) {
          $("#trigger-video").hide();
        }
      })
    } catch (err) {
      $("#trigger-video").hide();
      console.log(err);
    }
  }
  public CloseLightBox() {

    $(".lightbox").removeClass("open");
    this.setState({ SliderIsOpen: false, FolderItems: [] })

  }

  public render(): React.ReactElement<IGalleryViewMoreProps> {
    const settings = {
      dots: false,
      arrows: true,
      infinite: false,
      speed: 500,
      autoplay: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            dots: false,
            arrows: true,
            autoplay: false,
            centerMode: false,
          }
        }
      ]
    };

    var reactHandler = this;
    var x = 1;
    let y = 1;



    const MAslider2: JSX.Element[] = this.state.FolderItems.map(function (item, key) {

      var Mode = reactHandler.state.Mode
      if (Mode == "Image") {
        var filename = item.Name;
        var completeurl = item.ServerRelativeUrl;
        var Len = filename.length;
        var Dot = filename.lastIndexOf(".");
        var type = Len - Dot;
        var res = filename.substring(Dot + 1, Len);
        var ext = res.toLowerCase();
        if (ext != "mp4" && ext != "mov" && ext != "wmv" && ext != "flv" && ext != "mov" && ext != "avi" && ext != "avchd" && ext != "webm" && ext != "mkv") {


          return (
            <li> <a href="#" data-interception="off"> <img src={`${item.ServerRelativeUrl}`} alt="image" /> </a> </li>
          );
        }
      } else if (Mode == "Video") {
        return (
          <li><a href="#" data-interception="off">
            <video className="lg-video-object lg-html5" src={`${item.ServerRelativeUrl}`}>
              {/* <source src={`${item.ServerRelativeUrl}`} type="video/mp4" /> */}
            </video>
          </a></li>
        );
      }
    });

    return (
      <div className={styles.galleryVm} id="galleryVm">
        <div id="Global-Top-Header-Navigation">
          <GlobalSideNav siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
        </div>
        <section>
          <div className="container relative">
            <div className="section-rigth">
              <div className="inner-banner-header relative m-b-20">
                <div className="inner-banner-overlay"></div>
                <div className="inner-banner-contents">
                  <h1> Gallery </h1>
                  <ul className="breadcums">
                    <li>  <a href={`${this.props.siteurl}/SitePages/HomePage.aspx`} data-interception="off"> Home </a> </li>
                    <li>  <a href="#" style={{ pointerEvents: "none" }} data-interception="off"> Gallery Folders </a> </li>
                  </ul>
                </div>
              </div>
              <div className="inner-page-contents gallery-viewall-folders" >
                <div className="top-news-sections category-news-sec m-b-20">
                  <div className="sec">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="section-part clearfix">
                          <ul className="clearfix img-block-area">

                            <div id="img">
                              {this.state.Images}
                            </div>
                            <div id="vid">
                              {this.state.Videos}
                            </div>

                          </ul>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        <div className="lightbox">
          <div className="gallery-lightbox-contents">
            <div className="lightbox-contents-img">
              <div className="lightbox-contents-header clearfix">

                <ul>
                  <li id="trigger-image" className={this.state.Mode == "Image" ? "imageblock" : ""} > <a href="#" onClick={() => reactHandler.GetImagesInsideFolder(this.state.FolderURL, "Image")} data-interception="off"> Images  </a> </li>
                  <li id="trigger-video" className={this.state.Mode == "Video" ? "videoblock" : ""} > <a href="#" onClick={() => reactHandler.GetImagesInsideFolder(this.state.FolderURL, "Video")} data-interception="off"> Videos  </a> </li>
                  <li> <a href={this.props.siteurl + "/SitePages/Gallery-Grid-View.aspx?FolderName='" + this.state.FolderURL + "'&Type=Img"} data-interception="off"> Grid View  </a> </li>
                </ul>
              </div>
              <div className="lightbox-contents-body">
                {this.state.SliderIsOpen == true &&
                  <Slider {...settings}
                    asNavFor={this.state.nav2}
                    ref={slider => (this.slider1 = slider)}
                  >
                    {this.state.FolderItems && this.state.FolderItems.map(function (item, key) {
                      if (reactHandler.state.Mode == "Image") {
                        var filename = item.Name;
                        var completeurl = item.ServerRelativeUrl;
                        console.log(item.ServerRelativeUrl)
                        var Len = filename.length;
                        var Dot = filename.lastIndexOf(".");
                        var type = Len - Dot;
                        var res = filename.substring(Dot + 1, Len);
                        var ext = res.toLowerCase();
                        if (ext != "mp4" && ext != "mov" && ext != "wmv" && ext != "flv" && ext != "mov" && ext != "avi" && ext != "avchd" && ext != "webm" && ext != "mkv") {


                          return (
                            <>
                              <img src={`${item.ServerRelativeUrl}`} style={{ width: '900px' }} alt="image" />
                              <h4 style={{ color: '#ffffff' }}>{item.Name}</h4>
                            </>
                          );
                        }
                      } else if (reactHandler.state.Mode == "Video") {

                        return (
                          <>
                            <video className="lg-video-object lg-html5" src={`${item.ServerRelativeUrl}`} style={{ width: '810px' }} controls >
                              {/* <source src={`${item.ServerRelativeUrl}`} type="video/mp4" /> */}
                            </video>
                            <h4 style={{ color: '#ffffff' }}>{item.Name}</h4>
                          </>
                        );
                      }
                    })}
                  </Slider>
                }
              </div>
              <div className="lightbox-conent-thumbnails">
                <ul className="clearfix">
                  {this.state.SliderIsOpen == true &&
                    <Slider
                      asNavFor={this.state.nav1}
                      ref={slider => (this.slider2 = slider)}
                      slidesToShow={4}
                      swipeToSlide={true}
                      focusOnSelect={true}
                      infinite={false}
                      autoplay={false}
                      arrows={false}
                      centerMode={false}
                      responsive={[
                        {
                          breakpoint: 1000,
                          settings: {
                            slidesToShow: 4,
                            swipeToSlide: true,
                            focusOnSelect: true,
                            infinite: false,
                            autoplay: false,
                            arrows: false,
                            centerMode: false
                          }
                        }
                      ]
                      }
                    >
                      {MAslider2}
                    </Slider>
                  }
                </ul>
              </div>
              <div className="lightbox-close">
                <img src={`${reactHandler.props.siteurl}/SiteAssets/img/close.svg`} alt="close" onClick={() => this.CloseLightBox()} />

              </div>
            </div>
          </div>
        </div>
        <RemoResponsive siteurl={this.props.siteurl} context={this.props.context} currentWebUrl={''} CurrentPageserverRequestPath={''} />
      </div>
    );
  }
}
