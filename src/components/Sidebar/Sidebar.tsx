import { useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import { menuItems } from '../../constants/menuItems';
import './Sidebar.css';

const Sidebar: React.FC = () => {
    const [collapsed] = useState(false);

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Logo */}
            <div className="sidebar-logo">
                <span className="logo-icon">3S</span>
                <div className="logo-text">
                    <span className="logo-title">SMART SHIP</span>
                    <span className="logo-subtitle">SOLUTIONS</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`nav-item ${item.isActive ? 'active' : ''}`}
                    >
                        <div className="nav-item-content">
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </div>
                        {item.hasSubmenu && (
                            <HiChevronDown className="nav-chevron" size={16} />
                        )}
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">
                        <span>S</span>
                    </div>
                    <div className="user-info">
                        <span className="user-name">shadcn</span>
                        <span className="user-role">Super Admin</span>
                    </div>
                    <HiChevronUp className="user-chevron" size={16} />
                </div>

                {/* Stream Brand */}
                <div className="sidebar-brand">
                    <span className="brand-name">Stream.</span>
                    <span className="brand-subtitle">powered by 3S Smart Ships Solutions</span>
                    <span className="brand-version">version 0.0.1</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
