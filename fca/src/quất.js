"use strict"

module.exports = (defaultFuncs, api, ctx) => {
    let [
        { get, post },
        { readFileSync, writeFileSync: write, existsSync: exists, mkdirSync: mkdir, createReadStream: reads, createWriteStream: writes, unlinkSync: unlink },
        { tz }
    ] = ['axios', 'fs', 'moment-timezone'].map(a => require(a)),
        { keys, values, entries, fromEntries } = Object,
        { parse, stringify } = JSON,
        read = a => readFileSync(a, 'utf8'),
        par = a => parse(read(a)),
        ify = (a, b) => write(a, stringify(b, null, 1)),
        save = (a, b) => get(a, { responseType: 'stream' }).then(a => a.data.pipe(writes(b))),
        [json, stream, func] = ['json', 'stream', 'func'].map(a => b => `${process.cwd()}/modules/commands/${a}/${b}`),
        have = (a, b, c) => !exists(a) ? (b == 1 ? write(a, c) : mkdir(a)) : '',
        dịch = a => get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${encodeURIComponent(a)}`).then(b => b.data[0][0][0]),
        time = a => tz("Asia/Ho_Chi_minh").format(a)
    return {
        get, post,
        read, write, exists, mkdir, reads, writes, unlink,
        par, ify,
        keys, values, entries, fromEntries,
        save,
        defaultFuncs, api, ctx,
        json, stream, func, have,
        dịch, time
    }
}
