import { override } from '@microsoft/decorators';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import * as $ from 'jquery';
import { Dialog } from '@microsoft/sp-dialog';
import GlobalSideNav, { ISideNavProps } from "../globalCustomFeatures/GlobalSideNav";
import * as strings from 'GlobalCustomFeaturesApplicationCustomizerStrings';
import { escape, update } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/presets/all";

const LOG_SOURCE: string = 'GlobalCustomFeaturesApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */

export interface IGlobalCustomFeaturesApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top: string;
  //Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class GlobalCustomFeaturesApplicationCustomizer
  extends BaseApplicationCustomizer<IGlobalCustomFeaturesApplicationCustomizerProperties> {
  private _topPlaceholder: PlaceholderContent | undefined;
  @override
  public onInit(): Promise<void> {
    const ActivePageUrl = (window.location.href.split('?') ? window.location.href.split('?')[0] : window.location.href).toLowerCase();
    const siteurl = this.context.pageContext.site.absoluteUrl;

    // if (ActivePageUrl == `${siteurl}/sitepages/homepage.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/unifiedsearch.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/hero-banner-readmore.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/hero-banner-vmore.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/ceo-read-more.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/workspace-home.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/workspace-inner.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/content-editor.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/jobs-master.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/jobs-read-more.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/birthday.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/newsviewmore.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/eventsviewmore.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/announcement-view-more.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/announcement-read-more.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/manage-quick-links.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/gallery-view-more.aspx` ||
    //     ActivePageUrl == `${siteurl}/sitepages/gallery-grid-view.aspx`

    //   ) {

    $('html').css("visibility", "hidden");
    sessionStorage.setItem("spfx-debug", "");
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve<void>();
    //  }

  }



  private _renderPlaceHolders(): void {
    //this.GetFooterLinks();

    // Handling the top placeholder  
    if (!this._topPlaceholder) {
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );
      // The extension should not assume that the expected placeholder is available.  
      if (!this._topPlaceholder) {
        console.error("The expected placeholder (Top) was not found.");
        return;
      }
      if (this.properties) {
        let topString: string = this.properties.Top;
        if (!topString) {
          topString = "(Top property was not defined.)";
        }
        if (this._topPlaceholder.domElement) {
          const elem: React.ReactElement<ISideNavProps> = React.createElement(
            GlobalSideNav, {
            siteurl: this.context.pageContext.site.absoluteUrl,
            context: this.context,
            currentWebUrl: "",
            CurrentPageserverRequestPath: this.context.pageContext.site.serverRequestPath,
          });

          ReactDOM.render(elem, this._topPlaceholder.domElement);
        }
      }
    }

  }
  private _onDispose(): void {
    console.log('[ReactAnalogApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
  // private async updatePageLayoutType(name:string):Promise<void>{
  //   const endpoint : string =
  //   `${this.context.pageContext.site.serverRelativeUrl}/_api/web/getfilebyurl('Sitepages/${name}')/ListItemFields`;
  //   const opt : ISPHttpClientOptions = {
  //     Headers:{
  //       'Content-Type':'application/json',
  //       'Accept':'application/json',
  //       'X-HTTP-Method':'MERGE',
  //       'IF-MATCH':'*'
  //     },
  //     body:JSON.stringify({
  //       PageLayoutType:"HomePgaeLayout"
  //     })
  //   }
  // }
}
