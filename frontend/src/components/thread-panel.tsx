import groupBy from 'lodash/groupBy.js';

import type {Message} from '../entities/messages';
import {useMessages} from '../hooks/useMessages';

const JSONContent: React.FC<{value: Message[]}> = function ({value}) {
    return <pre className="bg-body-tertiary p-3 rounded mt-3">{JSON.stringify(value, null, 1)}</pre>;
};

const MessagesPanel = function () {
    const {data: messages} = useMessages();
    const byCustomer = groupBy(messages, 'customer_id');

    return Object.keys(byCustomer).map((customer_id) => (
        <div key={customer_id} className="shadow-lg">
            <JSONContent value={byCustomer[customer_id]} />
        </div>
    ));
};

export const ThreadPanel: React.FC<{customerId: string}> = function ({customerId}) {
    console.log(customerId);

    return (
        <main className="app-content">
            <div className="app-content__inner container">
                <MessagesPanel />
            </div>
        </main>
    );
};
