import * as React from 'react';
import styles from './RemoDeptLandingPage.module.scss';
import { IRemoDeptLandingPageProps } from './IRemoDeptLandingPageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import * as moment from 'moment';
import * as $ from 'jquery';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { Web } from "@pnp/sp/webs";
import { Markup } from 'interweave';
 
export interface IAboutDepartmentState{
  Items:any[];
}
var NewWeb
export default class AboutDepartment extends React.Component<IRemoDeptLandingPageProps, IAboutDepartmentState,{}> {
  public constructor(props: IRemoDeptLandingPageProps, state: IAboutDepartmentState){
    super(props);
    this.state = {
      Items: []
    };
    NewWeb =Web(""+this.props.siteurl+"")
  }

    public componentDidMount(){  
    this.GetDepartmentAbout();
   
    }

    private GetDepartmentAbout() {
      var reactHandler = this;
      NewWeb.lists.getByTitle("AboutDepartment").items.select("ID","Title","Description","DepartmentBannerImage").filter(`IsActive eq 1`).orderBy("Created", false).top(1).get().then((items)=>{    
          if(items.length == 0){
            $("#if-about-present").hide();
            $("#if-no-about-present").show();            
          }else{
            $("#if-about-present").show();
            $("#if-no-about-present").hide();
            reactHandler.setState({
              Items: items
            });
          }         
      });    
    }
  public render(): React.ReactElement<IRemoDeptLandingPageProps> {
    var reactHandler = this;
    var Title
    const AboutDept: JSX.Element[] = this.state.Items.map(function(item,key) {
      let RawImageTxt = item.DepartmentBannerImage;
      Title = item.Title
      if(RawImageTxt != "" && RawImageTxt != null){      
        var ImgObj = JSON.parse(RawImageTxt);
        return (          
          <div className="col-md-12 m-b-0 clearfix">                       
            <div className="department-detailsi-img">
              <img src={`${ImgObj.serverRelativeUrl}`} alt="image" />
            </div>
            <div className="department-detailsi-conts">
              <h2>  {item.Title} </h2> 
              <p> <Markup content={item.Description} /> </p>
            </div>
          </div>
        );
      }
    });
    return (        
        <div className="relative">    
          <div className="section-rigth section_hr">
            <div className="inner-banner-header relative m-b-20">
              <div className="inner-banner-overlay"></div>
              <div className="inner-banner-contents">
                <h1> Department </h1>
                <ul className="breadcums"> 
                    <li>  <a href={`${this.props.siteurl}/sitepages/HomePage.aspx`} data-interception="off" > Home </a> </li>
                    <li>  <a href="#" style={{pointerEvents:"none"}} data-interception="off"> {Title} </a> </li>
                </ul>
              </div>
            </div>
            <div className="inner-page-contents">
              <div className="sec"> 
                <div className="row" style={{display:"none"}} id="if-about-present">
                  {AboutDept}
                </div>

                <div className="row" style={{display:"none"}} id="if-no-about-present">
                  <div className="col-md-12 m-b-0 clearfix">
                    <img src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-content"></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  }
}
