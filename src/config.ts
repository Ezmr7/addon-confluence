export interface IConfluencePageInfo {
  /**
   * The ID of the Confluence page
   * @type {string}
   * @memberof IConfluencePageInfo
   * @example "123456"
   * @default null
   */
  id: string;
  /**
   * The domain of the Confluence page
   * @type {string}
   * @memberof IConfluencePageInfo
   * @example "mycompany"
   * @default null
   */
  domain: string;
}
