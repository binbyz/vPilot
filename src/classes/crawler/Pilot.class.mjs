import axios from "axios";

export default class Pilot {
  #axios;
  #referer;

  constructor() {
    this.#axios = axios.create({
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Connection": "keep-alive",
        "User-Agent": this.getHumanUserAgent(),
      },
    });
  }

  async getHtml(url, referer = undefined) {
    try {
      if (referer) {
        this.#axios.defaults.headers.common["Referer"] = referer;
      }

      const response = await this.#axios.get(url);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  
  getHumanUserAgent() {
    const userAgentList = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "AppleWebKit/537.36 (KHTML, like Gecko)",
      "Chrome/89.0.4389.114",
      "Safari/537.36",
    ];

    return userAgentList[Math.floor(Math.random() * userAgentList.length)];
  }

  set referer(referer) {
    this.#referer = referer;
  }
  
  get referer() {
    return this.#referer;
  }
}