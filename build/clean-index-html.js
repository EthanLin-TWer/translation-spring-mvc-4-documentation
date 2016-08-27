const fs = require('fs')
const index = fs.readFileSync('index.html', 'utf-8')

const MARKER_INTERPOLATION_START = '<!-- interpolation-start -->'
const MARKER_INTERPOLATION_END = '<!-- interpolation-end -->'

let interp_start = index.indexOf(MARKER_INTERPOLATION_START) + MARKER_INTERPOLATION_START.length
let interp_end = index.indexOf(MARKER_INTERPOLATION_END)
let contents = index.substring(interp_start, interp_end)

fs.writeFileSync('index.html', index.replace(contents, ''), 'utf-8')
