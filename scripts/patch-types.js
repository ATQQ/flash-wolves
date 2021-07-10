const fs = require('fs')
const path = require('path')

/**
 * 递归获取指定目录中的所有文件的绝对路径路径
 * @param {string} dir 目标目录
 * @param {string[]} 
 * @returns {string[]} 文件绝对路径数组
 */
function getDirFiles(dir) {
    let result = []
    let files = fs.readdirSync(dir, { withFileTypes: true })
    files.forEach(file => {
        const filepath = path.join(dir, file.name)
        if (file.isFile()) {
            result.push(filepath)
        } else if (file.isDirectory()) {
            result.push(...getDirFiles(filepath))
        }
    })
    return result;
}

const dir = path.resolve(__dirname, '../dist/temp')
const dtsList = getDirFiles(dir).filter(v => v.endsWith('d.ts'))
dtsList.forEach(dts => {
    const depth = dts.replace(dir, '').split('/').length
    const text = fs.readFileSync(dts, { encoding: 'utf-8' })
    fs.writeFileSync(dts, text.replace(`from 'types'`, `from '${new Array(depth).fill('../').join('')}types'`))
})