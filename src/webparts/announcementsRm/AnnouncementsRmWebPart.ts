import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AnnouncementsRmWebPartStrings';
import AnnouncementsRm from './components/AnnouncementsRm';
import { IAnnouncementsRmProps } from './components/IAnnouncementsRmProps';
import { default as pnp, ItemAddResult } from "sp-pnp-js";

export interface IAnnouncementsRmWebPartProps {
  description: string;
}

export default class AnnouncementsRmWebPart extends BaseClientSideWebPart<IAnnouncementsRmWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAnnouncementsRmProps> = React.createElement(
      AnnouncementsRm,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        context: this.context,
        userid: this.context.pageContext.legacyPageContext["userId"],
        useremail: this.context.pageContext.user.email
      },
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
