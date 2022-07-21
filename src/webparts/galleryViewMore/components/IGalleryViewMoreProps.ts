import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from '@microsoft/sp-http'; 
export interface IGalleryViewMoreProps {
  description: string;
  siteurl: string;
  spHttpClient: SPHttpClient;
  context:WebPartContext;

}
