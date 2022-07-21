import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'ContentEditorWebPartStrings';
import ContentEditor from './components/ContentEditor';
import { IContentEditorProps } from './components/IContentEditorProps';

export interface IContentEditorWebPartProps {
  description: string;
}

export default class ContentEditorWebPart extends BaseClientSideWebPart<IContentEditorWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IContentEditorProps> = React.createElement(
      ContentEditor,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        UserId: this.context.pageContext.legacyPageContext["userId"],
        context: this.context
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
