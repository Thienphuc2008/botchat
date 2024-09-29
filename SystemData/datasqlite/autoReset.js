const moment = require('moment-timezone');
module.exports = function () {
  setInterval(async () => {
    const thoiGianHienTai = moment.tz("Asia/Ho_Chi_MinH");

    const timeRestart = [
      { gio: 0, phut: 30, giay: 0 },
      { gio: 2, phut: 30, giay: 0 },
      { gio: 4, phut: 30, giay: 0 },
      { gio: 7, phut: 30, giay: 0 },
      { gio: 10, phut: 30, giay: 0 },
      { gio: 11, phut: 12, giay: 30 },
      { gio: 13, phut: 30, giay: 0 },
      { gio: 15, phut: 0, giay: 0 },
      { gio: 17, phut: 30, giay: 0 },
      { gio: 19, phut: 0, giay: 0 },
      { gio: 20, phut: 30, giay: 0 },
      { gio: 22, phut: 30, giay: 0 },
      { gio: 23, phut: 40, giay: 0 }
    ];
  
    for (const thoiDiem of timeRestart) {
      if (
        thoiGianHienTai.hour() === thoiDiem.gio &&
        thoiGianHienTai.minute() === thoiDiem.phut &&
        thoiGianHienTai.second() === thoiDiem.giay
      ) {
        process.exit(1);
      }
    }
  }, 1000);
};
