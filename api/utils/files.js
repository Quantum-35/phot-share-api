const uploadStream = (stream, path) => (
    new Promise((resolve, reject) => {
        console.log('===>',stream)
        stream.on('error', error => {
            if(stream.truncated) {
                false.unlinkSync(path)
            }
            reject(error);
        }).on('end', resolve)
        .pipe(fs.createWriteStream(path))
    })
);

module.exports = uploadStream;