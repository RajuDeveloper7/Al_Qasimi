import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IJobsMasterProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
}
