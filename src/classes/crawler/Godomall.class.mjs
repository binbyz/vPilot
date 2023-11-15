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

    let host = String(options.host);

    this.host = host.endsWith('/') ? host : host + '/';
    this.cateCd = String(options.cateCd).trim();

    return this;
  }

  initializePage() {
    this.#page = 1;

    return this;
  }

  nextPage() {
    this.#page++;

    return this;
  }

  getCurrentPageUrl(page = undefined) {
    page = page || this.#page;

    return `${this.host}goods/goods_list.php?page=${this.#page}&cateCd=${this.cateCd}`;
  }

  getReferer() {
    return this.#page === 1 
      ? this.host 
      : this.getCurrentPageUrl(this.#page - 1);
  }

  async getListItems() {
    const response = await super.getHtml(this.getCurrentPageUrl(), this.getReferer());

    return cheerio.load(response);
  }

  async run() {
    const $ = await this.getListItems();
    const $goodsList = $('#goodslist ul.goods_product_list > li');
    
    if ($goodsList.length === 1 && $goodsList.eq(0).hasClass('no_bx')) {
      return false; // end page
    }

    const $itemAnchors = $goodsList.find('.goods_prd_content a');
    const $itemNames = $goodsList.find('.goods_prd_content .prd_name');
    const $itemPrices = $goodsList.find('.goods_prd_content .c_price');

    for (let index = 0; index < $goodsList.length; index++) {
      const href = $itemAnchors.eq(index).attr('href');
      const goodsName = $itemNames.eq(index).text().trim();
      const priceText = $itemPrices.eq(index).text().trim();

      const goodsNo = this.#extractGoodsNoFromHref(href);
      const price = this.#extractPriceFromText(priceText);

      Pilot.logger.info(`host:${this.host}, cateCd: ${this.cateCd}, page:${this.#page}, price:${priceText}, goodsNo: ${goodsNo}, product:${goodsName}`);

      this.sendWebSocketMessage({
        time: Date.now(),
        host: this.host,
        cateCd: this.cateCd,
        page: this.#page,
        price,
        goodsNo,
        goodsName,
      });
    }

    this.nextPage();

    return true;
  }

  #extractGoodsNoFromHref(href) {
    return Number(href.match(/goodsNo=(\d+)/)[1]);
  }

  #extractPriceFromText(text) {
    text = text.replace(',', '').replace('원', '');

    return Number(text);
  }
}