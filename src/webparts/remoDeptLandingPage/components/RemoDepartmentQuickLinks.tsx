import * as React from 'react';
import styles from './RemoDeptLandingPage.module.scss';
import { IRemoDeptLandingPageProps } from './IRemoDeptLandingPageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import * as $ from 'jquery';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { Web } from "@pnp/sp/webs";

export interface IDepartmentQuickLinkState{  
  QuickLinkData:any[];
}
var NewWeb
export default class DepartmentQuickLink extends React.Component<IRemoDeptLandingPageProps,IDepartmentQuickLinkState, {}> {
  public constructor(props: IRemoDeptLandingPageProps, state: IDepartmentQuickLinkState){
    super(props);
    this.state = {    
    QuickLinkData:[]
    };
    NewWeb =Web(""+this.props.siteurl+"")
    }

    public componentDidMount(){
         var reacthandler = this;
      reacthandler.getcurrentusersQuickLinks();
      }
  
      public getcurrentusersQuickLinks(){
      var reactHandler = this;  
      NewWeb.lists.getByTitle("Quick Links").items.select("ID","Title","URL","HoverOffIcon","HoverOnIcon","OpenInNewTab").filter(`IsActive eq 1`).top(5).orderBy("Order0", true).get().then((items)=>{    
        reactHandler.setState({
        QuickLinkData: items
        });
        if(items.length == 0){
          $(".if-no-qlinks-present").show();
          $(".if-qlinks-present").hide();
        }else{
          $(".if-no-qlinks-present").hide();
          $(".if-qlinks-present").show();
        }      
      });
      }
  public render(): React.ReactElement<IRemoDeptLandingPageProps> {
    var reactHandler = this;
    const DeptQuickLinks: JSX.Element[] = this.state.QuickLinkData.map(function(item,key) {
      let RawImageTxt = item.HoverOffIcon;
      let RawImageTxt2 = item.HoverOnIcon;
      if(RawImageTxt != "" && RawImageTxt != null && RawImageTxt2 != "" && RawImageTxt2 != null){      
        var ImgObj = JSON.parse(RawImageTxt);
        var ImgObj2 = JSON.parse(RawImageTxt2);
        return (          
          <li>
            <a href={`${item.URL.Url}`} target="_blank" data-interception="off" className="clearfix"> 
                <img src={`${ImgObj.serverRelativeUrl}`} alt="image" className="quick-def"/> 
                <img src={`${ImgObj2.serverRelativeUrl}`} alt="image" className="quick-hov"/> 
                <p> {item.Title} </p>
            </a>    
          </li>
        );
      }
    });
    return (
     
           <div className="relative">    
          <div className="section-rigth">
            <div className="quicklinks-wrap personal-qlinks-wrap m-b-20">
              <div className="sec">
                <div className="heading">
                  Quick Links
                </div>
                <div className="section-part clearfix if-qlinks-present">
                  <ul>
                    {DeptQuickLinks}
                  </ul>
                </div>    

                <div className="section-part clearfix if-no-qlinks-present" style={{display:"none"}}>
                  <img src={`${this.props.siteurl}/SiteAssets/img/Error%20Handling%20Images/ContentEmpty.png`} alt="no-content"></img>
                </div>

              </div> 
            </div>
          </div>
        </div>
     
    );
  }
}
