"use strict";

function findImg(msg) {

    let promise = new Promise((resolve, reject) => {
        if (Array.from(msg.attachments.values()).length > 0) {
            if (!Array.from(msg.attachments.values())[0].contentType.startsWith("image/")) reject("NOT_IMAGE");
            resolve(Array.from(msg.attachments.values())[0].attachment);
        } else {
            msg.channel.messages.fetch({ limit: 5 }).then(messages => {
                let msgsArr = Array.from(messages.values());
                for (let i in msgsArr) {
                    let firstAttachment = Array.from(msgsArr[i].attachments.values())[0];
                    if (typeof(firstAttachment) === "undefined") continue;
                    if (firstAttachment.contentType.startsWith("image/")) resolve(firstAttachment.attachment);
                };
                reject("NO_IMAGE");
            });
        };
    });
    return promise;

};

module.exports = findImg;
