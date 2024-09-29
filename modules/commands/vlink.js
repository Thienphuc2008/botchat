const axios = require('axios');

module.exports = {
  config: {
    name: 'vlink',
    version: '1.0.0',
    hasPermssion: 0,
    credits: 'Mây Trắng',
    description: 'Bypass link',
    commandCategory: 'Tiện Ích',
    usages: '[link]',
    cooldowns: 3
  },

  run: async function({ api, event, args }) {
    let link = args.join(" ");
    
    
    link = link.replace(/^https?:\/\//, '');    
    
    link = link.replace(/\/.*/, '');

    const validLinks = ['traffic123.net', 'link68.net', 'laymangay.com'];

    if (!validLinks.includes(link)) {
      return api.sendMessage(`Các link hiện có thể bypass là:\n- traffic123.net\n- link68.net\n- laymangay.com`, event.threadID);
    }

    try {
      const response = await axios.get(`${link}`);
      const { status, password } = response.data;

      if (status) {
        api.sendMessage(`Mã: ${password}`, event.threadID);
      } else {
        api.sendMessage('Không tìm thấy Mã.', event.threadID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage('Có lỗi xảy ra, vui lòng thử lại sau.', event.threadID);
    }
  }
};