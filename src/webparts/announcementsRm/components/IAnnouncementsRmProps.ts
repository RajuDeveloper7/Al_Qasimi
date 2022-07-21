import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAnnouncementsRmProps {
  description: string;
  siteurl:string;
  context:WebPartContext;
  userid:any;
  useremail:any;
}
