import React from 'react';
import { PRIMARY_COLOR, PRIMARY_COLOR_CODE } from '../../data/constants';

const Header = ({ activeMenuLabel }) => (
    <div className="bg-white px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="text-sm flex items-center">
            <span className="text-gray-500 font-medium">PKB / Kec. Bandung Kidul /</span>
            <span className={`font-bold text-${PRIMARY_COLOR}-${PRIMARY_COLOR_CODE} ml-2 text-base`}>{activeMenuLabel}</span>
        </div>
        <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="font-semibold text-gray-800 text-sm">{localStorage.getItem("name")}</p>
                <p className="text-xs text-gray-500">{localStorage.getItem("role")}</p>
            </div>
            <div className={`w-10 h-10 bg-${PRIMARY_COLOR}-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md cursor-pointer transition duration-300`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
);

export default Header;