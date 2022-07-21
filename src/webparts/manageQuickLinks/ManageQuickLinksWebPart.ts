import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ManageQuickLinksWebPartStrings';
import ManageQuickLinks from './components/ManageQuickLinks';
import { IManageQuickLinksProps } from './components/IManageQuickLinksProps';

export interface IManageQuickLinksWebPartProps {
  description: string;
}

export default class ManageQuickLinksWebPart extends BaseClientSideWebPart<IManageQuickLinksWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IManageQuickLinksProps> = React.createElement(
      ManageQuickLinks,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        userid: this.context.pageContext.legacyPageContext["userId"],
        spHttpClient: this.context.spHttpClient, 
        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
