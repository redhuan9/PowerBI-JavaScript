import * as models from 'powerbi-models';
import { IFilterable } from './ifilterable';
import { IPageNode, Page } from './page';

/**
 * A Visual node within a report hierarchy
 * 
 * @export
 * @interface IVisualNode
 */
export interface IVisualNode {
  name: string;
  title: string;
  type: string;
  layout: models.IVisualLayout;
  page: IPageNode;
}

/**
 * A Power BI visual within a page
 * 
 * @export
 * @class VisualDescriptor
 * @implements {IVisualNode}
 */
export class VisualDescriptor implements IVisualNode, IFilterable {
  /**
   * The visual name
   * 
   * @type {string}
   */
  name: string;

  /**
   * The visual title
   * 
   * @type {string}
   */
  title: string;

  /**
   * The visual type
   * 
   * @type {string}
   */
  type: string;

  /**
   * The visual layout: position, size and visiblity.
   * 
   * @type {string}
   */
  layout: models.IVisualLayout;

  /**
   * The parent Power BI page that contains this visual
   * 
   * @type {IPageNode}
   */
  page: IPageNode;

  constructor(page: IPageNode, name: string, title: string, type: string, layout: models.IVisualLayout) {
    this.name = name;
    this.title = title;
    this.type = type;
    this.layout = layout;
    this.page = page;
  }

  /**
   * Gets all visual level filters of the current visual.
   * 
   * ```javascript
   * visual.getFilters()
   *  .then(filters => { ... });
   * ```
   * 
   * @returns {(Promise<models.IFilter[]>)}
   */
  getFilters(): Promise<models.IFilter[]> {
    return this.page.report.service.hpm.get<models.IFilter[]>(`/report/pages/${this.page.name}/visuals/${this.name}/filters`, { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
      .then(response => response.body,
        response => {
          throw response.body;
        });
  }

  /**
   * Removes all filters from the current visual.
   * 
   * ```javascript
   * visual.removeFilters();
   * ```
   * 
   * @returns {Promise<void>}
   */
  removeFilters(): Promise<void> {
    return this.setFilters([]);
  }

  /**
   * Sets the filters on the current visual to 'filters'.
   * 
   * ```javascript
   * visual.setFilters(filters);
   *   .catch(errors => { ... });
   * ```
   * 
   * @param {(models.IFilter[])} filters
   * @returns {Promise<void>}
   */
  setFilters(filters: models.IFilter[]): Promise<void> {
    return this.page.report.service.hpm.put<models.IError[]>(`/report/pages/${this.page.name}/visuals/${this.name}/filters`, filters, { uid: this.page.report.config.uniqueId }, this.page.report.iframe.contentWindow)
      .catch(response => {
        throw response.body;
      });
  }
}
