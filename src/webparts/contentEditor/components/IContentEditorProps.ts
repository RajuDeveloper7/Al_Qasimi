import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IContentEditorProps {
  description: string;
  siteurl: string;
  UserId:any;
  context:WebPartContext;
}
