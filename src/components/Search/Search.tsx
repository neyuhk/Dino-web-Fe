import React, { useState } from 'react';
import './Search.css';

import { Search as SearchIcon } from 'lucide-react';
import { SearchProps } from '../../model/course.ts'

const Search: React.FC<SearchProps> = ({ onSearch, placeholder = 'Tìm kiếm khóa học...' }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="search-container">
            <SearchIcon className="search-icon" size={20} />
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
    );
};

export default Search;