import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IRemoHomePageProps {
  description: string;
  siteurl:string;
  userid:any;
  context:WebPartContext;
}
export interface IWeatherCurrencyProps {
  description: string;
  context: any;
  siteurl:string;
}
