import React from 'react';
import './Header.css';

interface HeaderProps {
    breadcrumbs?: string[];
}

const Header: React.FC<HeaderProps> = ({
    breadcrumbs = ['Fleet management', 'Sagar Kanya', 'Vessel Hierarchy Tree']
}) => {
    return (
        <header className="header">
            <nav className="breadcrumb">
                {breadcrumbs.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span className="breadcrumb-separator">/</span>}
                        <span
                            className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                        >
                            {item}
                        </span>
                    </React.Fragment>
                ))}
            </nav>
        </header>
    );
};

export default Header;
