import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DeptGalleryGridViewWebPartStrings';
import DeptGalleryGridView from './components/DeptGalleryGridView';
import { IDeptGalleryGridViewProps } from './components/IDeptGalleryGridViewProps';

export interface IDeptGalleryGridViewWebPartProps {
  description: string;
}

export default class DeptGalleryGridViewWebPart extends BaseClientSideWebPart<IDeptGalleryGridViewWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDeptGalleryGridViewProps> = React.createElement(
      DeptGalleryGridView,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        context: this.context,
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
