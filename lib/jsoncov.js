exports = module.exports = JSONCov;

var config = require('./config');
var fs = require('fs');

function JSONCov(name, coverage) {
    var result = map(coverage);
    return fs.writeFileSync(JSONCov.config.getCoverageDir() + '/' + name.replace(/\s/, '_') + '.json', JSON.stringify(result));
}

JSONCov.config = null;

function map(cov) {
    var ret = {
        instrumentation: 'node-jscoverage',
        sloc: 0,
        hits: 0,
        misses: 0,
        coverage: 0,
        files: []
    }

    for (var filename in cov) {
        var data = coverage(filename, cov[filename]);
        ret.files.push(data);
        ret.hits += data.hits;
        ret.misses += data.misses;
        ret.sloc += data.sloc;
    }

    ret.files.sort(function(l, r) {
        return l.filename.localeCompare(b.filename);
    });

    if (ret.sloc > 0) {
        ret.coverage = (ret.hits / ret.sloc) * 100;
    }

    return ret;
}

function coverage(filename, data) {
    var ret = {
        filename: filename,
        coverage: 0,
        hits: 0,
        misses: 0,
        sloc: 0,
        source: {}
    }

    data.source.forEach(function(line, num){
        num++;

        if (data[num] === 0) {
            ret.misses++;
            ret.sloc++;
        } else if (data[num] !== undefined) {
            ret.hits++;
            ret.sloc++;
        }

        ret.source[num] = {
            source : line,
            coverage : data[num] === undefined ? '' : data[num]
        };
    })

    ret.coverage = ret.hits / ret.sloc * 100;

    return ret;
}