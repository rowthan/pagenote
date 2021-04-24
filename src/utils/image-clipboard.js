var imgReader = function( item,callback ){
    var blob = item.getAsFile(),
        reader = new FileReader();
    // 读取文件后将其显示在网页中
    reader.onload = function( e ){
        callback(e.target.result); // TODO 使用系统路径存储方式，或上传服务器
    };
    // 读取文件
    reader.readAsDataURL( blob );
};

function clipBoard(e,callback) {
    var clipboardData = e.clipboardData,
        i = 0,
        items, item, types;
    if( clipboardData ){
        items = clipboardData.items;
        if( !items ){
            return;
        }
        item = items[0];
        // 保存在剪贴板中的数据类型
        types = clipboardData.types || [];
        for( ; i < types.length; i++ ){
            if( types[i] === 'Files' ){
                item = items[i];
                break;
            }
        }
        // 判断是否为图片数据
        if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
            imgReader( item,function (result) {
                // var img = new Image();
                // img.src = result;
                callback({
                    type: 'img',
                    content: result,
                })
            } );
        }else {
            item.getAsString(function (result) {
                callback({
                    type: 'text',
                    content: result,
                })
            });
        }
    }
}

export {
    imgReader,
    clipBoard,
}