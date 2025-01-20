'use client';

import React, { useState } from 'react';

const StudentTrackingSystem: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Personal Info');

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '20px', textAlign: 'center' }}>
                <h1>GitBot - Student Tracking System</h1>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search students..."
                        style={{
                            width: '60%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '20px' }}>
                    {/* Sidebar */}
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        <h2>Students</h2>
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <div
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #eee',
                                    cursor: 'pointer',
                                }}
                            >
                                Geesath - Grade 10
                            </div>
                            <div
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #eee',
                                    cursor: 'pointer',
                                }}
                            >
                                Hirusha - Grade 11
                            </div>
                            <div
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #eee',
                                    cursor: 'pointer',
                                }}
                            >
                                Tommy - Grade 9
                            </div>
                        </div>
                    </div>

                    {/* Student Details */}
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <div
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ddd',
                                    marginRight: '20px',
                                }}
                            ></div>
                            <div>
                                <h2>Geesath</h2>
                                <p>Student ID: 2024001</p>
                                <p>Grade: 10</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                            {['Personal Info', 'Academic', 'Extracurricular', 'Achievements'].map((tab) => (
                                <div
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    style={{
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                        borderBottom: activeTab === tab ? '2px solid #2c3e50' : '2px solid transparent',
                                        color: activeTab === tab ? '#2c3e50' : 'inherit',
                                    }}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>

                        {/* Tab Contents */}
                        {activeTab === 'Personal Info' && (
                            <div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Geesath"
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        defaultValue="2007-05-15"
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </div>
                                <button
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#2c3e50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}

                        {activeTab === 'Academic' && <div>Academic Details...</div>}
                        {activeTab === 'Extracurricular' && <div>Extracurricular Details...</div>}
                        {activeTab === 'Achievements' && <div>Achievements Details...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentTrackingSystem;
