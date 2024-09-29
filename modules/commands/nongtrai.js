/*
@developer: DC-Nam
@designer: Heo, Dương
*/

try {
    exports.config = {
    name: 'nongtrai',
    version: '0.0.1',
    hasPermssion: 0,
    credits: 'DC-Nam, Heo',
    description: 'nongtrai',
    commandCategory: 'Trò Chơi',
    usages: '[]',
    cooldowns: 0,
};
let fs = require('fs');
let {
    createCanvas,
    loadImage
} = require('canvas');
let axios = require('axios');

let root_path = __dirname+'/Trò_chơi/nongtrai/'
let db_path = root_path+'db/'; if (!fs.existsSync(db_path))fs.mkdirSync(db_path, {
    recursive: true,
});
let read = (id, path = db_path+id+'.json')=>fs.existsSync(path)?JSON.parse(fs.readFileSync(path)): null;
let reads = _=>fs.readdirSync(db_path).map($=>read($.replace('.json', ''))).filter($=>$ != null);
let del = (id, path = db_path+id+'.json')=>fs.unlinkSync(path);
let save = (data, path = db_path+data.uid+'.json')=>fs.writeFileSync(path, JSON.stringify(data, 0, 4));
let crops// = require(root_path+'crops.js');
let now = _=>Date.now();
let stream_url = url=>require('axios').get(url, {
    responseType: 'stream',
}).then(res=>res.data);
let uuid = _=>require('uuid').v4();
let name = id=>global.data.userName.get(id);
let cmtt = ms=> {
    let s = ms/1000<<0;
    let m = s/60<<0;
    let h = m/60<<0;
    let d = h/24<<0;

    s %= 60;
    m %= 60;
    h %= 24;

    return `${d > 0 ? d + 'd,': ''}${h > 0 ? h + ':': ''}${m > 0 ? m + ':': ''}${s}`;
};
let land_image;
let bag_and_chest_image;
let rows_limit_land_crops = 4;
let colums_limit_land_crops = 5;
let row__bag = 3;
let col__bag = 12;
let row__chest = 3;
let col__chest = 12;
let locations_text = ['Trang Trại', 'Giải Trí', 'Săn Bắn', 'Bất Động Sản'];
let seasons_text = 'Xuân,Hạ,Thu,Đông'.split(',');

exports.onLoad = async o=> {
    if (!global._J7sD5A)global._J7sD5A = setInterval((_=> {
        for (let e of reads()) {
            if (e.spin.remaining < e.spin.max && (now()-e.spin.last_update) > (1000*60*60))(e.spin.remaining += 5, e.spin.last_update = now(), save(e));
        }
    }), 1000*60);
    if (!land_image)loadImage('https://raw.githubusercontent.com/NamVNs/nong-trai/main/assets/img/IMG_0038.png').then(_=>land_image = _);
    if (!bag_and_chest_image)loadImage('https://raw.githubusercontent.com/NamVNs/nong-trai/main/assets/img/IMG_0100.jpeg').then(_=>bag_and_chest_image = _);
    if (!crops)axios.get('https://raw.githubusercontent.com/NamVNs/nong-trai/main/assets/crops.js').then(res=>crops = eval(`(${res.data})`));
};
exports.run = async o => {
    let tid = o.event.threadID;
    let send = ((msg, tid_, typ = typeof tid_ == 'object') => new Promise(r => (o.api.sendMessage(msg, typ ? tid_.event.threadID: (tid_ || tid), (err, res) => r(res || err), typ ? tid_.event.messageID: (tid_ ? undefined: o.event.messageID)))));
    let cmd = o.event.args[0];
    let sid = o.event.senderID;
    let data = read(sid);

    if (data == null && !['create', '-c', 'top'].includes(o.args[0]))return send(`chưa có nông trại, dùng “${cmd} create” để tạo nông trại hoặc thả cảm xúc vào tin nhắn này để tạo !`).then(res=>(res.callback = async o=>create_farm(send, o.event.userID, o), res.name = exports.config.name, res.o = o, client.handleReaction.push(res)));

    switch (o.args[0]) {
        case 'create':
        case '-c':
            create_farm(send, sid);
            break;
        case 'info':
        case '-i': {
                send(`== Thông Tin Nông Trại ==\n\n- Chủ: ${name(data.uid)}\n- Lvl: ${data.level} (${data.exp}/${exp_to_next_level(data.exp, true)})\n- Thể Lực: ${data.stamina.remaining}/${data.stamina.max}\n- Tiền: ${data.gold} gold\n- Lượt Quay: ${data.spin.remaining}/${data.spin.max}\n- Khu Vực: ${locations_text[data.location.id]}\n- Thời Tiết:\n • Mùa ${seasons_text[calculate_season()]}`);
            };
            break;
        case 'shop':
        case '-s':
            send(`[ SHOP ]\n\n1. Giống Cây Trồng`).then(res=>(res.callback = async o=> {
                let shopIndex = +o.event.args[0];

                switch (shopIndex) {
                case 1:
                    send(`Cửa hàng giống cây trồng:\n__________\n${crops.map((e,
                        i)=>`${i+1}.\nID: ${e.ID}\nTên: ${e.name}\nGiá: ${e.cost} vàng\n___________`).join('\n')}\n\n-> phản hồi tin nhắn kèm hành động: [mua|xem] <STT> <SL>\n\n[!] [a|b] (a hoặc b); STT (số thứ tự); SL (số lượng)`, o).then(res=>(res.callback = async o=> {
                        data = read(sid);
                        let [
                            action,
                            num_oder,
                            quantity
                        ] = o.event.args;
                        let crop = crops[num_oder-1];
                        quantity =+ quantity;

                        if (isNaN(quantity))quantity = 1;
                        if (!crop)return send(`STT vật phẩm không tồn tại !`, o);
                        switch (action) {
                        case 'mua':
                            $Mua(quantity, o);
                            break;
                        case 'xem':
                            send(crop_text(crop)+'\n______\n-> phản hồi tin nhắn này kèm <SL> để mua\n\n[!] SL (số lượng)').then(res=>(res.callback = async o=>$Mua(+o.event.args[0], o), res.name = exports.config.name, res.o = o, client.handleReply.push(res)));
                            break;
                        default:
                            send('hành động không hợp lệ !');
                            break;
                        };
                        async function $Mua(quantity, o) {
                            data = read(sid);
                            if (data.gold < (crop.cost*quantity))return send(`[!] bạn còn thiếu ${crop.cost*quantity-data.gold} gold để mua ${crop.name}*${quantity}`, o);
                            if (data.bag.every(e=>e.filter(e=>e != null).length == col__bag))return send('không gian túi đồ đã hết chỗ chứa !', o);

                            return send(`thả cảm xúc để xác nhận mua ${crop.name}*${quantity} với giá ${crop.cost*quantity} gold`, o).then(res=> {
                                res.callback = async o=> {
                                    data = read(sid);
                                    if (data.gold < crop.cost*quantity)return send(`[!] bạn còn thiếu ${crop.cost*quantity-data.gold} gold để mua ${crop.name}*${quantity}`, o);
                                    let find_item_id = Find_item_from__bag_or_chest(data.bag, crop.ID, 'seed');

                                    if (find_item_id)find_item_id.quantity += quantity;
                                    else Push_item_to__bag_or_chest(data.bag, {
                                        id: crop.ID,
                                        type: 'seed',
                                        quantity,
                                    });
                                    data.gold -= crop.cost*quantity;
                                    save(data);
                                    return send(`mua thành công hạt giống ${crop.name}*${quantity} với giá ${crop.cost*quantity} gold (bạn còn ${data.gold} g)`, o);
                                };
                                res.name = exports.config.name,
                                res.o = o;
                                client.handleReaction.push(res);
                            });
                        };
                        return '';
                    },
                        res.name = exports.config.name,
                        res.o = o,
                        client.handleReply.push(res)));
                    break;
                default:
                    break;
                };
                return '';
            }, res.name = exports.config.name, res.o = o, client.handleReply.push(res)));
            break;
        case 'bag':
        case '-b':
        case 'chest':
            send({
                attachment: await draw_items_on_bag_and_chest(data),
                body: `[ Bag & Chest ]\n- phản hồi tin nhắn kèm hành động: [rương|túi] [dùng|xem|vứt|thêm|lấy] <X> <Y> <SL>\n\n[!] X (cột); Y (dòng); SL (số lượng)`,
            }).then(res=>(res.callback = async o=> {
                    let [types, action, x, y, sl] = o.event.args;
                    let type = {
                        rương: 'chest',
                        túi: 'bag',
                    }[types];
                    if (!type)return send('hành động không hợp lệ !');
                    data = read(sid);
                    let item = data[type][y-1] && data[type][y-1][x-1];
                    if (!['thêm', 'lấy'].includes(action) && !item)return send(`vật phẩm không tồn tại !`, o);
                    switch (action) {
                    case 'vứt':
                        if (isFinite(sl)) {
                            item.quantity -=+ sl;
                            send(`đã vứt*${sl} !`, o);
                        } else {
                            data[type][y-1][x-1] = null;
                            send(`đã vứt*${item.quantity} !`, o);
                        };
                        save(data);
                        break;
                    case 'xem': {
                            let text = '';
                            let attachment = [];
                            switch (item.type) {
                            case 'seed': {
                                    let crop = crops.find(e=>e.ID == item.id);

                                    text += `[ Hạt Giống ]\n\n${crop_text(crop)}`;
                                    attachment.push(await stream_url(crop.stages[0].image));
                                };
                                break;
                            default:
                                break;
                            };
                            if (text)send({
                                body: text+'\n\n-> reaction để sử dụng vật phẩm !',
                                attachment,
                            }, o).then(res=> {
                                res.callback = $Dùng;
                                res.name = exports.config.name;
                                res.o = o;
                                client.handleReaction.push(res);
                            });
                            else send('not found item type', o);
                        };
                        break;
                    case 'dùng':
                        $Dùng(o);
                        break;
                    case 'thêm': {
                            if (isNaN(sl))sl = 1;
                            else sl =+ sl;
                            if (type != 'chest')return send('hành động "thêm" chỉ được sử dụng cho thêm vật phẩm từ túi vào rương, VD: rương thêm <X> <Y> <SL>', o);

                            let item__bag = data.bag[y-1][x-1];

                            if (!item__bag)return send('vật phẩm không tồn tại trong túi !', o);
                            if (sl > item__bag.quantity)return send('[ BAG ] vật phẩm không đủ số lượng để thêm vào rương !', o);

                            let find_item_chest = Find_item_from__bag_or_chest(data.chest, item__bag.uuid);

                            if (find_item_chest)find_item_chest.quantity += sl;
                            else {
                                let copy_item_bag = JSON.parse(JSON.stringify(item__bag));
                                copy_item_bag.quantity = sl;
                                Push_item_to__bag_or_chest(data.chest, copy_item_bag);
                            };
                            item__bag.quantity -= sl;

                            if (item__bag.quantity === 0)data.bag[y-1][x-1] = null;
                            save(data);
                            send({
                                body: 'đã thêm vật phẩm vào rương !',
                                attachment: await draw_items_on_bag_and_chest(data),
                            }, o);
                        };
                        break;
                    case 'lấy': {
                            if (isNaN(sl))sl = 1;
                            else sl =+ sl;
                            if (type != 'chest')return send('hành động "lấy" chỉ được sử dụng cho lấy vật phẩm từ rương sang túi, VD: rương lấy <X> <Y> <SL>', o);

                            let item__chest = data.chest[y-1][x-1];

                            if (!item__chest)return send('vật phẩm không tồn tại trong rương !', o);
                            if (sl > item__chest.quantity)return send('[ CHEST ] vật phẩm không đủ số lượng để lấy sang túi !', o);

                            let find_item_bag = Find_item_from__bag_or_chest(data.bag, item__chest.uuid);

                            if (find_item_bag)find_item_bag.quantity += sl;
                            else {
                                let copy_item_chest = JSON.parse(JSON.stringify(item__chest));
                                copy_item_chest.quantity = sl;
                                Push_item_to__bag_or_chest(data.bag, copy_item_chest);
                            };
                            item__chest.quantity -= sl;

                            if (item__chest.quantity === 0)data.chest[y-1][x-1] = null;
                            save(data);
                            send({
                                body: 'đã lấy vật phầm tử rương sang túi !',
                                attachment: await draw_items_on_bag_and_chest(data),
                            }, o);
                        };
                        break;
                    default:
                        send('hành động không hợp lệ !', o);
                        break;
                    };
                    async function $Dùng(o) {
                        data = read(sid);
                        switch (item.type) {
                        case 'seed':
                            send('comingsoon !', o);
                            break;
                        default:
                            send('comingsoon !', o);
                            break;
                        };
                        return '';
                    };
                    return '';
                },
                res.name = exports.config.name,
                res.o = o,
                client.handleReply.push(res)
            ));
            break;
        case 'spin': {
            let recursive_spin = res=>(res.callback = async o=> {
                data = read(sid);
                if (data.spin.remaining < 1)return send(`[!] bạn đã hết lượt quay!, (+5 sau mỗi tiếng)`, o);
                --data.spin.remaining;
                save(data);
                await send('[ SPIN ] Đang quay chờ xíu...');
                await new Promise(resolve=>setTimeout(resolve), 1000*3);

                let rewards = [...Array(10)];
                let rd = _=>Math.random()*rewards.length<<0;
                let text = '';

                [...Array(3)].map(_=>rewards[rd()] = _=>(data.gold += 100, text += '+100 gold'));
                [...Array(3)].map(_=>rewards[rd()] = _=>(data.exp += 50, text += '+50 exp'));

                let reward = rewards[rd()];

                if (!reward)send(`chúc bạn may mắn lần sau !, reaction để quay tiếp !`, o).then(recursive_spin);
                else {
                    reward();
                    let lvl = calculate_level(data.exp);
                    if (lvl > data.level)(data.level = lvl, send(`[ FARM ] Level Up 🆙 `, o));
                    send(text + ', reaction để quay tiếp !', o).then(recursive_spin);
                };
                save(data);
                return '';
            },
                res.name = exports.config.name,
                res.o = o,
                client.handleReaction.push(res)
            );
            send(`[ Spin ] bạn còn ${data.spin.remaining} lượt, reaction để quay !`).then(recursive_spin);
        };
            break;
        case 'top':
            send(`${reads().sort((a, b)=>b.level-a.level).slice(0, 10).map((e, i)=>`${i+1}. ${name(e.uid)} - lvl ${e.level}`).join('\n________\n')}`);
            break;
        case 'location':
        case '-l':
            send(`${Object.values(locations_text).map((e, i)=>`${i+1}. ${e}`).join('\n')}\n______\n- bạn đang ở khu vực ${data.location.id+1}\n-> phản hồi tin nhắn kèm <STT> để tới khu vực tương ứng`).then(res=>(res.callback = async o=> {
                data = read(sid);
                let stt = o.event.args[0]-1;

                if (!locations_text[stt])return send(`khu vực không tồn tại !`);

                data.location.id = stt;
                save(data);
                return send(`đã tới khu vực ${locations_text[stt]} !\n\n-> sử dụng ${cmd} để tương tác với khu vực`);
            },
                res.name = exports.config.name,
                res.o = o,
                client.handleReply.push(res)))
            break;
        default: {
            let cmd_text = `\n________\n- lệnh mặc định:\n • ${cmd} shop : cửa hàng vật phẩm\n • ${cmd} bag : xem túi đồ\n • ${cmd} info : xem thông tin trang trại\n • ${cmd} spin : quay & nhận phần thưởng\n • ${cmd} top : xem bảng xếp hạng farm\n • ${cmd} location : xem bản đồ khu vực trong game`;

            switch (data.location.id) {
            case 0:
                send(`[ Khu Vực - Trang Trại ]\n\n1. trồng trọt\n2. chăn nuôi\n_____\n-> Reply STT để thực hiện hành động\n${cmd_text}`).then(res=>(
                    res.callback = async o=> {
                        data = read(sid);
                        switch (o.event.args[0]) {
                        case '1':
                            send({
                                body: `[ Đất Trồng Trọt ]\n\n- sở hữu tổng ${data.lands.crops.length} mảnh đất\n\n-> reply STT từ trái qua phải để tới mảnh đất đó\n\n[!] Mảnh đất có thể mua/bán ở khu vực Bất Động Sản`,
                                attachment: await Promise.all(data.lands.crops.map(draw_crops_on_land)),
                            }).then(res=>(res.callback = async o=> {
                                    let index = o.event.args[0]-1;
                                    data = read(sid);
                                    if (!data.lands.crops[index])return send(`STT không tồn tại !`, o);
                                    Display_land(send, sid, index, o);

                                    return '';
                                },
                                res.name = exports.config.name,
                                res.o = o,
                                client.handleReply.push(res)));
                            break;
                        default:
                            send('comingsoon !')
                            break;
                        };
                        return '';
                    },
                    res.name = exports.config.name,
                    res.o = o,
                    client.handleReply.push(res)
                ));
                break;
            case 1:
                send(`[ Khu Vực - Giải Trí ]\n\n comingsoon !\n${cmd_text}`);
                break;
            case 2:
                send(`[ Khu Vực - Săn Bắn ]\n\n comingsoon !\n${cmd_text}`);
                break;
            case 3:
                send(`[ Khu Vực - Bất Động Sản ]\n\n1. Mua Đất\n2. Bán Đất\n3. Mua Nhà\n${cmd_text}`).then(res=> {
                    res.callback = async o=> {
                        switch (o.event.args[0]) {
                        case '1':
                            send('comingsoon !')
                            break;
                        default:
                            send('STT không tồn tại !');
                            break;
                        };
                        return '';
                    };
                    res.name = exports.config.name;
                    res.o = o;
                    client.handleReply.push(res);
                });
                break;
            default:
                send(`bạn đang ở khu vực không hợp lệ !`);
                break;
            };
        };
            break;
    };
};

exports.handleReaction = async o=> {
    let f = o.handleReaction;

    if (f.o.event.senderID == o.event.userID) {
        let res = await f.callback(o);
        if (res == undefined)o.api.unsendMessage(f.messageID);
    };
};
exports.handleReply = async o=> {
    let f = o.handleReply;

    if (f.o.event.senderID == o.event.senderID)(res = await f.callback(o), res == undefined?o.api.unsendMessage(f.messageID): '');
};
async function draw_crops_on_land(_crops) {
    let w = 324;
    let h = 255;
    let canvas = createCanvas(w, h);
    let ctx = canvas.getContext('2d');

    ctx.drawImage(land_image, 0, 0, w, h);

    for (let i = 0; i < _crops.length; i++)for (let j = 0; j < _crops[i].length; j++) {
        let sowned = _crops[i][j]; if (sowned == null)continue;
        let crop_w = 56;
        let crop_h = 56;
        let crop = crops.find(e=>e.ID == sowned.id);
        let devm_time = now()-sowned.timestamp;
        let stage = [...crop.stages].reverse().find(e=>devm_time > e.duration);
        ctx.drawImage(await loadImage(stage.image), crop_w*j+22, crop_h*i, crop_w, crop_h);
        ctx.font = '9.5px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'start';
        ctx.fillText(cmtt(devm_time), crop_w*j+30, crop_h*i+crop_h+12);
        ctx.font = '7.5px Arial';
        ctx.fillText(`${sowned.resistance || 0}/${crop.Resistance}`, crop_w*j+50, crop_h*i+crop_h-16)
    };

    let stream = canvas.createPNGStream();

    stream.path = 'tmp.png';

    return stream;
};
async function draw_items_on_bag_and_chest(data) {
    let w = 2048;
    let h = 945;
    let canvas = createCanvas(w, h);
    let ctx = canvas.getContext('2d');

    ctx.drawImage(bag_and_chest_image, 0, 0, w, h);

    for (let [t, t_w, t_h] of [['bag', 0, 505], ['chest', -20, 35]])
        for (let i = 0; i < data[t].length; i++)
        for (let j = 0; j < data[t][i].length; j++) {
        let item = data[t][i][j];

        if (item == null)continue;

        let new_data = {};
        switch (item.type) {
            case 'seed': new_data.img = await loadImage(crops.find(e=>e.ID == item.id).stages[0].image);
                break;
            default:
                break;
        };

        let item_w = 126;
        let item_h = 126;

        ctx.drawImage(new_data.img, item_w*j+85+t_w, item_h*i+t_h, item_w, item_h);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'end';
        ctx.fillText(item.quantity, item_w*j+item_w+75+t_w, item_h*i+item_h+t_h-70);
    };

    let stream = canvas.createPNGStream();

    stream.path = 'tmp.png';

    return stream;
};
function draw_bag(bag) {};
function draw_farm(farm) {};
function calculate_season() {
    return (new Date().getDate()-1)/3%4<<0;
};
function calculate_level(exp) {
    return Math.sqrt(exp/153)<<0;
};
function exp_to_next_level(exp, up) {
    let need = Math.ceil((calculate_level(exp)+1)**2*153);
    return up?need: need-exp;
};
function Find_col_by_STT_from_array2c(array, stt) {
    let count = 0;
    for (let i = 0; i < array.length; i++) if (typeof array[i] == 'object') for (let j = 0; j < array[i].length; j++) if (++count == stt) return array[i][j];
};
function Find_item_from__bag_or_chest(bag, id, type) {
    for (let i = 0; i < bag.length; i++) if (typeof bag[i] == 'object') for (let j = 0; j < bag[i].length; j++) {
        if (type != undefined) if (bag[i] && bag[i][j] != null && bag[i][j].id == id && bag[i][j].type == type)return bag[i][j];
        if (bag[i] && bag[i][j] != null && bag[i][j].uuid == id)return bag[i][j];
    };
};
function Push_item_to__bag_or_chest(bag, item) {
    if (!item.uuid)item.uuid = uuid();
    if (!item.timestamp)item.timestamp = now();

    for (let i = 0; i < bag.length; i++) if (typeof bag[i] == 'object') for (let j = 0; j < bag[i].length; j++) if (bag[i] && bag[i][j] == null)return bag[i][j] = item;
};
function Delete_item_from__bag_or_chest(bag, item) {
    for (let i = 0; i < bag.length; i++) if (typeof bag[i] == 'object') for (let j = 0; j < bag[i].length; j++) if (bag[i] && bag[i][j] != null && bag[i][j].uuid == item.uuid) {
        let delete_item_info = {
            i,
            j,
            item,
            author: null,
        };
        return bag[i][j] = null;
    }
};
function Items_from__bag_or_chest(bag_or_chest, sort_type, obj) {
    let count = 0;
    let text = [];

    for (let i = 0; i < bag_or_chest.length; i++) if (typeof bag_or_chest[i] == 'object') for (let j = 0; j < bag_or_chest[i].length; j++) if (bag_or_chest[i]) {
        let item = bag_or_chest[i][j]; ++count;

        if (item == null || (typeof sort_type == 'string' && item.type != sort_type))continue;
        if (obj) {
            text.push(item);
            continue;
        };

        switch (item.type) {
            case 'seed': {
                let info = crops.find(crop=>crop.ID == item.id);

                text.push(`${count}. ${info.name}🌱*${item.quantity}`);
            };
                break;
            default:
                text.push(`${count}. invalid`);
                break;
        };
    };

    return text == 0?['EMPTY']: text;
};
function Find_author_by_uuid(uuid) {};
async function Display_land(send, sid, index, o) {
    let data = read(sid);

    return send({
        body: `[ Mảnh Đất ${index+1} ]\n\n-> reply "sow" để sang tab gieo hạt giống\n-> reply "harvest" để sang tab thu hoạch`,
        attachment: await draw_crops_on_land(data.lands.crops[index]),
    }, o).then(res=> {
        res.callback = async o=> {
            data = read(sid);
            switch (o.event.args[0]) {
                case'sow':
                case'-s': {
                        if (data.lands.crops[index].every(e=>e.filter(e=>e != null).length == colums_limit_land_crops))return send('đã hết ô để gieo hạt', o);

                        send({
                            attachment: await draw_crops_on_land(data.lands.crops[index]),
                            body: `${Items_from__bag_or_chest(data.bag, 'seed').join('\n_______\n')}\n\n-> reply "STT" hạt giống và toạ độ "x y" để gieo hạt vào ô tương ứng\n-> ví dụ: 1 3 4 (gieo hạt số 1 lên cột 3 hàng 4)\n-> xuống dòng để gieo nhiều STT`
                        }).then(res=>(res.callback = async o=> {
                                data = read(sid);
                                bag_seed = Items_from__bag_or_chest(data.bag, 'seed', true);
                                let land_crops = data.lands.crops[index];
                                let body = o.event.body.split('\n').map(e=> {
                                    let [stt, x, y] = e.split(' ').map(e=>+e);
                                    let seed = bag_seed[stt-1];
                                    let crop;
                                    let content = `${stt}. `;

                                    if (!seed)return content += '[!] STT vật phẩm không tồn tại'; else crop = crops.find(e=>e.ID == seed.id);
                                    if (!crop)return (console.log('invalid item', data.uid, 'bag.seed.ID_'+seed.id, seed.uuid), content += '[!] vật phẩm không hợp lệ, đã xảy bug !');
                                    if (isNaN(x) || isNaN(y) || x < 1 || x > colums_limit_land_crops || y < 1 || y > rows_limit_land_crops)return content += '[!] vui lòng thử lại với toạ độ hợp lệ cho mảng 5x4';
                                    if (land_crops[y-1][x-1] != null)return content += `[!] ô này đã có cây trồng`;
                                    if (data.level < crop.levelReqired)return content += `[!] trang trại không đủ level để gieo hạt giống ${crop.name}`;
                                    land_crops[y-1][x-1] = {
                                        id: seed.id,
                                        uuid: uuid(),
                                        resistance: crop.Resistance,
                                        last_water: null,
                                        last_fertilizer: null,
                                        timestamp: now(),
                                    };
                                    let find_crop = Find_item_from__bag_or_chest(data.bag, seed.uuid);
                                    if (--find_crop.quantity == 0)Delete_item_from__bag_or_chest(data.bag, find_crop);
                                    return content += 'gieo thành công';
                                }).join('\n_____\n');
                                save(data);
                                return send(
                                    {
                                        body,
                                        attachment: await draw_crops_on_land(land_crops),
                                    },
                                    o);
                            }, res.name = exports.config.name, res.o = o, client.handleReply.push(res)));
                    };
                    break;
                case'harvest':
                case'-h':
                    send({
                        attachment: await draw_crops_on_land(data.lands.crops[index]),
                        body: `-> reply toạ độ x y\n-> xuống dòng để thu hoạch nhiều`
                    }).then(res=>(res.callback = async o=> {
                            data = read(sid);
                            let land_crops = data.lands.crops[index];
                            let body = o.event.body.split('\n').map((e, i)=> {
                                let [
                                    x,
                                    y
                                ] = e.split(' ');
                                let crop_sow;
                                let crop_data;
                                let content = `${i+1}. `;

                                if (isNaN(x) || isNaN(y) || x < 1 || x > colums_limit_land_crops || y < 1 || y > rows_limit_land_crops)return content += 'vui lòng thử lại với toạ độ hợp lệ cho mảng 5x4';
                                if (land_crops[y-1][x-1] == null)return content += 'crop không tồn tại';
                                else (crop_sow = land_crops[y-1][x-1], crop_data = crops.find(e=>e.ID == crop_sow.id));
                                if ((now()- crop_sow.timestamp) < crop_data.stages.at(-1).duration)return content += (x=>`cây trồng cần phát triển thêm ${x/1000/60<<0} phút ${x/1000%60<<0} giây nữa để có thể thu hoạch`)(crop_data.stages.at(-1).duration - (now()- crop_sow.timestamp));

                                land_crops[y-1][x-1] = null;
                                data.gold += crop_data.profit;
                                data.exp += crop_data.exp;
                                let lvl = calculate_level(data.exp);
                                if (lvl > data.level)(data.level = lvl, send(`[ FARM ] Level Up 🆙 `, o));
                                return content += `${crop_data.name}; +${crop_data.profit} gold; +${crop_data.exp} exp`;
                            }).join('\n_____\n');
                            save(data);
                            return send(
                                {
                                    body,
                                    attachment: await draw_crops_on_land(land_crops),
                                },
                                o);
                        }, res.name = exports.config.name, res.o = o, client.handleReply.push(res)));
                    break;
                default:
                    send(`hành động không hợp lệ!`, o);
                    break;
            };
            return '';
        },
        res.name = exports.config.name,
        res.o = o,
        client.handleReply.push(res)
    });
};
function crop_text(crop) {
    return `- Tên: ${crop.name}\n- Mô Tả: ${crop.description}\n- Mùa Vụ: ${seasons_text[crop.season]}\n- Sức Chống Chịu: ${crop.Resistance}\n- Lvl Farm Yêu Cầu: ${crop.levelReqired}\n- Giai Đoạn PT: ${crop.stages.length}\n- Giá Trị:\n • Nhập ${crop.cost}g*1\n • Lời ${crop.profit}g*1`;
};
function create_farm(send, id, o) {
    if (read(id))return send('[!] Bạn đã có trang trại.',);

    let new_player_data = {
        uuid: uuid(),
        uid: id,
        level: 0,
        exp: 0,
        gold: 10000000,
        stamina: {
            remaining: 100,
            max: 100,
        },
        location: {
            id: 0,
        },
        spin: {
            remaining: 25,
            max: 50,
            last_update: now(),
        },
        lands: {
            crops: [...Array(2)].map(_=>[...Array(rows_limit_land_crops)].map(_=>Array(colums_limit_land_crops))),
        },
        bag: [...Array(row__bag)].map(_=>Array(col__bag)),
        chest: [...Array(row__chest)].map(_=>Array(col__chest)),
        timestamp: now(),
    };
    save(new_player_data);
    send('Trang trại của bạn đã được tạo thành công.',);
};
}
catch (e) {
    console.log(e)
}

