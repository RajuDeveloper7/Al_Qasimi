import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'NewsReadMoreWebPartStrings';
import NewsReadMore from './components/NewsReadMore';
import { INewsReadMoreProps } from './components/INewsReadMoreProps';

export interface INewsReadMoreWebPartProps {
  description: string;
}

export default class NewsReadMoreWebPart extends BaseClientSideWebPart<INewsReadMoreWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INewsReadMoreProps> = React.createElement(
      NewsReadMore,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        context: this.context,
        userid: this.context.pageContext.legacyPageContext["userId"],
        siteID: this.context.pageContext.web.id,
        useremail: this.context.pageContext.user.email
      }
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
