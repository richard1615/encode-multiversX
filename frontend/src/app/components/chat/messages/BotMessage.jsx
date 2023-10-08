import React, { useState, useEffect } from 'react';
import Highlight from 'react-highlight';
import Button from './Button';
import Image from 'next/image';

const BotMessage = ({ message }) => {
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [messageSegments, setMessageSegments] = useState([]);

    useEffect(() => {
        const parsed = message.match(/\$start\$(.*?)\|(.*?)\$end\$/);
        if (parsed && parsed.length === 3) {
            setTransactionDetails({ address: parsed[1], amount: parsed[2] });
        }
    }, [message]);

    useEffect(() => {
        const segments = [];
        let remainingMsg = message.replace(/\$start\$(.*?)\|(.*?)\$end\$/, ''); // Removing transaction details

        const extractAndHighlight = (pattern) => {
            const match = remainingMsg.match(pattern);
            if (match) {
                const codeStart = match.index;
                const codeEnd = codeStart + match[0].length;
                const codeContent = match[1];

                if (codeStart > 0) {
                    segments.push(remainingMsg.substring(0, codeStart));
                }

                segments.push(<Highlight className="language-rust m-2 rounded-lg" key={segments.length}>{codeContent}</Highlight>);
                remainingMsg = remainingMsg.substring(codeEnd);
            }
        };

        while (remainingMsg) {
            if (remainingMsg.includes('```')) {
                extractAndHighlight(/```(.*?)```/s); // Adjusted the regex to detect triple backticks
            } else {
                segments.push(remainingMsg);
                remainingMsg = '';
            }
        }

        setMessageSegments(segments);
    }, [message]);

    const handleTransactionClick = () => {
        console.log(`Sending ${transactionDetails.amount} eGold to ${transactionDetails.address}`);
    };

    return (
        <div className='flex justify-start w-full relative mb-6 max-w-3xl'>
            <div className='flex bg-light-cream rounded-2xl p-5'>
                <div className='flex flex-shrink-0 m-2 rounded-full overflow-hidden'>
                    <Image src="/icons/avatar-1.svg" alt="User Profile" width={50} height={50} />
                </div>
                <div className='flex flex-col text-gray-700 ml-1 flex-grow overflow-hidden'>
                    {messageSegments.map((segment, index) => (
                        <React.Fragment key={index}>{segment}</React.Fragment>
                    ))}
                    {transactionDetails && (
                        <Button onClick={handleTransactionClick} />
                    )}
                </div>
            </div>
            <span className='w-10 h-10 rounded-br-full bg-light-cream absolute bottom-0 left-0 transform translate-y-1/2'></span>
        </div>
    )
}

export default BotMessage;
