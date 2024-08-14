import React from 'react';
import { useState } from 'react';
const TabSwitcher = ({ tabs }: any) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    return (
        <div className='px-4'>
            <ul className='flex space-x-4'>
                {tabs.map((tab: any, index: number) => (
                    <li
                        key={index}
                        className={`cursor-pointer list-none px-4 py-2 rounded w-full text-center ${
                            index === activeTab
                                ? 'text-black border-b-4 border-black'
                                : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab.label}
                    </li>
                ))}
            </ul>
            <div className='mt-4'>{tabs[activeTab].content}</div>
        </div>
    );
};

export default TabSwitcher;