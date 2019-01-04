import moment from 'moment';
import React from 'react';
import { MultiLineParser } from 'text-emoji-parser';
import { DateFormat } from '../../config';
import { Emoji } from 'emoji-mart';

const url = 'https://translate.yandex.net/api/v1.5/tr.json/translate',
    keyAPI =
        'trnsl.1.1.20190103T181139Z.7464426976138302.da0198e0cc346b526c18e9ffa40aa8144de2282d';

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
            <div className="MessageBody">
                {MultiLineParser(
                    props.text,
                    {
                        SplitLinesTag: 'p',
                        Rule: /(?:\:[^\:]+\:(?:\:skin-tone-(?:\d)\:)?)/gi,
                    },
                    (Rule, ruleNumber) => {
                        return <Emoji emoji={Rule} size={48} />;
                    }
                )}
            </div>
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
        urls.forEach((element, index) => {
            const match = element.match(regExp);
            if (match && match[2].length == 11) {
                const youtubeUrl = 'https://www.youtube.com/embed/' + match[2];
                returnValue.push(
                    <div key={index} className="plyr__video-embed" id="player">
                        <iframe
                            src={youtubeUrl}
                            allowFullScreen
                            allowtransparency={''}
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
