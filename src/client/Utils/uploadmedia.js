export function addContent(form, target) {
  let formData = new FormData(form);
  return new Promise((resolve) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', target);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(formData);
    xhr.onload = (event) => {
      if (event.target.status === 200) {
        const contentResponse = JSON.parse(event.target.response);
        if (contentResponse.errors && contentResponse.errors.length > 0) {
          return resolve({errorMsg: contentResponse.errors[0].errorMessage});
        }
        return resolve(contentResponse);
      }
      return resolve({errorMsg: 'upload fejlede'});
    };
  });
}

function handleImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const attachment = {image: e.target.result, video: null};
      return resolve({attachment: attachment});
    };
    reader.readAsDataURL(file);
  });
}

function handleVideo(file, onProgress) {
  return new Promise((resolve, reject) => {
    file.progress = 0;
    const attachment = {image: null, video: {file: file}};
    const form = new FormData();
    form.append('video', file);
    const XHR = new XMLHttpRequest();
    XHR.open('POST', '/api/uploadmedia');
    XHR.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentage = (e.loaded / e.total) * 100;
        attachment.video.file.progress = percentage;
        if (onProgress) {
          onProgress(attachment);
        }
      }
    };

    XHR.onerror = () => {
      return reject({attachment: attachment});
    };

    XHR.onload = (e) => {
      if (e.target.status === 200) {
        attachment.video.file.progress = 100;
        return resolve({attachment: attachment});
      }
      return reject({attachment: attachment});
    };
    XHR.send(form);
  });
}

export function readInput(event, onProgress) {
  return new Promise((resolve, reject) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const type = file.type.split('/')[0];

      if (type === 'image') {
        return resolve(handleImage(file));
      }

      if (type === 'video') {
        return resolve(handleVideo(file, onProgress));
      }
    }
    return reject({errorMsg: 'filtype ikke understøttet'});
  });
}
