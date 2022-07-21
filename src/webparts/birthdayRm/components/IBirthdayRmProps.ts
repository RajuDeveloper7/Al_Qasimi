import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IBirthdayRmProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
  userid:any;
  useremail:any;
}
