import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IJobsRmProps {
  description: string;
  siteurl: string;
  context:WebPartContext;
}
