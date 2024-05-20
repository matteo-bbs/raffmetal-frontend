import React, { useState } from 'react';

const SearchButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        history.push(`/search?query=${searchTerm}`);
    };

    return (
        <div className={'bg-rSecondary'}>
            <button onClick={() => setIsOpen(!isOpen)}>Search</button>
            {isOpen && (
                <div>
                    <input
                        type="text"
                        placeholder="Search by title"
                        className={'bg-rSecondary'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Go</button>
                </div>
            )}
        </div>
    );
};

export default SearchButton;