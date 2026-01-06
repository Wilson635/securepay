import * as React from "react";

const DottedBackground: React.FC<{ isDark: boolean }> = ({ isDark }) => (
    <div className="fixed inset-0 -z-10">
        <div
            className="absolute inset-0"
            style={{
                backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
            }}
        />
    </div>
);

export default DottedBackground;