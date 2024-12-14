import React from 'react';
import { SiteHeader } from '@/components/HomePage/site-header';
const ContactsPage: React.FC = () => {
    return (
        <>
            <SiteHeader/>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3699.624263798831!2d106.68363053758665!3d10.76410153523776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x31752f1c06f4e1dd%3A0x43900f1d4539a3d!2zVW5pdmVyc2l0eSBvZiBTY2llbmNlIC0gVk5VSENNLCDEkMaw4budbmcgTmd1eeG7hW4gVsSDbiBD4burLCBQaMaw4budbmcgNCwgRGlzdHJpY3QgNSwgSG8gQ2hpIE1pbmggQ2l0eQ!3m2!1d10.762835599999999!2d106.6824824!4m5!1s0x31752f1c06f4e1dd%3A0x43900f1d4539a3d!2zVW5pdmVyc2l0eSBvZiBTY2llbmNlIC0gVk5VSENNLCAyMjcgxJAuIE5ndXnhu4VuIFbEg24gQ-G7qywgUGjGsOG7nW5nIDQsIFF14bqtbiA1LCBI4buTIENow60gTWluaCwgVmlldG5hbQ!3m2!1d10.762835599999999!2d106.6824824!5e0!3m2!1sen!2s!4v1734143697234!5m2!1sen!2s" 
                    width="600" 
                    height="450" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </>
    );
};

export default ContactsPage;