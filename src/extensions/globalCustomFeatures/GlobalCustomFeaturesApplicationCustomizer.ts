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
import GlobalSideNav, {ISideNavProps} from "../globalCustomFeatures/GlobalSideNav";
import styles from './loc/Global.module.scss';
import * as strings from 'GlobalCustomFeaturesApplicationCustomizerStrings';
import { escape } from '@microsoft/sp-lodash-subset';
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
  Bottom: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class GlobalCustomFeaturesApplicationCustomizer
  extends BaseApplicationCustomizer<IGlobalCustomFeaturesApplicationCustomizerProperties> {
    private _topPlaceholder: PlaceholderContent | undefined;

    private _bottomPlaceholder: PlaceholderContent | undefined;
  
  @override
  public onInit(): Promise<void> {
    $('html').css("visibility","hidden");
    sessionStorage.setItem("spfx-debug", "");
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);      
    return Promise.resolve<void>();  
  }
  

  
  private _renderPlaceHolders(): void { 
    //this.GetFooterLinks();
    
    // Handling the top placeholder  
    if (!this._topPlaceholder)   
    {  
      this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(  
        PlaceholderName.Top,  
        { onDispose: this._onDispose }  
      );  
      // The extension should not assume that the expected placeholder is available.  
      if (!this._topPlaceholder)   
      {  
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
          GlobalSideNav,{
            siteurl: this.context.pageContext.site.absoluteUrl,
            context: this.context,
            currentWebUrl: "",
            CurrentPageserverRequestPath: this.context.pageContext.site.serverRequestPath,
          });  
          
          ReactDOM.render(elem, this._topPlaceholder.domElement);     
        }       
      }  
    } 
    
     // Handling the bottom placeholder  
     if (!this._bottomPlaceholder)   
     {  
       this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(  
         PlaceholderName.Bottom,  
         { onDispose: this._onDispose }  
       );  
       // The extension should not assume that the expected placeholder is available.  
       if (!this._bottomPlaceholder)   
       {  
         console.error("The expected placeholder (bottom) was not found.");  
         return;  
       }  
       if (this.properties) {  
         let bottomString: string = this.properties.Bottom;  
         if (!bottomString) {  
          // bottomString = "(Bottom created.)";  
         }  

         
          /* if (this._bottomPlaceholder.domElement) {  
         const elem: React.ReactElement<ISideNavProps> = React.createElement(  
           GlobalSideNav,{
             siteurl: this.context.pageContext.web.absoluteUrl,
             context: this.context,
             currentWebUrl: "https://tmxin.sharepoint.com/sites/poc/schoolportal/",
             CurrentPageserverRequestPath: this.context.pageContext.site.serverRequestPath
           });  
           ReactDOM.render(elem, this._bottomPlaceholder.domElement);   
         }  */ 
         
         if (this._bottomPlaceholder.domElement) {
          
        }
       }  
     } 



  }
  private _onDispose(): void   
  {  
    console.log('[ReactAnalogApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');  
  }
}
