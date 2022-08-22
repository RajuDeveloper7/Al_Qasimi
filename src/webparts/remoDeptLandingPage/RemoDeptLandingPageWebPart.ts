import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'RemoDeptLandingPageWebPartStrings';
import RemoDeptLandingPage from './components/RemoDeptLandingPage';
import { IRemoDeptLandingPageProps } from './components/IRemoDeptLandingPageProps';

export interface IRemoDeptLandingPageWebPartProps {
  PageName: string;
}

export default class RemoDeptLandingPageWebPart extends BaseClientSideWebPart<IRemoDeptLandingPageWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IRemoDeptLandingPageProps> = React.createElement(
      RemoDeptLandingPage,
      {
        PageName: this.context.pageContext.web.title,
        context: this.context,
        userid: this.context.pageContext.legacyPageContext["userId"],
        siteurl: this.context.pageContext.web.absoluteUrl,
        homepage: this.context.pageContext.site.absoluteUrl

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
