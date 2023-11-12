import Pilot from "./Pilot.class.mjs";
import * as cheerio from 'cheerio';

export default class Godomall extends Pilot {
  #page = 1;

  /**
   * 이미 한 번 이상 히트된 상품의 번호 목록
   */
  static #hittedGoodsNoList = [];

  constructor(options) {
    super();

    this.host = String(options.host).trimEnd('/') + '/';
    this.cateCd = String(options.cateCd).trim();

    return this;
  }

  nextPage() {
    this.#page++;

    return this;
  }

  getCurrentPageUrl() {
    return `${this.host}goods/goods_list.php?page=${this.#page}&cateCd=${this.cateCd}`;
  }

  async getListItems() {
    const response = await super.getHtml(this.getCurrentPageUrl(), this.host);

    return cheerio.load(response);
  }

  async run() {
    const nextPageReferer = this.getCurrentPageUrl();

    const $ = await this.getListItems();
    const $itemInfoContent = $('.goods_list .item_info_cont');
    
    if ($itemInfoContent.length === 0) {
      return true; // end page
    }

    const $itemAnchors = $('.goods_list .item_tit_box a'); // goodsNo
    const $itemNames = $('.goods_list .item_name'); // item_name
    const $itemPrices = $('.goods_list .item_price'); // item price
    
    console.log($itemAnchors.length, $itemNames.length, $itemPrices.length)
  }
}