let stream_url = url=>require('axios').get(url, {
    responseType: 'stream',
}).then(res=>res.data);
let _0 = x=>x < 10?'0'+x: x;
let random = (min, max)=>Math.random()*(max-min+1)+min<<0;

// danh sách công việc

let time_wai_work = 6; //chờ 30 phút để làm việc tiếp
let works = {
   '🎣': {
        name: 'Câu Cá',
        img: 'https://i.imgur.com/ANpbrx4.gif',
        done: [
  ['Chúc mừng {name} đã câu dính Cá Thu và thu về được {$}$', "https://i.imgur.com/dC9rOLs.png"],

  ['Chúc mừng {name} đã câu dính Cá Sấu và thu về được {$}$', "https://i.imgur.com/G8yy8Ed.png"],

  ['Chúc mừng {name} đã câu dính Cá Mập và thu về được {$}$', "https://i.imgur.com/wg4u5dQ.png"],

  ['Chúc mừng {name} đã câu dính Cá Heo và thu về được {$}$', "https://i.imgur.com/AUIMFUi.png"],

  ['Chúc mừng {name} đã câu dính Cá voi Sát Thủ và thu về được {$}$', "https://i.imgur.com/Tx1ynIZ.png"],

  ['Chúc mừng {name} đã câu dính Mực Ma và thu về được {$}$', "https://i.imgur.com/BxY3s1s.png"],

  ['Chúc mừng {name} đã câu dính Tôm Hùm Alaska và thu về được {$}$', "https://i.imgur.com/DJficc7.png"],

  ['Chúc mừng {name} đã câu dính Cá Voi Xanh và thu về được {$}$', "https://i.imgur.com/rnwzctL.png"],

  ['Chúc mừng {name} đã câu dính Rùa Leviathanochelys aenigmatica và thu về được {$}$', "https://i.imgur.com/l5OWZ5b.png"],

  ['Chúc mừng {name} đã câu dính Sứa Stygiomedusa gigantea và thu về được {$}$', "https://i.imgur.com/M2UQW74.png "],

  ['Chúc mừng {name} đã câu dính Cua Hoàng Đế và thu về được {$}$', "https://i.imgur.com/uP6ILx7.png "],

  ['Chúc mừng {name} đã câu dính Cá Hồi Đại Dương và thu về được {$}$', "https://i.imgur.com/bxyM2Ux.png"],

  ['Chúc mừng {name} đã câu dính Cá Bò Picasso và thu về được {$}$', "https://i.imgur.com/sfFUt4s.png"],

  ['Chúc mừng {name} đã câu dính Cá Bướm Mỏ Nhọn và thu về được {$}$', "https://i.imgur.com/5hnmoCX.png"],

  ['Chúc mừng {name} đã câu dính Cá Hồng Y và thu về được {$}$', "https://i.imgur.com/oKjJzxz.png"],

  ['Chúc mừng {name} đã câu dính Cá Hề và thu về được {$}$', "https://i.imgur.com/62SexPX.png"],

  ['Chúc mừng {name} đã câu dính Tôm Tít và thu về được {$}$', "https://i.imgur.com/DBijNuL.png"],

  ['Chúc mừng {name} đã câu dính Cá Chim Hoàng Đế và thu về được {$}$', "https://i.imgur.com/XHAbchR.png"],

  ['Chúc mừng {name} đã câu dính Hải Sâm và thu về được {$}$', "https://i.imgur.com/4W5K2Sa.png"],

  ['Chúc mừng {name} đã câu dính Cá Mao Tiên và thu về được {$}$', "https://i.imgur.com/Vo5F10O.png"],

  ['Chúc mừng {name} đã câu dính Cá Bắp Nẻ Xanh và thu về được {$}$', "https://i.imgur.com/3lRIwHD.png"],

  ['Chúc mừng {name} đã câu dính Cá Nóc và thu về được {$}$', "https://i.imgur.com/xrK7h8m.png"],

  ['Chúc mừng {name} đã câu dính Cá Đuối và thu về được {$}$', "https://i.imgur.com/AGr1H1w.png"],

  ['Chúc mừng {name} đã câu dính Cá Bò Hòm và thu về được {$}$', "https://i.imgur.com/fHxdnYJ.png"],

  ['Chúc mừng {name} đã câu dính Bạch Tuộc Dumbo và thu về được {$}$', "https://i.imgur.com/g5QfPYe.png"],

  ['Chúc mừng {name} đã câu dính Cá Mặt Trăng và thu về được {$}$', "https://i.imgur.com/E77LrvJ.png "],

  ['Chúc mừng {name} đã câu dính Cá Mập Megalodon và thu về được {$}$', "https://i.imgur.com/eufhVAg.png"],

  ['Chúc mừng {name} đã câu dính Cá Nhà Táng và thu về được {$}$', "https://i.imgur.com/URZMQ42.png"],

  ['Chúc mừng {name} đã câu dính Cá Voi Lưng Gù và thu về được {$}$', "https://i.imgur.com/YCzF96F.png"],

  ['Chúc mừng {name} đã câu dính Cá Ngựa và thu về được {$}$', "https://i.imgur.com/DFxkxA6.png"],

  ['Chúc mừng {name} đã câu dính Cá Ngừ Đại Dương và thu về được {$}$', "https://i.imgur.com/ZheYfrB.png"],

  ['Chúc mừng {name} đã câu dính Cá Cam và thu về được {$}$', "https://i.imgur.com/4r7tTjX.png"],

  ['Chúc mừng {name} đã câu dính Cá Đuôi Gai Vàng và thu về được {$}$', "https://i.imgur.com/ea98AGa.png"],

  ['Chúc mừng {name} đã câu dính Cá Mập Đầu Búa và thu về được {$}$', "https://i.imgur.com/UcJarmr.png"],

  ['Chúc mừng {name} đã câu dính Cá Mập Pliotrema Kajae và thu về được {$}$', "https://i.imgur.com/Voo5pLJ.png"],

  ['Chúc mừng {name} đã câu dính Mực Colossal và thu về được {$}$', "https://i.imgur.com/fCGh1aG.png"], 

  ['Chúc mừng {name} đã câu dính Cá Bubble Eye và thu về được {$}$', "https://i.imgur.com/45a37RA.png"], 

  ['Chúc mừng {name} đã câu dính Cá Mập Greenland và thu về được {$}$', "https://i.imgur.com/dotaXNC.png"], 

  ['Chúc mừng {name} đã câu dính Cá Oarfish và thu về được {$}$', "https://i.imgur.com/054VH9M.png"],

  ['Chúc mừng {name} đã câu dính Cua Nhện và thu về được {$}$', "https://i.imgur.com/DLjdNuO.png"],
   ]
 }, 
   '🦅': {
        name: 'Bắn Chim',
        img: 'https://i.imgur.com/72o6Mur.gif',
        done: [
  ['Chúc mừng {name} đã bắn được con đại bàng giá trị {$}$', "https://i.imgur.com/Za3qGg2.png"],
        
  ['Chúc mừng {name} đã bắn được con bồ câu, và kiếm đc {$}$', "https://i.imgur.com/ilNpO2L.png"],
          
  ['Chúc mừng {name} đã bắn được con phượng hoàng, và kiếm đc {$}$', "https://i.imgur.com/xE9jvtn.png"],
          
  ['Chúc mừng {name} đã bắn được Chim Bombycilla Garrulus, kiếm đc {$}$', "https://i.imgur.com/HPJXiu5.png"],
          
  ['Chúc mừng {name} đã bắn được con chim ruồi giá trị {$}$', "https://i.imgur.com/LR7Zp6k.png"],
          
  ['Chúc mừng {name} đã bắn được Chim đuôi seo (The Quetzal), giá trị {$}$', "https://i.imgur.com/BdmmoNS.png"],
          
  ['Chúc mừng {name} đã bắn được Chim Ramphastos Sulfuratus giá trị {$}$', "https://i.imgur.com/uByoUbX.png"],   
    ]
  },  
   '🪓': {
        name: 'Chặt Cây',
        img: 'https://i.imgur.com/EN15fDe.gif',
        done: [
  ['Chúc mừng {name} đã chặt được cây gỗ quý bán được {$}$', "https://i.imgur.com/b9Cg6KJ.jpeg"],
          
  ['Chúc mừng {name} đã chặt được cây gỗ quý bán được {$}$', "https://i.imgur.com/N2W9y3X.jpeg"],
          
  ['Chúc mừng {name} đã chặt được cây gỗ đen châu phi  bán được {$}$', "https://i.imgur.com/CMrDqO4.png"],
          
  ['Chúc mừng {name} đã chặt được cây gỗ bằng lăng cươm bán được {$}$', "https://i.imgur.com/m2JfyVd.png"],
          
  ['Chúc mừng {name} đã chặt được cây cẩm lai bán được {$}$', "https://i.imgur.com/R3OGDax.png"],
          
  ['Chúc mừng {name} đã chặt được cây gỗ muồng bán được {$}$', "https://i.imgur.com/i7mLadW.png"],   
    ]
  }, 
   '⚓': {
        name: 'Kéo Thùng',
        img: 'https://i.imgur.com/0eCG0xf.gif',
        done: [
  ['Chúc mừng {name} đã mở được găng tay thanos và mang về được {$}$', "https://i.imgur.com/KpCHOyG.png"],
          
  ['Chúc mừng {name} đã mở được cuộn dây thừng và mang về được {$}$', "https://i.imgur.com/tSsfhTf.png"],
          
  ['Chúc mừng {name} đã mở được cuộn giấy vệ sinh và mang về được {$}$', "https://i.imgur.com/SgEN3Wy.png"],
          
  ['Chúc mừng {name} đã mở được cái bếp và mang về được {$}$', "https://i.imgur.com/hiCBb9S.png"],
          
  ['Chúc mừng {name} đã mở được cây búa và mang về được {$}$', "https://i.imgur.com/FQONYv0.png"],
          
  ['Chúc mừng {name} đã mở được cây rìu và mang về được {$}$', "https://i.imgur.com/gZowitn.png"],
          
  ['Chúc mừng {name} đã mở được cây cung và mang về được {$}$', "https://i.imgur.com/jZo8bbX.png"],
          
  ['Chúc mừng {name} đã mở được cây súng và mang về được {$}$', "https://i.imgur.com/hkUFKYk.png"],
          
  ['Chúc mừng {name} đã kéo được bè trôi trên biển và bán được {$}$', "https://i.imgur.com/xshd5YL.png"],

  ['Chúc mừng {name} đã kéo được khúc gỗ và bán được {$}$', "https://i.imgur.com/u5owF4U.png"],
    ]
  },
   '⛏️': {
        name: 'Đào Đá',
        img: 'https://i.imgur.com/HHzSQSE.gif',
        done: [
  ['Chúc mừng {name} đã đào được viên ngọc lục bảo và bán được {$}$', "https://i.imgur.com/bgoXRje.png"],
          
  ['Chúc mừng {name} đã đào được viên kim cương và bán được {$}$', "https://i.imgur.com/loWcGjM.png"],
          
  ['Chúc mừng {name} đã đào được cục vàng và bán được {$}$', "https://i.imgur.com/9bFvarQ.png"],
          
  ['Chúc mừng {name} đã đào được cục sắt và bán được {$}$', "https://i.imgur.com/M7SyA4w.png"],
          
  ['Chúc mừng {name} đã đào được viên đá đỏ và bán được {$}$', "https://i.imgur.com/h6wcjlT.png"],
          
  ['chúc mừng {name} đã đào được Khối đá và bán được {$}$', "https://i.imgur.com/opHgOGp.png"],
          
  ['chúc mừng {name} đã đào được viên ngọc lưu ly và bán được {$}$', "https://i.imgur.com/jJQ2aU0.png"],
    ]
  }, 
   '🌾': {
        name: 'Trồng Rau Củ',
        img: 'https://i.imgur.com/I3QAv3o.gif',
        done: [
  ['Chúc mừng {name} đã trồng được hành lá và bán được {$}$', "https://i.imgur.com/edrVzhG.png"],

  ['Chúc mừng {name} đã trồng được ngò rí và bán được {$}$', "https://i.imgur.com/x53NTsB.png"],

  ['Chúc mừng {name} đã trồng được củ hành tây và bán được {$}$', "https://i.imgur.com/ADN2XBk.png"],

  ['Chúc mừng {name} đã trồng được trái xoài và bán được {$}$', "https://i.imgur.com/fFMGMNq.png"],

  ['Chúc mừng {name} đã trồng được trái chanh và bán được {$}$', "https://i.imgur.com/5WgYAbO.png"],

  ['Chúc mừng {name} đã trồng được củ khoai tây và bán được {$}$', "https://i.imgur.com/Lkrl1wJ.png"],

  ['Chúc mừng {name} đã trồng được trái đu đủ  và bán được {$}$', "https://i.imgur.com/GhkfE3w.png"],

  ['Chúc mừng {name} đã trồng được bắp cải xanh và bán được {$}$', "https://i.imgur.com/6l0WqfG.png"],

  ['Chúc mừng {name} đã trồng được ớt chuông và bán được {$}$', "https://i.imgur.com/b1FNOdL.png"],

  ['Chúc mừng {name} đã trồng được bông cải xanh và bán được {$}$', "https://i.imgur.com/BPciexD.png"],

  ['Chúc mừng {name} đã trồng được cải thìa ( cải chíp ) và bán được {$}$', "https://i.imgur.com/ZHGdp4h.png"],

  ['Chúc mừng {name} đã trồng được nấm mỡ trắng và bán được {$}$', "https://i.imgur.com/9cIhtqa.png"],

  ['Chúc mừng {name} đã trồng được đậu que và bán được {$}$', "https://i.imgur.com/OzN3e9y.png"],

  ['Chúc mừng {name} đã trồng được rau xà lách và bán được {$}$', "https://i.imgur.com/AyLaISX.png"],

  ['Chúc mừng {name} đã trồng được củ tỏi và bán được {$}$', "https://i.imgur.com/6cwuWYm.png"],

  ['Chúc mừng {name} đã trồng được trái kiwi và bán được {$}$', "https://i.imgur.com/usvKlrp.png"],

  ['Chúc mừng {name} đã trồng được trái dưa hấu và bán được {$}$', "https://i.imgur.com/EmJz9Hu.png"],

  ['Chúc mừng {name} đã trồng được trái bí ngô và bán được {$}$', "https://i.imgur.com/GkKBUbX.png"],

  ['Chúc mừng {name} đã trồng được củ cà rốt và bán được {$}$', "https://i.imgur.com/WPvcV0b.png"],

  ['Chúc mừng {name} đã trồng được trái bơ và bán được {$}$', "https://i.imgur.com/HQqQG81.png"],

  ['Chúc mừng {name} đã trồng được quả cà chua và bán được {$}$', "https://i.imgur.com/1T3A7yH.png"],

  ['Chúc mừng {name} đã trồng được trái cà tím và bán được {$}$', "https://i.imgur.com/95HI9RD.png"],

  ['Chúc mừng {name} đã trồng được trái bắp và bán được {$}$', "https://i.imgur.com/OdQqU07.png"],

  ['Chúc mừng {name} đã trồng được trái ớt và bán được {$}$', "https://i.imgur.com/wmbGwU5.png"],

  ['Chúc mừng {name} đã trồng được dâu tây và bán được {$}$', "https://i.imgur.com/Y10LpOD.png"],

  ['Chúc mừng {name} đã trồng được trái khổ qua và bán được {$}$', "https://i.imgur.com/3VtTb4q.png"],

  ['Chúc mừng {name} đã trồng được dưa leo và bán được {$}$', "https://i.imgur.com/83quwJy.png"],

  ['Chúc mừng {name} đã trồng được đậu bắp và bán được {$}$', "https://i.imgur.com/Gs6FeTb.png"],

  ['Chúc mừng {name} đã trồng được chuối và bán được {$}$', "https://i.imgur.com/nhfzAGX.png"],

  ['Chúc mừng {name} đã trồng được củ cải trắng và bán được {$}$', "https://i.imgur.com/LmqNeVN.png"],

  ['Chúc mừng {name} đã trồng được rau mầm và bán được {$}$', "https://i.imgur.com/F4XYXDI.png"],

  ['Chúc mừng {name} đã trồng được hẹ lá và bán được {$}$', "https://i.imgur.com/ngjTJ5h.png"],

  ['Chúc mừng {name} đã trồng được hành calcot và bán được {$}$', "https://i.imgur.com/eXvs0Bv.png"],

  ['Chúc mừng {name} đã trồng được măng tây và bán được {$}$', "https://i.imgur.com/ui1NufZ.png"],

  ['Chúc mừng {name} đã trồng được nấm kim châm và bán được {$}$', "https://i.imgur.com/BGRNOv3.png"],

  ['Chúc mừng {name} đã trồng được giá đỗ và bán được {$}$', "https://i.imgur.com/DWXSwaf.png"],

  ['Chúc mừng {name} đã trồng được ớt hiểm và bán được {$}$', "https://i.imgur.com/dldWSVD.png"],

  ['Chúc mừng {name} đã trồng được củ riềng và bán được {$}$', "https://i.imgur.com/y2gLG7k.png"],

  ['Chúc mừng {name} đã trồng được lá tía tô và bán được {$}$', "https://i.imgur.com/DPJJ4lF.png"],

  ['Chúc mừng {name} đã trồng được đậu rồng và bán được {$}$', "https://i.imgur.com/l4NVF9t.png"],

  ['Chúc mừng {name} đã trồng được rau diếp cá và bán được {$}$', "https://i.imgur.com/H0ACtbl.png"],

  ['Chúc mừng {name} đã trồng được rau ngót và bán được {$}$', "https://i.imgur.com/4QtuP8q.png"],

  ['Chúc mừng {name} đã trồng được trái bí đỏ và bán được {$}$', "https://i.imgur.com/2gSPZd2.png"],

  ['Chúc mừng {name} đã trồng được cây sả và bán được {$}$', "https://i.imgur.com/iqLnZfQ.png"],

  ['Chúc mừng {name} đã trồng được mướp khía và bán được {$}$', "https://i.imgur.com/LsGYAFk.png"],

  ['Chúc mừng {name} đã trồng được đậu hà lan và bán được {$}$', "https://i.imgur.com/FaHmF0z.png"],

  ['Chúc mừng {name} đã trồng được củ su hào và bán được {$}$', "https://i.imgur.com/hdJWkgW.png"],
    ]
  },
   '🏹': {
        name: 'Săn Thú',
        img: 'https://i.imgur.com/1jXJNA6.gif',
        done: [
  ['Chúc mừng {name} đã bắn được con hổ giá trị {$}$', "https://i.imgur.com/EgXspqp.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con sói giá trị {$}$', "https://i.imgur.com/BPozRVg.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con rắn giá trị {$}$', "https://i.imgur.com/6pKhsJl.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con rắn giá trị {$}$', "https://i.imgur.com/fUdNCgn.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con rắn giá trị {$}$', "https://i.imgur.com/2KW2jnf.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con rết giá trị {$}$', "https://i.imgur.com/43J0CzX.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con gấu giá trị {$}$', "https://i.imgur.com/yRRM2Ul.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con ếch giá trị {$}$', "https://i.imgur.com/zD0aeIb.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con heo rừng giá trị {$}$', "https://i.imgur.com/qAshKaj.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con heo rừng giá trị {$}$', "https://i.imgur.com/HWlPqWa.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con hà mã giá trị {$}$', "https://i.imgur.com/rWr8LVU.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con hưu cao cổ giá trị {$}$', "https://i.imgur.com/6xRS42P.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con kangguru giá trị {$}$', "https://i.imgur.com/8od95vO.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con khỉ giá trị {$}$', "https://i.imgur.com/PFqVrsw.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con sóc giá trị {$}$', "https://i.imgur.com/Hkt9Keg.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con dê giá trị {$}$', "https://i.imgur.com/wzjcDjW.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con nhím giá trị {$}$', "https://i.imgur.com/PoNKtz0.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con thỏ giá trị {$}$', "https://i.imgur.com/iWKLOE4.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con ngựa giá trị {$}$', "https://i.imgur.com/h77IEoH.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con đà điểu giá trị {$}$', "https://i.imgur.com/QZtfBOD.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con cừu giá trị {$}$', "https://i.imgur.com/KqhcEwC.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con tinh tinh giá trị {$}$', "https://i.imgur.com/dIuxx2f.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con công giá trị {$}$', "https://i.imgur.com/1JNG9Ud.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con hồng hạt giá trị {$}$', "https://i.imgur.com/ieweXTU.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con rồng komodo giá trị {$}$', "https://i.imgur.com/sMMIZcj.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con lười giá trị {$}$', "https://i.imgur.com/036JgW8.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con cóc Paramo giá trị {$}$', "https://i.imgur.com/3qoFH3m.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con sóc bay giá trị {$}$', "https://i.imgur.com/lfRNutd.jpeg"],
          
  ['Chúc mừng {name} đã bắn được con tê tê giá trị {$}$', "https://i.imgur.com/0M7opOZ.jpeg"],   
    ]
  }, 
   '🍳': {
        name: 'Nấu Ăn',
        img: 'https://i.imgur.com/ZvEq1iv.gif',
        done: [
  ['Chúc mừng {name} đã nấu được món mì xào gà thơm ngon và bán được {$}$', "https://i.imgur.com/SlCGZXZ.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món gà rán KFC và bán được {$}$', "https://i.imgur.com/S3j0PsT.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món bún riêu cua và bán được {$}$', "https://i.imgur.com/mgrJuE7.jpeg"],

  ['Chúc mừng {name} đã nấu được món mỳ cay hải sản và bán được {$}$', "https://i.imgur.com/GVJfSQn.jpeg"],

  ['Chúc mừng {name} đã nấu được món bánh canh hải sản và bán được {$}$', "https://i.imgur.com/qXAx2gp.jpeg"],

  ['Chúc mừng {name} đã nấu được món hủ tiếu xương óng và bán được {$}$', "https://i.imgur.com/5aFBahH.jpeg"],

  ['Chúc mừng {name} đã nấu được món phở bò và bán được {$}$', "https://i.imgur.com/niepHeo.jpeg"],

  ['Chúc mừng {name} đã nấu được món cơm tấm sườn bì chả trứng và bán được {$}$', "https://i.imgur.com/Uu9viES.jpeg"],

  ['Chúc mừng {name} đã nấu được món cơm gà rán xối mỡ và bán được {$}$', "https://i.imgur.com/l4oeRut.jpeg"],

  ['Chúc mừng {name} đã nấu được món cơm chiên hải sản và bán được {$}$', "https://i.imgur.com/2DUjTg6.jpeg"],

  ['Chúc mừng {name} đã nấu được món bún bò huế và bán được {$}$', "https://i.imgur.com/dZoykH6.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món gỏi cuốn và bán được {$}$', "https://i.imgur.com/yxzqDLJ.jpeg"],

  ['Chúc mừng {name} đã nấu được món gỏi cuốn và bán được {$}$', "https://i.imgur.com/Rr2YJSg.jpeg"],

  ['Chúc mừng {name} đã nấu được món khâu nhục và bán được {$}$', "https://i.imgur.com/PYRXzWy.jpeg"],

  ['Chúc mừng {name} đã nấu được món khâu nhục và bán được {$}$', "https://i.imgur.com/0nsTy2D.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món lươn nướng và bán được {$}$', "https://i.imgur.com/ty8R4TX.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cháo và bán được {$}$', "https://i.imgur.com/CGMbrLJ.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cháo và bán được {$}$', "https://i.imgur.com/I3PQlZf.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món nuôi và bán được {$}$', "https://i.imgur.com/jq8rdGI.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món nuôi và bán được {$}$', "https://i.imgur.com/IwHJgF3.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món bánh xèo và bán được {$}$', "https://i.imgur.com/UivCGtX.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món bánh xèo và bán được {$}$', "https://i.imgur.com/uTsZkC1.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món canh chua và bán được {$}$', "https://i.imgur.com/l19HdsH.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cá kho và bán được {$}$', "https://i.imgur.com/SJiKVNY.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món rau muốn xào tỏi và bán được {$}$', "https://i.imgur.com/rLR9Ieg.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món rau muốn và bán được {$}$', "https://i.imgur.com/4lc98n7.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món nấm xào và bán được {$}$', "https://i.imgur.com/7cLVp8T.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món khổ qua xào và bán được {$}$', "https://i.imgur.com/EdmI7KC.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cơm chiên và bán được {$}$', "https://i.imgur.com/bpm5O80.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món chiên và bán được {$}$', "https://i.imgur.com/rxLa5qf.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cơm chiên và bán được {$}$', "https://i.imgur.com/TNDnYe6.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cơm rang và bán được {$}$', "https://i.imgur.com/sRfbVOn.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món há cảo và bán được {$}$', "https://i.imgur.com/CACHM0d.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món há cảo và bán được {$}$', "https://i.imgur.com/h7T6cfE.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món há cảo và bán được {$}$', "https://i.imgur.com/eRVgS8M.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món há cảo và bán được {$}$', "https://i.imgur.com/G41sUrO.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cơm cuộn và bán được {$}$', "https://i.imgur.com/rNxghTS.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cơm cuộn và bán được {$}$', "https://i.imgur.com/zPnzyFk.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món  cơm cuộn và bán được {$}$', "https://i.imgur.com/B5WiejT.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cà ri và bán được {$}$', "https://i.imgur.com/6lihzTf.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cà ri và bán được {$}$', "https://i.imgur.com/blWRQgb.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món cà ri và bán được {$}$', "https://i.imgur.com/Qk5KmP8.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món đậu hủ nhồi thịt và bán được {$}$', "https://i.imgur.com/ZnxyY80.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món đậu hủ nhồi thịt và bán được {$}$', "https://i.imgur.com/XZ4e3Mu.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món bò cuộn lá lốt và bán được {$}$', "https://i.imgur.com/gcrtpIl.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món bò cuộn lá lốt và bán được {$}$', "https://i.imgur.com/GXmtfUS.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món bò cuộn nấm kim châm và bán được {$}$', "https://i.imgur.com/DhBVlhQ.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món bò cuộn nấm kim châm và bán được {$}$', "https://i.imgur.com/rIVU57J.jpeg"],
          
  ['Chúc mừng {name} đã nấu được món ếch xào và bán được {$}$', "https://i.imgur.com/3iUrJjb.jpeg"],
    ]
  },
   '⚔️': {
        name: 'Giết Rồng',
        img: 'https://i.imgur.com/t05akg6.gif',
        done: [
  ['Chúc mừng {name} đã giết được con rồng Wallpapers và bán được {$}$', "https://i.imgur.com/MhecY4D.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng lửa và bán được {$}$', "https://i.imgur.com/7hv8DyV.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng nước và bán được {$}$', "https://i.imgur.com/UUh7D5z.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng băng và bán được {$}$', "https://i.imgur.com/DXjn7A0.png"],
          
  ['Chúc mừng {name} đã giết được con rồng đất và bán được {$}$', "https://i.imgur.com/dGKP3Rc.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng trắng mắt xanh và bán được {$}$', "https://i.imgur.com/0FaZ0TQ.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng lửa và bán được {$}$', "https://i.imgur.com/7hv8DyV.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng lá và bán được {$}$', "https://i.imgur.com/ujleiX5.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng vàng và bán được {$}$', "https://i.imgur.com/plhjhuW.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng Bahamut và bán được {$}$', "https://i.imgur.com/xCF7b5B.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng Quetzalcoatl và bán được {$}$', "https://i.imgur.com/EEpXfdK.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng Wyvern và bán được {$}$', "https://i.imgur.com/twPYHRc.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng osiris và bán được {$}$', "https://i.imgur.com/imSuyYk.jpeg"],
          
  ['Chúc mừng {name} đã giết được con thuỷ long và bán được {$}$', "https://i.imgur.com/1Uf5J4l.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng Saphira và bán được {$}$', "https://i.imgur.com/O9fiCfB.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng đen mắt đỏ và bán được {$}$', "https://i.imgur.com/umt9ZyC.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng lizardon mega và bán được {$}$', "https://i.imgur.com/MrcjvVU.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng Shruikan và bán được {$}$', "https://i.imgur.com/Nktja9U.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng Charizard mega và bán được {$}$', "https://i.imgur.com/14ilAGX.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng Smaug và bán được {$}$', "https://i.imgur.com/WheZyGe.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng Igneel và bán được {$}$', "https://i.imgur.com/LNUr5ft.jpeg"],
          
  ['Chúc mừng {name} đã giết được con rồng Zmey Gorynych và bán được {$}$', "https://i.imgur.com/nMndFSM.jpeg"],   
    ]
  },
  // thêm tiếp công việc...
};

exports.config = {
    name: 'lamviec',
    version: '4.0',
    hasPermssion: 0,
    Rent: 2,
    credits: 'DC-Nam', // Mod By Q.Huy and Q.Vòng
    description: 'Kiếm Tiền',
    commandCategory: 'Kiếm Tiền',
    usages: '[]',
    cooldowns: 3
};

exports.run = async function(o) {
    let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);

    send({
        body: `[ Công Việc Kiếm Tiền ]\n\n${Object.entries(works).map(($, i)=>`${$[0]} ${$[1].name}`).join('\n')}\n\n📌 Thả cảm xúc tương ứng vào tin nhắn này với những công việc trên để làm việc`,
        attachment: [], // thêm ảnh thì sửa [] qua [await stream_url('link_ảnh')]
    }, (err, res)=>(res.name = exports.config.name, res.event = o.event, global.client.handleReaction.push(res)));
};
exports.handleReaction = async function(o) {
    let _ = o.handleReaction;
    let sid = _.event.senderID;
    let user_ = await o.Users.getData(sid);
    if (!user_.data) return;
    let work_ = user_.data.work; if (!work_)work_ = user_.data.work = {};
    let send = (msg, callback) => o.api.sendMessage(msg, o.event.threadID, callback, o.event.messageID);

    if (o.event.userID != _.event.senderID)return;
    if (typeof work_.time == 'number' && work_.time >= Date.now()) {
        let x = work_.time-Date.now();

        return send(`Đang hồi phục thể lực..., hãy làm việc sau: ${_0(x/1000/60<<0)} phút ${_0(x/1000%60<<0)} giây.`)
    };

    let work = works[o.event.reaction];
    let msg = {};

    if (!work)return send(`Công việc không có trong danh sách`);

    o.api.unsendMessage(o.event.messageID);
    work_.time = Date.now()+(1000*60*time_wai_work);
    o.Users.setData(sid, user_);
    let working_msg = await new Promise(async resolve=>send({
        body: `Đang ${work.name}...`,
        attachment: work.img?await stream_url(work.img):[],
    }, (err, res)=>resolve(res || {})));
    // chờ đợi 2 giây(1000*2) rồi với gửi thông báo xong việc
    await new Promise(out=>setTimeout(out, 1000*2));
    let done = work.done[Math.random()*work.done.length<<0];
    let $ = random(100000, 5000000); //random min 100 max 1000

    msg.body = done[0].replace(/{name}/g, global.data.userName.get(sid)).replace(/{\$}/g, $);
    if (!!done[1])msg.attachment = await stream_url(done[1]);
    // gửi thông báo xong công việc
    send(msg, ()=>o.api.unsendMessage(working_msg.messageID));
    // cộng $ cho người làm
    o.Currencies.increaseMoney(sid, $);
};