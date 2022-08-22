import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRemoDeptLandingPageProps {
  PageName: string;
  siteurl: string;
  userid: any;
  context: WebPartContext;
  homepage: string;
}
