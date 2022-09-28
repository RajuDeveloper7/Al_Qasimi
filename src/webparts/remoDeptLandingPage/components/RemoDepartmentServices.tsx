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
import { PnPLogging } from '@pnp/logging';
import pnp from 'sp-pnp-js';
import { sp } from '@pnp/sp';

export interface IDepartmentServicesState {
  Items: any[];
  ServiceDescription: string;
}
var NewWeb
export default class DepartmentServices extends React.Component<IRemoDeptLandingPageProps, IDepartmentServicesState, {}> {
  public constructor(props: IRemoDeptLandingPageProps, state: IDepartmentServicesState) {
    super(props);
    this.state = {
      Items: [],
      ServiceDescription: ""
    };
    NewWeb = Web("" + this.props.siteurl + "")
  }

  public componentDidMount() {
    this.GetDepartmentServices();


  }

  private GetDepartmentServices() {
    var reactHandler = this;
    NewWeb.lists.getByTitle("Services").items.select("ID", "Title", "Description").filter(`IsActive eq 1`).orderBy("Order0", true).get().then((items) => {
      if (items.length == 0) {
        $("#if-service-present").hide();
        $("#if-no-service-present").show();
      } else {
        $("#if-service-present").show();
        $("#if-no-service-present").hide();
        reactHandler.setState({
          Items: items,
          ServiceDescription: items[0].Description
        });
      }
    });
  }

  public LoadServiceDescription(ItemID) {

    var reactHandler = this;
    NewWeb.lists.getByTitle("Services").items.select("ID", "Title", "Description").filter(`ID eq ${ItemID}`).get().then((items) => {
      reactHandler.setState({
        ServiceDescription: items[0].Description
      });
    });
  }

  public render(): React.ReactElement<IRemoDeptLandingPageProps> {
    $(document).ready(function () {
      $("#service-main li").on("click", function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");

      });
    })
    var reactHandler = this;
    const DeptServices: JSX.Element[] = this.state.Items.map(function (item, key) {
      if (key == 0) {
        return (
          <li className="active" onClick={() => reactHandler.LoadServiceDescription(item.ID)}> <a href="#" data-interception="off"> {item.Title} </a>  </li>
        );
      } else {
        return (
          <li onClick={() => reactHandler.LoadServiceDescription(item.ID)}> <a href="#" data-interception="off"> {item.Title} </a>  </li>
        );
      }
    });
    return (

      <div className="relative">
        <div className="section-rigth section_hr">
          <div className="depat-key-people m-b-20">
            <div className="sec">
              <div className="heading">
                Our Services
              </div>
              <div className="section-part clearfix" id="if-service-present">

                <div className="ourservices-left">
                  <ul id="service-main">
                    {DeptServices}
                  </ul>
                </div>
                <div className="ourservices-right">
                  <p> <Markup content={this.state.ServiceDescription} /> </p>
                </div>

              </div>
              <div className="row" style={{ display: "none" }} id="if-no-service-present">
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
