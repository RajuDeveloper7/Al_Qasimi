import * as React from 'react';
import styles from './RemoHomePage.module.scss';
import { IRemoHomePageProps } from './IRemoHomePageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import * as $ from 'jquery';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { sp } from '@pnp/sp';

export interface IQuickLinkState {
  MyQuickLinksPrefference: any[];
}

let Myqlink = [];
export default class RemoQuickLinks extends React.Component<IRemoHomePageProps, IQuickLinkState, {}> {
  public constructor(props: IRemoHomePageProps, state: IQuickLinkState) {
    super(props);
    this.state = {
      MyQuickLinksPrefference: [],
    };
  }

  public componentDidMount() {
    var reacthandler = this;
    reacthandler.getcurrentusersQuickLinks();

  }

  public async getcurrentusersQuickLinks() {
    var reactHandler = this;
    let UserID = reactHandler.props.userid;
    await sp.web.lists.getByTitle("UsersQuickLinks").items.select("ID", "SelectedQuickLinks/Title", "URL", "ImageSrc", "HoverImageSrc", "Order0", "SelectedQuickLinks/Id", "Author/Id").filter(`Author/Id eq '${UserID}'`).expand("SelectedQuickLinks", "Author").top(5).orderBy("Order0", true).get().then((items) => { // //orderby is false -> decending          
      reactHandler.setState({
        MyQuickLinksPrefference: items
      });
    });
  }

  public render(): React.ReactElement<IRemoHomePageProps> {
    var reactHandler = this;
    const QuickLinks: JSX.Element[] = this.state.MyQuickLinksPrefference.map(function (item, key) {
      
        return (
          <li>
            <a href={item.URL} target="_blank"className="clearfix">
              <img src={item.ImageSrc} className="quick-def" />
              <img src={item.HoverImageSrc} className="quick-hov" />
              <p>{item.SelectedQuickLinks.Title}</p>
            </a>
          </li>

        )
      
    })
    return (
      <div className={[styles.myPersonalQuickLink, "m-b-20 if-no-qlinks"].join(' ')} id="m-b-20-PQlink">
        <div className="quicklinks-wrap personal-qlinks-wrap m-b-20">
          <div className="sec">
            <div className="heading clearfix">
              <div className="heading-left">
                Quick Links
              </div>
              <div className="heading-right">
                <a href={`${reactHandler.props.siteurl}/SitePages/Manage-Quick-Links.aspx?env=WebView`} data-interception="off"> Manage Quick Links</a>
              </div>

            </div>

            <div className="section-part clearfix">
              <ul id="result">
                {QuickLinks}
              </ul>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
