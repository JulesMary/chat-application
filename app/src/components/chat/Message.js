import moment from 'moment';
import React from 'react';
import { DateFormat } from '../../config';

const formatDate = (d) => {
    return moment(d).format(DateFormat);
};

const Message = (props) => {
    return (
        <li className={props.className}>
            <small className="MessageHeader row">
                <span className="TimeStamp col-4">
                    {formatDate(props.timestamp)}
                </span>
                <span className="MessageAuthor col-8">{props.userName}</span>
            </small>
            <div className="MessageBody">{props.text}</div>
            {retrieveYoutubeURLs(props.text)}
        </li>
    );
};

function retrieveYoutubeURLs(text) {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const urls = text.match(urlRegex);
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let returnValue = [];
    if (urls != null) {
        urls.forEach((element) => {
            const match = element.match(regExp);
            if (match && match[2].length == 11) {
                const youtubeUrl = 'https://www.youtube.com/embed/' + match[2];
                returnValue.push(
                    <div class="plyr__video-embed" id="player">
                        <iframe
                            src={youtubeUrl}
                            allowfullscreen
                            allowtransparency
                            allow="autoplay"
                        />
                    </div>
                );
            }
        });
        return returnValue;
    }
}
export default Message;