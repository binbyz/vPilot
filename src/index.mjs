import Godomall from './classes/crawler/Godomall.class.mjs';

new Godomall({ host: "https://m.laonvape.co.kr/", cateCd: "004" }).executeRunUntilEndPage();