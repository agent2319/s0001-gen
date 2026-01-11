import React from 'react';
import { useStore } from '../store';

// Simple block renderer for production
const BlockRenderer: React.FC<{ block: any }> = ({ block }) => {
    const data = block.localOverrides?.data || {};
    const style = block.localOverrides?.style || {};
    const layout = block.localOverrides?.layout || {};

    // Base styles
    const containerStyle: React.CSSProperties = {
        padding: `${layout.paddingY || 20}px ${layout.paddingX || 40}px`,
        maxWidth: layout['F-L06'] === '100%' ? '100%' : `${layout['F-L06'] || 1200}px`,
        margin: '0 auto',
        borderRadius: style.borderRadius || '0px',
    };

    // Render based on block type
    switch (block.type) {
        case 'B0101': // Navbar
            return (
                <nav style={{ ...containerStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: layout['F-L04'] || 80 }}>
                    <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{data.header || 'Logo'}</span>
                </nav>
            );

        case 'B0201': // Hero
            return (
                <section style={{ ...containerStyle, textAlign: 'center', paddingTop: 100, paddingBottom: 100 }}>
                    <h1 style={{
                        fontSize: data.titleTypo?.fontSize ? `${data.titleTypo.fontSize}px` : '48px',
                        fontWeight: data.titleTypo?.fontWeight || 800,
                        letterSpacing: data.titleTypo?.letterSpacing ? `${data.titleTypo.letterSpacing}em` : '-0.02em',
                        lineHeight: data.titleTypo?.lineHeight || 1.1,
                        textTransform: data.titleTypo?.uppercase ? 'uppercase' : 'none',
                        marginBottom: '1.5rem'
                    }}>
                        {data.title || 'Hero Title'}
                    </h1>
                    <p style={{
                        fontSize: data.descriptionTypo?.fontSize ? `${data.descriptionTypo.fontSize}px` : '20px',
                        fontWeight: data.descriptionTypo?.fontWeight || 400,
                        lineHeight: data.descriptionTypo?.lineHeight || 1.5,
                        maxWidth: '700px',
                        margin: '0 auto',
                        opacity: 0.8
                    }}>
                        {data.description || 'Description text'}
                    </p>
                </section>
            );

        default:
            // Generic block renderer
            if (data.title || data.header) {
                return (
                    <section style={containerStyle}>
                        {data.title && <h2>{data.title}</h2>}
                        {data.header && <h3>{data.header}</h3>}
                        {data.description && <p>{data.description}</p>}
                    </section>
                );
            }
            return null;
    }
};

export const Viewer: React.FC = () => {
    const { contentBlocks, globalSettings } = useStore();

    // Get colors from global settings
    const colors = globalSettings?.GL02?.params || [];
    const bgColor = colors.find((p: any) => p.id === 'P1')?.value || '#09090B';
    const textColor = colors.find((p: any) => p.id === 'P4')?.value || '#FFFFFF';

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: bgColor,
            color: textColor,
        }}>
            {contentBlocks.map((block: any) => (
                block.isVisible !== false && (
                    <BlockRenderer key={block.id} block={block} />
                )
            ))}
        </div>
    );
};
