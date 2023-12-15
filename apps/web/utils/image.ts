import JSZip from "jszip";
import {SnapshotResource} from "@pagenote/shared/lib/@types/data";
export function downloadBase64Images(base64Images: Partial<SnapshotResource>[]) {

    var zip = new JSZip();

    function fetchImage(url:string) {
        return fetch(`${url}`, {
            method: 'GET',
            headers: {
                'Origin': window.location.origin,
            },
        })
            .then(response => response.blob());
    }

    var imagePromises = base64Images.map(function(item, index) {
        var blobPromise;

        const data = item.url || item.uri || '';
        if (data.startsWith("data:")) {
            var binaryData = atob(data.split(',')[1]);
            var arrayBuffer = new Uint8Array(binaryData.length);
            for (var i = 0; i < binaryData.length; i++) {
                arrayBuffer[i] = binaryData.charCodeAt(i);
            }
            blobPromise = Promise.resolve(new Blob([arrayBuffer], { type: 'image/jpeg' }));
        } else {
            blobPromise = fetchImage(data);
        }

        blobPromise.then(blob => {
            // Add the image to the zip file, using index as the filename
            zip.file('image' + index + '.jpeg', blob);
        });

        return blobPromise;
    });

    Promise.all(imagePromises).then(function() {
        zip.generateAsync({ type: 'blob' }).then(function(content) {
            var a = document.createElement('a');
            var url = URL.createObjectURL(content);
            a.href = url;
            a.download = 'images.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });
}
